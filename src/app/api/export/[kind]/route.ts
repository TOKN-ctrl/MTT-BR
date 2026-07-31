import { NextResponse } from "next/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

const exportTables = {
  bankroll: "bankroll_transactions",
  entries: "tournament_entries",
  results: "tournament_results",
  satellites: "satellite_campaigns",
  tickets: "tickets",
  tournaments: "tournaments",
} as const;

type ExportKind = keyof typeof exportTables;

export async function GET(_: Request, { params }: { params: Promise<{ kind: string }> }) {
  const { kind } = await params;
  if (!isExportKind(kind)) {
    return NextResponse.json({ error: "Unsupported export type." }, { status: 404 });
  }

  if (!hasSupabaseEnv()) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  if (!userId) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const { data, error } = await supabase.from(exportTables[kind]).select("*").eq("user_id", userId);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const csv = toCsv(data ?? []);
  return new Response(csv, {
    headers: {
      "Content-Disposition": `attachment; filename="${kind}-export.csv"`,
      "Content-Type": "text/csv; charset=utf-8",
    },
  });
}

function isExportKind(kind: string): kind is ExportKind {
  return kind in exportTables;
}

function toCsv(rows: Record<string, unknown>[]) {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const body = rows.map((row) => headers.map((header) => csvCell(row[header])).join(","));
  return [headers.join(","), ...body].join("\n");
}

function csvCell(value: unknown) {
  if (value === null || value === undefined) return "";
  const text = Array.isArray(value) || typeof value === "object" ? JSON.stringify(value) : String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}
