export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      bankroll_rules: {
        Row: BankrollRulesRow;
        Insert: Omit<Partial<BankrollRulesRow>, "id" | "created_at" | "updated_at"> & { user_id: string };
        Update: Partial<Omit<BankrollRulesRow, "id" | "user_id" | "created_at">>;
        Relationships: [];
      };
      bankroll_transactions: {
        Row: BankrollTransactionRow;
        Insert: Omit<Partial<BankrollTransactionRow>, "id" | "created_at"> & {
          user_id: string;
          type: LedgerTransactionType;
          original_currency: string;
          original_amount: string;
          base_currency: string;
          amount_base: string;
        };
        Update: never;
        Relationships: [];
      };
      csv_imports: {
        Row: CsvImportRow;
        Insert: Omit<Partial<CsvImportRow>, "id" | "created_at"> & {
          user_id: string;
          import_type: string;
          file_name: string;
        };
        Update: never;
        Relationships: [];
      };
      daily_session_budgets: {
        Row: DailySessionBudgetRow;
        Insert: Omit<Partial<DailySessionBudgetRow>, "id" | "created_at" | "updated_at"> & {
          user_id: string;
          session_date: string;
          planned_spend_base: string;
        };
        Update: Partial<Omit<DailySessionBudgetRow, "id" | "user_id" | "created_at">>;
        Relationships: [];
      };
      satellite_campaigns: {
        Row: SatelliteCampaignRow;
        Insert: Omit<Partial<SatelliteCampaignRow>, "id" | "created_at" | "updated_at"> & {
          user_id: string;
          name: string;
          budget_base: string;
        };
        Update: Partial<Omit<SatelliteCampaignRow, "id" | "user_id" | "created_at">>;
        Relationships: [];
      };
      tickets: {
        Row: TicketRow;
        Insert: Omit<Partial<TicketRow>, "id" | "created_at" | "updated_at"> & {
          user_id: string;
          ticket_type: EntryMethod;
          currency: string;
          face_value: string;
          face_value_base: string;
        };
        Update: Partial<Omit<TicketRow, "id" | "user_id" | "created_at">>;
        Relationships: [];
      };
      tournament_entries: {
        Row: TournamentEntryRow;
        Insert: Omit<Partial<TournamentEntryRow>, "id" | "created_at" | "updated_at"> & {
          user_id: string;
          tournament_id: string;
          bullet_number: number;
          entry_method: EntryMethod;
        };
        Update: Partial<Omit<TournamentEntryRow, "id" | "user_id" | "created_at">>;
        Relationships: [];
      };
      tournament_results: {
        Row: TournamentResultRow;
        Insert: Omit<Partial<TournamentResultRow>, "id" | "created_at" | "updated_at"> & {
          user_id: string;
          tournament_id: string;
        };
        Update: Partial<Omit<TournamentResultRow, "id" | "user_id" | "created_at">>;
        Relationships: [];
      };
      tournament_series: {
        Row: TournamentSeriesRow;
        Insert: Omit<Partial<TournamentSeriesRow>, "id" | "created_at" | "updated_at"> & {
          user_id: string;
          name: string;
          start_date: string;
          budget_base: string;
        };
        Update: Partial<Omit<TournamentSeriesRow, "id" | "user_id" | "created_at">>;
        Relationships: [];
      };
      tournaments: {
        Row: TournamentRow;
        Insert: Omit<Partial<TournamentRow>, "id" | "created_at" | "updated_at"> & {
          user_id: string;
          name: string;
          platform_or_venue: string;
          location_type: TournamentLocationType;
          starts_at: string;
          currency: string;
          format: TournamentFormat;
          base_buy_in: string;
        };
        Update: Partial<Omit<TournamentRow, "id" | "user_id" | "created_at">>;
        Relationships: [];
      };
      user_profiles: {
        Row: UserProfileRow;
        Insert: Omit<Partial<UserProfileRow>, "created_at" | "updated_at"> & { user_id: string };
        Update: Partial<Omit<UserProfileRow, "user_id" | "created_at">>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      entry_method: EntryMethod;
      ledger_transaction_type: LedgerTransactionType;
      rule_classification: RuleClassification;
      rule_mode: RuleMode;
      ticket_status: TicketStatus;
      tournament_format: TournamentFormat;
      tournament_location_type: TournamentLocationType;
      tournament_speed: TournamentSpeed;
    };
    CompositeTypes: Record<string, never>;
  };
};

export type EntryMethod = "direct" | "satellite_ticket" | "promotional_ticket" | "step_ticket";
export type LedgerTransactionType =
  | "deposit"
  | "withdrawal"
  | "tournament_buy_in"
  | "tournament_return"
  | "ticket_purchase"
  | "ticket_conversion"
  | "adjustment"
  | "fee"
  | "rakeback"
  | "bonus";
