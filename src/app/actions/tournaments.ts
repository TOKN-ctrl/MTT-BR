"use server";

import { redirectDone, done, getActionUser, type ActionState } from "./helpers";
import { entrySchema, resultSchema, simpleTournamentLogSchema } from "@/lib/validation/schemas";

export async function createTournament(_: ActionState, formData: FormData): Promise<ActionState> {
  const auth = await getActionUser();
  if ("error" in auth) return { error: auth.error };

  const parsed = simpleTournamentLogSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid tournament." };
  const { finishing_position, total_cash_returned, ...tournament } = parsed.data;

  const { data, error } = await auth.supabase
    .from("tournaments")
    .insert({
      ...tournament,
      fee: tournament.fee ?? "0.00",
      field_size: tournament.field_size ?? null,
      flight: tournament.flight || null,
      guarantee: tournament.guarantee ?? null,
      notes: tournament.notes || null,
      starting_big_blinds: tournament.starting_big_blinds ? String(tournament.starting_big_blinds) : null,
      starting_stack: tournament.starting_stack ?? null,
      user_id: auth.userId,
    })
    .select("id")
    .single();

  if (error || !data) return { error: error?.message ?? "Tournament could not be created." };

  const { error: entryError } = await auth.supabase.from("tournament_entries").insert({
    add_on: "0.00",
    add_on_base: "0.00",
    amount_paid: tournament.base_buy_in,
    amount_paid_base: tournament.base_buy_in,
    bullet_number: 1,
    entry_method: "direct",
    exchange_rate: "1",
    fee: tournament.fee ?? "0.00",
    fee_base: tournament.fee ?? "0.00",
    planned: true,
    tournament_id: data.id,
    user_id: auth.userId,
  });

  if (entryError) return { error: entryError.message };

  if (total_cash_returned !== undefined || finishing_position !== undefined) {
    const returned = total_cash_returned ?? "0.00";
    const { error: resultError } = await auth.supabase.from("tournament_results").insert({
      bounty_prize: "0.00",
      bounty_prize_base: "0.00",
      final_table: false,
      finishing_position: finishing_position ?? null,
      normal_prize: returned,
      normal_prize_base: returned,
      total_cash_returned: returned,
      total_cash_returned_base: returned,
      total_field_size: tournament.field_size ?? null,
      tournament_id: data.id,
      user_id: auth.userId,
    });

    if (resultError) return { error: resultError.message };
  }

  redirectDone("/dashboard");
}

export async function createTournamentEntry(_: ActionState, formData: FormData): Promise<ActionState> {
  const auth = await getActionUser();
  if ("error" in auth) return { error: auth.error };

  const parsed = entrySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid entry." };

  const { error } = await auth.supabase.from("tournament_entries").insert({
    ...parsed.data,
    big_blinds_at_entry: parsed.data.big_blinds_at_entry ? String(parsed.data.big_blinds_at_entry) : null,
    reentry_at: parsed.data.reentry_at || null,
    rule_exception_reason: parsed.data.rule_exception_reason || null,
    stack_at_entry: parsed.data.stack_at_entry ?? null,
    ticket_id: parsed.data.ticket_id ?? null,
    user_id: auth.userId,
  });

  if (error) return { error: error.message };
  return done(`/tournaments/${parsed.data.tournament_id}`, "Bullet logged.");
}

export async function upsertTournamentResult(_: ActionState, formData: FormData): Promise<ActionState> {
  const auth = await getActionUser();
  if ("error" in auth) return { error: auth.error };

  const parsed = resultSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid result." };

  const attachmentRefs = parsed.data.attachment_refs
    ? parsed.data.attachment_refs.split(",").map((item) => item.trim()).filter(Boolean)
    : [];

  const { error } = await auth.supabase.from("tournament_results").upsert({
    ...parsed.data,
    attachment_refs: attachmentRefs,
    bust_out_notes: parsed.data.bust_out_notes || null,
    duration_minutes: parsed.data.duration_minutes ?? null,
    emotional_state: parsed.data.emotional_state || null,
    finishing_position: parsed.data.finishing_position ?? null,
    rule_deviation: parsed.data.rule_deviation || null,
    total_field_size: parsed.data.total_field_size ?? null,
    user_id: auth.userId,
  });

  if (error) return { error: error.message };
  return done(`/tournaments/${parsed.data.tournament_id}`, "Result saved.");
}
