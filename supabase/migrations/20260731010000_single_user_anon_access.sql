do $$
begin
  insert into public.user_profiles (user_id, base_currency, timezone)
  values ('2a68df45-4ad8-48f4-a991-f7cf87c8f8b4', 'USD', 'UTC')
  on conflict (user_id) do nothing;
end $$;

grant usage on schema public to anon;
grant select, insert, update on public.user_profiles to anon;
grant select, insert, update, delete on public.bankroll_rules to anon;
grant select, insert on public.bankroll_transactions to anon;
grant select, insert, update, delete on public.daily_session_budgets to anon;
grant select, insert, update, delete on public.tournament_series to anon;
grant select, insert, update, delete on public.tournaments to anon;
grant select, insert, update, delete on public.satellite_campaigns to anon;
grant select, insert, update, delete on public.tickets to anon;
grant select, insert, update, delete on public.tournament_entries to anon;
grant select, insert, update, delete on public.tournament_results to anon;
grant select, insert on public.csv_imports to anon;

create policy "Single user anon can read profile" on public.user_profiles
  for select to anon using (user_id = '2a68df45-4ad8-48f4-a991-f7cf87c8f8b4');
create policy "Single user anon can insert profile" on public.user_profiles
  for insert to anon with check (user_id = '2a68df45-4ad8-48f4-a991-f7cf87c8f8b4');
create policy "Single user anon can update profile" on public.user_profiles
  for update to anon using (user_id = '2a68df45-4ad8-48f4-a991-f7cf87c8f8b4') with check (user_id = '2a68df45-4ad8-48f4-a991-f7cf87c8f8b4');

create policy "Single user anon can manage rules" on public.bankroll_rules
  for all to anon using (user_id = '2a68df45-4ad8-48f4-a991-f7cf87c8f8b4') with check (user_id = '2a68df45-4ad8-48f4-a991-f7cf87c8f8b4');
create policy "Single user anon can read ledger" on public.bankroll_transactions
  for select to anon using (user_id = '2a68df45-4ad8-48f4-a991-f7cf87c8f8b4');
create policy "Single user anon can append ledger" on public.bankroll_transactions
  for insert to anon with check (user_id = '2a68df45-4ad8-48f4-a991-f7cf87c8f8b4');
create policy "Single user anon can manage sessions" on public.daily_session_budgets
  for all to anon using (user_id = '2a68df45-4ad8-48f4-a991-f7cf87c8f8b4') with check (user_id = '2a68df45-4ad8-48f4-a991-f7cf87c8f8b4');
create policy "Single user anon can manage series" on public.tournament_series
  for all to anon using (user_id = '2a68df45-4ad8-48f4-a991-f7cf87c8f8b4') with check (user_id = '2a68df45-4ad8-48f4-a991-f7cf87c8f8b4');
create policy "Single user anon can manage tournaments" on public.tournaments
  for all to anon using (user_id = '2a68df45-4ad8-48f4-a991-f7cf87c8f8b4') with check (user_id = '2a68df45-4ad8-48f4-a991-f7cf87c8f8b4');
create policy "Single user anon can manage satellite campaigns" on public.satellite_campaigns
  for all to anon using (user_id = '2a68df45-4ad8-48f4-a991-f7cf87c8f8b4') with check (user_id = '2a68df45-4ad8-48f4-a991-f7cf87c8f8b4');
create policy "Single user anon can manage tickets" on public.tickets
  for all to anon using (user_id = '2a68df45-4ad8-48f4-a991-f7cf87c8f8b4') with check (user_id = '2a68df45-4ad8-48f4-a991-f7cf87c8f8b4');
create policy "Single user anon can manage entries" on public.tournament_entries
  for all to anon using (user_id = '2a68df45-4ad8-48f4-a991-f7cf87c8f8b4') with check (user_id = '2a68df45-4ad8-48f4-a991-f7cf87c8f8b4');
create policy "Single user anon can manage results" on public.tournament_results
  for all to anon using (user_id = '2a68df45-4ad8-48f4-a991-f7cf87c8f8b4') with check (user_id = '2a68df45-4ad8-48f4-a991-f7cf87c8f8b4');
create policy "Single user anon can read imports" on public.csv_imports
  for select to anon using (user_id = '2a68df45-4ad8-48f4-a991-f7cf87c8f8b4');
create policy "Single user anon can create imports" on public.csv_imports
  for insert to anon with check (user_id = '2a68df45-4ad8-48f4-a991-f7cf87c8f8b4');
