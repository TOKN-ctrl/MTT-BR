import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export type ActionState = {
  error?: string;
  success?: string;
};

export async function getActionUser() {
  if (!hasSupabaseEnv()) {
    return { error: "Supabase environment variables are not configured." as const };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;

  if (error || !userId) {
    return { error: "Sign in before saving records." as const };
  }

  return { supabase, userId };
}

export function done(path: string, message: string): ActionState {
  revalidatePath(path);
  return { success: message };
}

export function redirectDone(path: string): never {
  revalidatePath(path);
  redirect(path);
}
