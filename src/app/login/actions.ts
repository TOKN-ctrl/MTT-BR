"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function readCredentials(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    redirect("/login?error=Email%20and%20password%20are%20required");
  }

  return { email, password };
}

function readRedirectTo(formData: FormData) {
  const redirectTo = String(formData.get("next") ?? "/dashboard");
  return redirectTo.startsWith("/") && !redirectTo.startsWith("//") ? redirectTo : "/dashboard";
}

export async function login(formData: FormData) {
  const supabase = await createClient();
  const { email, password } = readCredentials(formData);
  const redirectTo = readRedirectTo(formData);
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/", "layout");
  redirect(redirectTo);
}

export async function signup(formData: FormData) {
  const supabase = await createClient();
  const { email, password } = readCredentials(formData);
  const redirectTo = readRedirectTo(formData);
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  if (data.user && data.session) {
    await supabase.from("user_profiles").upsert({
      base_currency: "USD",
      timezone: "UTC",
      user_id: data.user.id,
    });
    revalidatePath("/", "layout");
    redirect(redirectTo);
  }

  redirect("/login?message=Check%20your%20email%20to%20confirm%20your%20account");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
