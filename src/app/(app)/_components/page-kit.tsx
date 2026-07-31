import Link from "next/link";
import { AlertCircle, LockKeyhole, Settings2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { AppData } from "@/lib/data/app-data";

export function PageHeader({ action, description, title }: { action?: React.ReactNode; description: string; title: string }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal text-foreground">{title}</h1>
        <p className="mt-1 max-w-3xl text-sm text-muted-foreground">{description}</p>
      </div>
      {action}
    </div>
  );
}

export function DataGate({ data }: { data: AppData }) {
  if (data.status === "setup") {
    return (
      <Alert>
        <Settings2 className="mb-2 size-4" />
        <AlertTitle>Supabase is not configured</AlertTitle>
        <AlertDescription>
          Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, then apply the migration in `supabase/migrations`.
        </AlertDescription>
      </Alert>
    );
  }

  if (data.status === "unauthenticated") {
    return (
      <Alert>
        <LockKeyhole className="mb-2 size-4" />
        <AlertTitle>Sign in required</AlertTitle>
        <AlertDescription>
          Sign in to read and write your bankroll records.
          <Button asChild className="mt-3 block w-fit">
            <Link href="/login">Sign in</Link>
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}

export function EmptyState({ actionHref, actionLabel, description, title }: { actionHref?: string; actionLabel?: string; description: string; title: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      {actionHref && actionLabel ? (
        <CardContent>
          <Button asChild>
            <Link href={actionHref}>{actionLabel}</Link>
          </Button>
        </CardContent>
      ) : null}
    </Card>
  );
}

export function MetricCard({ label, value, detail }: { detail?: string; label: string; value: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{label}</CardDescription>
        <CardTitle className="font-mono text-2xl">{value}</CardTitle>
      </CardHeader>
      {detail ? <CardContent className="text-xs text-muted-foreground">{detail}</CardContent> : null}
    </Card>
  );
}

export function RiskNote({ children }: { children: React.ReactNode }) {
  return (
    <Alert className="border-amber-400/30 bg-amber-400/10">
      <AlertCircle className="mb-2 size-4 text-amber-200" />
      <AlertTitle>Rule watch</AlertTitle>
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  );
}
