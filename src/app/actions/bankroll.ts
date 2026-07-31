"use server";

import { bankrollTransactionSchema } from "@/lib/validation/schemas";
import { done, getActionUser, type ActionState } from "./helpers";

export async function createBankrollTransaction(_: ActionState, formData: FormData): Promise<ActionState> {
  const auth = await getActionUser();
  if ("error" in auth) return { error: auth.error };

  const parsed = bankrollTransactionSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid transaction." };

  const { error } = await auth.supabase.from("bankroll_transactions").insert({
    ...parsed.data,
    description: parsed.data.description || null,
    user_id: auth.userId,
  });

  if (error) return { error: error.message };
  return done("/bankroll", "Transaction appended to the immutable ledger.");
}