export type RuleClassification = "safe" | "elevated_risk" | "shot" | "blocked";
export type RuleMode = "strict" | "warning_only";
export type TicketStatus = "available" | "used" | "expired" | "converted" | "voided";
export type TournamentFormat =
  | "freezeout"
  | "reentry"
  | "rebuy_add_on"
  | "regular_bounty"
  | "progressive_knockout"
  | "mystery_bounty"
  | "satellite"
  | "step_satellite"
  | "multi_flight";
export type TournamentLocationType = "live" | "online";
export type TournamentSpeed = "regular" | "turbo" | "hyper" | "deepstack" | "unknown";

export type UserProfileRow = {
  user_id: string;
  base_currency: string;
  display_name: string | null;
  timezone: string;
  created_at: string;
  updated_at: string;
};

export type BankrollRulesRow = {
  id: string;
  user_id: string;
  name: string;
  mode: RuleMode;
  base_currency: string;
  min_reserve_freezeout: string;
  min_reserve_reentry: string;
  min_reserve_rebuy_add_on: string;
  min_reserve_bounty: string;
  min_reserve_satellite: string;
  max_daily_loss_base: string | null;
  max_daily_spend_base: string | null;
  max_reentries_per_tournament: number;
  max_series_budget_base: string | null;
  satellite_budget_base: string | null;
  created_at: string;
  updated_at: string;
};

export type BankrollTransactionRow = {
  id: string;
  user_id: string;
  type: LedgerTransactionType;
  occurred_at: string;
  original_currency: string;
  original_amount: string;
  base_currency: string;
  amount_base: string;
  exchange_rate: string;
  tournament_id: string | null;
  entry_id: string | null;
  ticket_id: string | null;
  description: string | null;
  external_ref: string | null;
  created_at: string;
};

export type DailySessionBudgetRow = {
  id: string;
  user_id: string;
  session_date: string;
  planned_spend_base: string;
  max_loss_base: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type TournamentSeriesRow = {
  id: string;
  user_id: string;
  name: string;
  platform_or_venue: string | null;
  start_date: string;
  end_date: string | null;
  budget_base: string;
  satellite_budget_base: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type TournamentRow = {
  id: string;
  user_id: string;
  series_id: string | null;
  name: string;
  platform_or_venue: string;
  location_type: TournamentLocationType;
  starts_at: string;
  currency: string;
  format: TournamentFormat;
  speed: TournamentSpeed;
  base_buy_in: string;
  fee: string;
  guarantee: string | null;
  field_size: number | null;
  starting_stack: number | null;
  starting_big_blinds: string | null;
  late_registration_open: boolean;
  flight: string | null;
  planned_classification: RuleClassification | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type SatelliteCampaignRow = {
  id: string;
  user_id: string;
  name: string;
  target_tournament_id: string | null;
  starts_at: string | null;
  budget_base: string;
  total_spend_base: string;
  realized_value_base: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type TicketRow = {
  id: string;
  user_id: string;
  campaign_id: string | null;
  source_tournament_id: string | null;
  ticket_type: EntryMethod;
  status: TicketStatus;
  currency: string;
  face_value: string;
  face_value_base: string;
  exchange_rate: string;
  expires_at: string | null;
  used_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type TournamentEntryRow = {
  id: string;
  user_id: string;
  tournament_id: string;
  ticket_id: string | null;
  bullet_number: number;
  entry_method: EntryMethod;
  amount_paid: string;
  amount_paid_base: string;
  fee: string;
  fee_base: string;
  add_on: string;
  add_on_base: string;
  exchange_rate: string;
  reentry_at: string | null;
  stack_at_entry: number | null;
  big_blinds_at_entry: string | null;
  planned: boolean;
  rule_exception_reason: string | null;
  created_at: string;
  updated_at: string;
};

export type TournamentResultRow = {
  id: string;
  user_id: string;
  tournament_id: string;
  finishing_position: number | null;
  total_field_size: number | null;
  normal_prize: string;
  normal_prize_base: string;
  bounty_prize: string;
  bounty_prize_base: string;
  total_cash_returned: string;
  total_cash_returned_base: string;
  final_table: boolean;
  duration_minutes: number | null;
  emotional_state: string | null;
  rule_deviation: string | null;
  bust_out_notes: string | null;
  attachment_refs: string[];
  created_at: string;
  updated_at: string;
};

export type CsvImportRow = {
  id: string;
  user_id: string;
  import_type: string;
  file_name: string;
  row_count: number;
  status: string;
  error_report: Json | null;
  created_at: string;
};

export type Tables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"];
export type TablesInsert<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Update"];
export type Enums<T extends keyof Database["public"]["Enums"]> = Database["public"]["Enums"][T];
