import { unstable_noStore as noStore } from "next/cache";
import { getSingleUserId, hasSupabaseEnv, isSingleUserMode } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import type {
  BankrollRulesRow,
  BankrollTransactionRow,
  DailySessionBudgetRow,
  SatelliteCampaignRow,
  TicketRow,
  TournamentEntryRow,
  TournamentResultRow,
  TournamentRow,
  TournamentSeriesRow,
  UserProfileRow,
} from "@/types/database.types";

export type AppData =
  | { status: "setup"; baseCurrency: "USD" }
  | { status: "unauthenticated"; baseCurrency: "USD" }
  | {
      status: "ready";
      baseCurrency: string;
      profile: UserProfileRow | null;
      rules: BankrollRulesRow[];
      transactions: BankrollTransactionRow[];
      tournaments: TournamentRow[];
      entries: TournamentEntryRow[];
      results: TournamentResultRow[];
      sessions: DailySessionBudgetRow[];
      series: TournamentSeriesRow[];
      satellites: SatelliteCampaignRow[];
      tickets: TicketRow[];
    };

export async function loadAppData(): Promise<AppData> {
  noStore();
  if (!hasSupabaseEnv()) return { baseCurrency: "USD", status: "setup" };

  const supabase = await createClient();
  const userId = isSingleUserMode() ? getSingleUserId() : (await supabase.auth.getClaims()).data?.claims?.sub;
  if (!userId) return { baseCurrency: "USD", status: "unauthenticated" };

  const [profile, rules, transactions, tournaments, entries, results, sessions, series, satellites, tickets] = await Promise.all([
    supabase.from("user_profiles").select("*").eq("user_id", userId).maybeSingle(),
    supabase.from("bankroll_rules").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
    supabase.from("bankroll_transactions").select("*").eq("user_id", userId).order("occurred_at", { ascending: false }),
    supabase.from("tournaments").select("*").eq("user_id", userId).order("starts_at", { ascending: false }),
    supabase.from("tournament_entries").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
    supabase.from("tournament_results").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
    supabase.from("daily_session_budgets").select("*").eq("user_id", userId).order("session_date", { ascending: false }),
    supabase.from("tournament_series").select("*").eq("user_id", userId).order("start_date", { ascending: false }),
    supabase.from("satellite_campaigns").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
    supabase.from("tickets").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
  ]);

  const firstError = [profile, rules, transactions, tournaments, entries, results, sessions, series, satellites, tickets].find((result) => result.error)
    ?.error;
  if (firstError) throw new Error(firstError.message);

  return {
    baseCurrency: profile.data?.base_currency ?? rules.data?.[0]?.base_currency ?? "USD",
    entries: entries.data ?? [],
    profile: profile.data ?? null,
    results: results.data ?? [],
    rules: rules.data ?? [],
    satellites: satellites.data ?? [],
    series: series.data ?? [],
    sessions: sessions.data ?? [],
    status: "ready",
    tickets: tickets.data ?? [],
    tournaments: tournaments.data ?? [],
    transactions: transactions.data ?? [],
  };
}

export async function loadTournamentDetail(id: string) {
  const appData = await loadAppData();
  if (appData.status !== "ready") return { appData, tournament: null, entries: [], result: null };

  return {
    appData,
    entries: appData.entries.filter((entry) => entry.tournament_id === id),
    result: appData.results.find((result) => result.tournament_id === id) ?? null,
    tournament: appData.tournaments.find((tournament) => tournament.id === id) ?? null,
  };
}
