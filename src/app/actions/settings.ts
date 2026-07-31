"use server";

import { budgetSchema, csvImportSchema, rulesSchema, satelliteCampaignSchema, seriesSchema } from "@/lib/validation/schemas";
import { done, getActionUser, type ActionState } from "./helpers";

export async function saveRules(_: ActionState, formData: FormData): Promise<ActionState> {
  const auth = await getActionUser();
  if ("error" in auth) return { error: auth.error };
  const parsed = rulesSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid rules." };

  const { error } = await auth.supabase.from("bankroll_rules").insert({ ...parsed.data, user_id: auth.userId });
  if (error) return { error: error.message };
  return done("/rules", "Rule set saved.");
}

export async function saveDailyBudget(_: ActionState, formData: FormData): Promise<ActionState> {
  const auth = await getActionUser();
  if ("error" in auth) return { error: auth.error };
  const parsed = budgetSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid session budget." };

  const { error } = await auth.supabase.from("daily_session_budgets").upsert({ ...parsed.data, user_id: auth.userId });
  if (error) return { error: error.message };
  return done("/sessions", "Daily session budget saved.");
}

export async function saveSeries(_: ActionState, formData: FormData): Promise<ActionState> {
  const auth = await getActionUser();
  if ("error" in auth) return { error: auth.error };
  const parsed = seriesSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid series budget." };

  const { error } = await auth.supabase.from("tournament_series").insert({
    ...parsed.data,
    end_date: parsed.data.end_date || null,
    notes: parsed.data.notes || null,
    platform_or_venue: parsed.data.platform_or_venue || null,
    satellite_budget_base: parsed.data.satellite_budget_base ?? null,
    user_id: auth.userId,
  });
  if (error) return { error: error.message };
  return done("/series", "Series budget saved.");
}

export async function saveSatelliteCampaign(_: ActionState, formData: FormData): Promise<ActionState> {
  const auth = await getActionUser();
  if ("error" in auth) return { error: auth.error };
  const parsed = satelliteCampaignSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid satellite campaign." };

  const { error } = await auth.supabase.from("satellite_campaigns").insert({
    ...parsed.data,
    notes: parsed.data.notes || null,
    starts_at: parsed.data.starts_at || null,
    user_id: auth.userId,
  });
  if (error) return { error: error.message };
  return done("/satellites", "Satellite campaign saved.");
}

export async function recordCsvImport(_: ActionState, formData: FormData): Promise<ActionState> {
  const auth = await getActionUser();
  if ("error" in auth) return { error: auth.error };
  const parsed = csvImportSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid CSV import record." };

  const { error } = await auth.supabase.from("csv_imports").insert({ ...parsed.data, status: "validated", user_id: auth.userId });
  if (error) return { error: error.message };
  return done("/import", "CSV import record saved.");
}
