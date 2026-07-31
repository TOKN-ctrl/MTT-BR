import { DailyBudgetForm } from "@/components/forms/operations-forms";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { loadAppData } from "@/lib/data/app-data";
import { DataGate, EmptyState, PageHeader } from "../_components/page-kit";

export default async function SessionsPage() {
  const data = await loadAppData();
  return (
    <>
      <PageHeader description="Set daily tournament spend and max-loss budgets before registering MTT volume." title="Daily session budgets" />
      {data.status !== "ready" ? <DataGate data={data} /> : (
        <div className="grid gap-4 xl:grid-cols-[1fr_1.2fr]">
          <Card><CardHeader><CardTitle>Budget day</CardTitle></CardHeader><CardContent><DailyBudgetForm /></CardContent></Card>
          <Card><CardHeader><CardTitle>Budget history</CardTitle></CardHeader><CardContent>{data.sessions.length === 0 ? <EmptyState title="No session budgets" description="Create dated spend limits for planned tournament days." /> : <Table><TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Spend</TableHead><TableHead>Max loss</TableHead></TableRow></TableHeader><TableBody>{data.sessions.map((session) => <TableRow key={session.id}><TableCell>{session.session_date}</TableCell><TableCell>{data.baseCurrency} {session.planned_spend_base}</TableCell><TableCell>{session.max_loss_base ?? "N/A"}</TableCell></TableRow>)}</TableBody></Table>}</CardContent></Card>
        </div>
      )}
    </>
  );
}
