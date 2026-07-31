export function hasSupabaseEnv() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
}

export function isSingleUserMode() {
  return process.env.APP_AUTH_MODE === "single_user" && Boolean(process.env.APP_SINGLE_USER_ID);
}

export function getSingleUserId() {
  const userId = process.env.APP_SINGLE_USER_ID;

  if (!userId) {
    throw new Error("Missing APP_SINGLE_USER_ID.");
  }

  return userId;
}

export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.");
  }

  return { publishableKey, url };
}
