create extension if not exists pgcrypto;

create type public.tournament_location_type as enum ('live', 'online');
create type public.tournament_format as enum (
  'freezeout',
  'reentry',
  'rebuy_add_on',
  'regular_bounty',
  'progressive_knockout',
  'mystery_bounty',
  'satellite',
  'step_satellite',
  'multi_flight'
);
create type public.tournament_speed as enum ('regular', 'turbo', 'hyper', 'deepstack', 'unknown');
create type public.entry_method as enum ('direct', 'satellite_ticket', 'promotional_ticket', 'step_ticket');
create type public.rule_classification as enum ('safe', 'elevated_risk', 'shot', 'blocked');
create type public.ledger_transaction_type as enum (
  'deposit',
  'withdrawal',
  'tournament_buy_in',
  'tournament_return',
  'ticket_purchase',
  'ticket_conversion',
  'adjustment',
  'fee',
  'rakeback',
  'bonus'
);
create type public.ticket_status as enum ('available', 'used', 'expired', 'converted', 'voided');
create type public.rule_mode as enum ('strict', 'warning_only');

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.prevent_ledger_mutation()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  raise exception 'Bankroll transactions are immutable. Create a reversing transaction instead.';
end;
$$;

create table public.user_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  base_currency text not null default 'USD',
  display_name text,
  timezone text not null default 'UTC',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.bankroll_rules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null default 'Default MTT rules',
  mode public.rule_mode not null default 'strict',
  base_currency text not null default 'USD',
  min_reserve_freezeout numeric(12,2) not null default 100,
  min_reserve_reentry numeric(12,2) not null default 150,
  min_reserve_rebuy_add_on numeric(12,2) not null default 200,
  min_reserve_bounty numeric(12,2) not null default 125,
  min_reserve_satellite numeric(12,2) not null default 50,
  max_daily_loss_base numeric(14,2),
  max_daily_spend_base numeric(14,2),
  max_reentries_per_tournament integer not null default 2,
  max_series_budget_base numeric(14,2),
  satellite_budget_base numeric(14,2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint bankroll_rules_reserves_non_negative check (
    min_reserve_freezeout >= 0
    and min_reserve_reentry >= 0
    and min_reserve_rebuy_add_on >= 0
    and min_reserve_bounty >= 0
    and min_reserve_satellite >= 0
  )
);

create table public.bankroll_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type public.ledger_transaction_type not null,
  occurred_at timestamptz not null default now(),
  original_currency text not null,
  original_amount numeric(14,2) not null,
  base_currency text not null,
  amount_base numeric(14,2) not null,
  exchange_rate numeric(20,8) not null default 1,
  tournament_id uuid,
  entry_id uuid,
  ticket_id uuid,
  description text,
  external_ref text,
  created_at timestamptz not null default now(),
  constraint bankroll_transactions_exchange_rate_positive check (exchange_rate > 0)
);

create table public.daily_session_budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  session_date date not null,
  planned_spend_base numeric(14,2) not null,
  max_loss_base numeric(14,2),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, session_date)
);

create table public.tournament_series (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  platform_or_venue text,
  start_date date not null,
  end_date date,
  budget_base numeric(14,2) not null,
  satellite_budget_base numeric(14,2),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.tournaments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  series_id uuid references public.tournament_series(id) on delete set null,
  name text not null,
  platform_or_venue text not null,
  location_type public.tournament_location_type not null,
  starts_at timestamptz not null,
  currency text not null,
  format public.tournament_format not null,
  speed public.tournament_speed not null default 'unknown',
  base_buy_in numeric(14,2) not null,
  fee numeric(14,2) not null default 0,
  guarantee numeric(14,2),
  field_size integer,
  starting_stack integer,
  starting_big_blinds numeric(10,2),
  late_registration_open boolean not null default false,
  flight text,
  planned_classification public.rule_classification,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tournaments_money_non_negative check (base_buy_in >= 0 and fee >= 0 and coalesce(guarantee, 0) >= 0)
);

