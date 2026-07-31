import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database.types";
import { hasSupabaseEnv, getSupabaseEnv, isSingleUserMode } from "./env";

const protectedPaths = [
  "/",
  "/analytics",
  "/bankroll",
  "/dashboard",
  "/import",
  "/planner",
  "/rules",
  "/satellites",
  "/series",
  "/sessions",
  "/settings",
  "/tournaments",
];

function isProtectedPath(pathname: string) {
  return protectedPaths.some((path) => pathname === path || (path !== "/" && pathname.startsWith(`${path}/`)));
}

export async function updateSession(request: NextRequest) {
  if (!hasSupabaseEnv() || isSingleUserMode()) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });
  const { url, publishableKey } = getSupabaseEnv();

  const supabase = createServerClient<Database>(url, publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
        Object.entries(headers).forEach(([key, value]) => supabaseResponse.headers.set(key, value));
      },
    },
  });

  const { data } = await supabase.auth.getClaims();

  if (!data?.claims && isProtectedPath(request.nextUrl.pathname)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("reason", "auth");
    redirectUrl.searchParams.set("next", `${request.nextUrl.pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}
