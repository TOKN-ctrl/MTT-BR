import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { loadAppData } from "@/lib/data/app-data";
import { DataGate, PageHeader } from "../_components/page-kit";

export default async function SettingsPage() {
  const data = await loadAppData();
  return (
    <>
      <PageHeader description="Base currency, authentication state, and deployment configuration." title="Settings" />
      {data.status !== "ready" ? <DataGate data={data} /> : (
        <Card>
          <CardHeader><CardTitle>Account settings</CardTitle><CardDescription>Profile editing is intentionally minimal in this phase; bankroll is derived from the ledger, not an editable balance.</CardDescription></CardHeader>
          <CardContent className="grid gap-3 text-sm">
            <div><span className="text-muted-foreground">Base currency:</span> <span className="font-mono">{data.baseCurrency}</span></div>
            <div><span className="text-muted-foreground">Tournament records:</span> <span className="font-mono">{data.tournaments.length}</span></div>
            <div><span className="text-muted-foreground">Ledger rows:</span> <span className="font-mono">{data.transactions.length}</span></div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
