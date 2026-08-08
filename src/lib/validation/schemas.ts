import { z } from "zod";

export const currencySchema = z.string().trim().min(3).max(3).transform((value) => value.toUpperCase());
export const moneySchema = z.string().trim().regex(/^\d+(\.\d{1,2})?$/, "Use a non-negative decimal amount.");
export const signedMoneySchema = z.string().trim().regex(/^-?\d+(\.\d{1,2})?$/, "Use a signed decimal amount.");
export const exchangeRateSchema = z.string().trim().regex(/^\d+(\.\d{1,8})?$/, "Use a positive decimal rate.");

export const tournamentFormats = [
  "freezeout",
  "reentry",
  "rebuy_add_on",
  "regular_bounty",
  "progressive_knockout",
  "mystery_bounty",
  "satellite",
  "step_satellite",
  "multi_flight",
] as const;

export const tournamentSpeeds = ["regular", "turbo", "hyper", "deepstack", "unknown"] as const;
export const entryMethods = ["direct", "satellite_ticket", "promotional_ticket", "step_ticket"] as const;

export const bankrollTransactionSchema = z.object({
  amount_base: signedMoneySchema,
  base_currency: currencySchema,
  description: z.string().max(300).optional(),
  exchange_rate: exchangeRateSchema.default("1"),
  occurred_at: z.string().min(1),
  original_amount: signedMoneySchema,
  original_currency: currencySchema,
  type: z.enum([
    "deposit",
    "withdrawal",
    "tournament_buy_in",
    "tournament_return",
    "ticket_purchase",
    "ticket_conversion",
    "adjustment",
    "fee",
    "rakeback",
    "bonus",
  ]),
});

export const tournamentSchema = z.object({
  base_buy_in: moneySchema,
  currency: currencySchema,
  fee: moneySchema.default("0.00"),
  field_size: z.coerce.number().int().positive().optional().or(z.literal("").transform(() => undefined)),
  flight: z.string().max(80).optional(),
  format: z.enum(tournamentFormats),
  guarantee: moneySchema.optional().or(z.literal("").transform(() => undefined)),
  late_registration_open: z.coerce.boolean().default(false),
  location_type: z.enum(["live", "online"]),
  name: z.string().trim().min(2).max(160),
  notes: z.string().max(1000).optional(),
  platform_or_venue: z.string().trim().min(2).max(120),
  speed: z.enum(tournamentSpeeds),
  starting_big_blinds: z.coerce.number().positive().optional().or(z.literal("").transform(() => undefined)),
  starting_stack: z.coerce.number().int().positive().optional().or(z.literal("").transform(() => undefined)),
  starts_at: z.string().min(1),
});

export const simpleTournamentLogSchema = tournamentSchema.extend({
  finishing_position: z.coerce.number().int().positive().optional().or(z.literal("").transform(() => undefined)),
  total_cash_returned: moneySchema.optional().or(z.literal("").transform(() => undefined)),
});

export const entrySchema = z.object({
  add_on: moneySchema.default("0.00"),
  add_on_base: moneySchema.default("0.00"),
  amount_paid: moneySchema.default("0.00"),
  amount_paid_base: moneySchema.default("0.00"),
  big_blinds_at_entry: z.coerce.number().positive().optional().or(z.literal("").transform(() => undefined)),
  bullet_number: z.coerce.number().int().positive(),
  entry_method: z.enum(entryMethods),
  exchange_rate: exchangeRateSchema.default("1"),
  fee: moneySchema.default("0.00"),
  fee_base: moneySchema.default("0.00"),
  planned: z.coerce.boolean().default(true),
  reentry_at: z.string().optional(),
  rule_exception_reason: z.string().max(300).optional(),
  stack_at_entry: z.coerce.number().int().positive().optional().or(z.literal("").transform(() => undefined)),
  ticket_id: z.string().uuid().optional().or(z.literal("").transform(() => undefined)),
  tournament_id: z.string().uuid(),
});

export const resultSchema = z.object({
  attachment_refs: z.string().optional(),
  bounty_prize: moneySchema.default("0.00"),
  bounty_prize_base: moneySchema.default("0.00"),
  bust_out_notes: z.string().max(1000).optional(),
  duration_minutes: z.coerce.number().int().positive().optional().or(z.literal("").transform(() => undefined)),
  emotional_state: z.string().max(80).optional(),
  final_table: z.coerce.boolean().default(false),
  finishing_position: z.coerce.number().int().positive().optional().or(z.literal("").transform(() => undefined)),
  normal_prize: moneySchema.default("0.00"),
  normal_prize_base: moneySchema.default("0.00"),
  rule_deviation: z.string().max(300).optional(),
  total_cash_returned: moneySchema.default("0.00"),
  total_cash_returned_base: moneySchema.default("0.00"),
  total_field_size: z.coerce.number().int().positive().optional().or(z.literal("").transform(() => undefined)),
  tournament_id: z.string().uuid(),
});

export const rulesSchema = z.object({
  base_currency: currencySchema,
  max_daily_loss_base: moneySchema.optional().or(z.literal("").transform(() => undefined)),
  max_daily_spend_base: moneySchema.optional().or(z.literal("").transform(() => undefined)),
  max_reentries_per_tournament: z.coerce.number().int().min(0).max(20),
  max_series_budget_base: moneySchema.optional().or(z.literal("").transform(() => undefined)),
  min_reserve_bounty: moneySchema,
  min_reserve_freezeout: moneySchema,
  min_reserve_rebuy_add_on: moneySchema,
  min_reserve_reentry: moneySchema,
  min_reserve_satellite: moneySchema,
  mode: z.enum(["strict", "warning_only"]),
  name: z.string().trim().min(2).max(120),
  satellite_budget_base: moneySchema.optional().or(z.literal("").transform(() => undefined)),
});

export const budgetSchema = z.object({
  max_loss_base: moneySchema.optional().or(z.literal("").transform(() => undefined)),
  notes: z.string().max(600).optional(),
  planned_spend_base: moneySchema,
  session_date: z.string().min(1),
});

export const seriesSchema = z.object({
  budget_base: moneySchema,
  end_date: z.string().optional(),
  name: z.string().trim().min(2).max(120),
  notes: z.string().max(600).optional(),
  platform_or_venue: z.string().max(120).optional(),
  satellite_budget_base: moneySchema.optional().or(z.literal("").transform(() => undefined)),
  start_date: z.string().min(1),
});

export const satelliteCampaignSchema = z.object({
  budget_base: moneySchema,
  name: z.string().trim().min(2).max(120),
  notes: z.string().max(600).optional(),
  realized_value_base: moneySchema.default("0.00"),
  starts_at: z.string().optional(),
  total_spend_base: moneySchema.default("0.00"),
});

export const csvImportSchema = z.object({
  file_name: z.string().trim().min(1).max(180),
  import_type: z.enum(["bankroll", "tournaments", "entries", "results", "tickets"]),
  row_count: z.coerce.number().int().min(0),
});
