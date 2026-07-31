"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";

export function Field({ children, error, label, name }: { children: React.ReactNode; error?: { message?: string }; label: string; name: string }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      {children}
      {error ? <p className="text-xs text-destructive">{error.message}</p> : null}
    </div>
  );
}

export function ActionMessage({ error, success }: { error?: string; success?: string }) {
  if (!error && !success) return null;
  return (
    <Alert className={success ? "border-emerald-400/30 bg-emerald-400/10" : "border-destructive/50 bg-destructive/10"}>
      <AlertTitle>{success ? "Saved" : "Needs attention"}</AlertTitle>
      <AlertDescription>{success ?? error}</AlertDescription>
    </Alert>
  );
}
