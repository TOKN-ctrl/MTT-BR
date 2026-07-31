"use server";

import { redirectDone, done, getActionUser, type ActionState } from "./helpers";
import { entrySchema, resultSchema, tournamentSchema } from "@/lib/validation/schemas";

export async function createTournament(_: ActionState, formData: FormData): Promise<ActionState> {
  const auth = await getActionUser();
  if ("error" in auth) return { error: auth.error };

  const parsed = tournamentSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid tournament." };

  const { data, error } = await auth.supabase
    .from("tournaments")
    .insert({
      ...parsed.data,
      fee: parsed.data.fee ?? "0.00",
      field_size: parsed.data.field_size ?? null,
      flight: parsed.data.flight || null,
      guarantee: parsed.data.guarantee ?? null,
      notes: parsed.data.notes || null,
      starting_big_blinds: parsed.data.starting_big_blinds ? String(parsed.data.starting_big_blinds) : null,
      starting_stack: parsed.data.starting_stack ?? null,
      user_id: auth.userId,
    })
    .select("id")
    .single();

  if (error || !data) return { error: error?.message ?? "Tournament could not be created." };
  redirectDone(`/tournaments/${data.id}`);
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