create table public.satellite_campaigns (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  target_tournament_id uuid references public.tournaments(id) on delete set null,
  starts_at timestamptz,
  budget_base numeric(14,2) not null,
  total_spend_base numeric(14,2) not null default 0,
  realized_value_base numeric(14,2) not null default 0,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  campaign_id uuid references public.satellite_campaigns(id) on delete set null,
  source_tournament_id uuid references public.tournaments(id) on delete set null,
  ticket_type public.entry_method not null,
  status public.ticket_status not null default 'available',
  currency text not null,
  face_value numeric(14,2) not null,
  face_value_base numeric(14,2) not null,
  exchange_rate numeric(20,8) not null default 1,
  expires_at timestamptz,
  used_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tickets_value_non_negative check (face_value >= 0 and face_value_base >= 0 and exchange_rate > 0)
);

create table public.tournament_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  tournament_id uuid not null references public.tournaments(id) on delete cascade,
  ticket_id uuid references public.tickets(id) on delete set null,
  bullet_number integer not null,
  entry_method public.entry_method not null,
  amount_paid numeric(14,2) not null default 0,
  amount_paid_base numeric(14,2) not null default 0,
  fee numeric(14,2) not null default 0,
  fee_base numeric(14,2) not null default 0,
  add_on numeric(14,2) not null default 0,
  add_on_base numeric(14,2) not null default 0,
  exchange_rate numeric(20,8) not null default 1,
  reentry_at timestamptz,
  stack_at_entry integer,
  big_blinds_at_entry numeric(10,2),
  planned boolean not null default true,
  rule_exception_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tournament_id, bullet_number),
  constraint tournament_entries_money_non_negative check (
    amount_paid >= 0 and amount_paid_base >= 0 and fee >= 0 and fee_base >= 0 and add_on >= 0 and add_on_base >= 0 and exchange_rate > 0
  )
);

alter table public.bankroll_transactions
  add constraint bankroll_transactions_tournament_fk
  foreign key (tournament_id) references public.tournaments(id) on delete set null;
alter table public.bankroll_transactions
  add constraint bankroll_transactions_entry_fk
  foreign key (entry_id) references public.tournament_entries(id) on delete set null;
alter table public.bankroll_transactions
  add constraint bankroll_transactions_ticket_fk
  foreign key (ticket_id) references public.tickets(id) on delete set null;

create table public.tournament_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  tournament_id uuid not null unique references public.tournaments(id) on delete cascade,
  finishing_position integer,
  total_field_size integer,
  normal_prize numeric(14,2) not null default 0,
  normal_prize_base numeric(14,2) not null default 0,
  bounty_prize numeric(14,2) not null default 0,
  bounty_prize_base numeric(14,2) not null default 0,
  total_cash_returned numeric(14,2) not null default 0,
  total_cash_returned_base numeric(14,2) not null default 0,
  final_table boolean not null default false,
  duration_minutes integer,
  emotional_state text,
  rule_deviation text,
  bust_out_notes text,
  attachment_refs text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tournament_results_money_non_negative check (
    normal_prize >= 0 and normal_prize_base >= 0 and bounty_prize >= 0 and bounty_prize_base >= 0
    and total_cash_returned >= 0 and total_cash_returned_base >= 0
  )
);

create table public.csv_imports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  import_type text not null,
  file_name text not null,
  row_count integer not null default 0,
  status text not null default 'pending',
  error_report jsonb,
  created_at timestamptz not null default now()
);

create index bankroll_transactions_user_occurred_idx on public.bankroll_transactions(user_id, occurred_at);
create index tournaments_user_starts_idx on public.tournaments(user_id, starts_at);
create index tournament_entries_user_tournament_idx on public.tournament_entries(user_id, tournament_id);
create index tournament_results_user_tournament_idx on public.tournament_results(user_id, tournament_id);
create index tickets_user_status_idx on public.tickets(user_id, status);

