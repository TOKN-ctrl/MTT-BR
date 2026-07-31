import { login, signup } from "./actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { hasSupabaseEnv } from "@/lib/supabase/env";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string; message?: string }> }) {
  const params = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>MTT Bankroll</CardTitle>
          <CardDescription>Sign in to track tournament bankroll risk and results.</CardDescription>
        </CardHeader>
        <CardContent>
          {!hasSupabaseEnv() ? (
            <Alert>
              <AlertTitle>Supabase is not configured</AlertTitle>
              <AlertDescription>Add the Supabase URL and publishable key before signing in.</AlertDescription>
            </Alert>
          ) : null}
          {params.error ? (
            <Alert className="mb-4 border-destructive/50 bg-destructive/10">
              <AlertTitle>Authentication failed</AlertTitle>
              <AlertDescription>{params.error}</AlertDescription>
            </Alert>
          ) : null}
          {params.message ? (
            <Alert className="mb-4 border-emerald-400/30 bg-emerald-400/10">
              <AlertTitle>Next step</AlertTitle>
              <AlertDescription>{params.message}</AlertDescription>
            </Alert>
          ) : null}
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" required type="email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" minLength={6} name="password" required type="password" />
            </div>
            <div className="flex gap-2">
              <Button formAction={login} type="submit">
                Sign in
              </Button>
              <Button formAction={signup} type="submit" variant="secondary">
                Sign up
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