create trigger user_profiles_set_updated_at before update on public.user_profiles for each row execute function public.set_updated_at();
create trigger bankroll_rules_set_updated_at before update on public.bankroll_rules for each row execute function public.set_updated_at();
create trigger daily_session_budgets_set_updated_at before update on public.daily_session_budgets for each row execute function public.set_updated_at();
create trigger tournament_series_set_updated_at before update on public.tournament_series for each row execute function public.set_updated_at();
create trigger tournaments_set_updated_at before update on public.tournaments for each row execute function public.set_updated_at();
create trigger satellite_campaigns_set_updated_at before update on public.satellite_campaigns for each row execute function public.set_updated_at();
create trigger tickets_set_updated_at before update on public.tickets for each row execute function public.set_updated_at();
create trigger tournament_entries_set_updated_at before update on public.tournament_entries for each row execute function public.set_updated_at();
create trigger tournament_results_set_updated_at before update on public.tournament_results for each row execute function public.set_updated_at();
create trigger bankroll_transactions_no_update before update on public.bankroll_transactions for each row execute function public.prevent_ledger_mutation();
create trigger bankroll_transactions_no_delete before delete on public.bankroll_transactions for each row execute function public.prevent_ledger_mutation();

alter table public.user_profiles enable row level security;
alter table public.bankroll_rules enable row level security;
alter table public.bankroll_transactions enable row level security;
alter table public.daily_session_budgets enable row level security;
alter table public.tournament_series enable row level security;
alter table public.tournaments enable row level security;
alter table public.satellite_campaigns enable row level security;
alter table public.tickets enable row level security;
alter table public.tournament_entries enable row level security;
alter table public.tournament_results enable row level security;
alter table public.csv_imports enable row level security;

grant usage on schema public to authenticated;
grant select, insert, update on public.user_profiles to authenticated;
grant select, insert, update, delete on public.bankroll_rules to authenticated;
grant select, insert on public.bankroll_transactions to authenticated;
grant select, insert, update, delete on public.daily_session_budgets to authenticated;
grant select, insert, update, delete on public.tournament_series to authenticated;
grant select, insert, update, delete on public.tournaments to authenticated;
grant select, insert, update, delete on public.satellite_campaigns to authenticated;
grant select, insert, update, delete on public.tickets to authenticated;
grant select, insert, update, delete on public.tournament_entries to authenticated;
grant select, insert, update, delete on public.tournament_results to authenticated;
grant select, insert on public.csv_imports to authenticated;

create policy "Users can read own profile" on public.user_profiles for select to authenticated using ((select auth.uid()) = user_id);
create policy "Users can insert own profile" on public.user_profiles for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Users can update own profile" on public.user_profiles for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create policy "Users can read own rules" on public.bankroll_rules for select to authenticated using ((select auth.uid()) = user_id);
create policy "Users can insert own rules" on public.bankroll_rules for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Users can update own rules" on public.bankroll_rules for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Users can delete own rules" on public.bankroll_rules for delete to authenticated using ((select auth.uid()) = user_id);

create policy "Users can read own ledger" on public.bankroll_transactions for select to authenticated using ((select auth.uid()) = user_id);
create policy "Users can append own ledger" on public.bankroll_transactions for insert to authenticated with check ((select auth.uid()) = user_id);

create policy "Users can manage own sessions" on public.daily_session_budgets for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Users can manage own series" on public.tournament_series for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Users can manage own tournaments" on public.tournaments for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Users can manage own satellite campaigns" on public.satellite_campaigns for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Users can manage own tickets" on public.tickets for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Users can manage own entries" on public.tournament_entries for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Users can manage own results" on public.tournament_results for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create policy "Users can read own imports" on public.csv_imports for select to authenticated using ((select auth.uid()) = user_id);
create policy "Users can create own imports" on public.csv_imports for insert to authenticated with check ((select auth.uid()) = user_id);
