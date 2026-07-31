import { RulesForm } from "@/components/forms/operations-forms";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { loadAppData } from "@/lib/data/app-data";
import { DataGate, EmptyState, PageHeader } from "../_components/page-kit";

export default async function RulesPage() {
  const data = await loadAppData();
  return (
    <>
      <PageHeader description="Define reserve requirements and hard spend limits used by planned tournament classification." title="Bankroll rules engine" />
      {data.status !== "ready" ? <DataGate data={data} /> : (
        <div className="grid gap-4 xl:grid-cols-[1fr_1.2fr]">
          <Card><CardHeader><CardTitle>New rule set</CardTitle></CardHeader><CardContent><RulesForm baseCurrency={data.baseCurrency} /></CardContent></Card>
          <Card><CardHeader><CardTitle>Saved rules</CardTitle></CardHeader><CardContent>{data.rules.length === 0 ? <EmptyState title="No rules saved" description="Add reserve requirements before relying on the planner classifications." /> : <Table><TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Mode</TableHead><TableHead>Reentry reserve</TableHead><TableHead>Max reentries</TableHead></TableRow></TableHeader><TableBody>{data.rules.map((rules) => <TableRow key={rules.id}><TableCell>{rules.name}</TableCell><TableCell><Badge variant={rules.mode === "strict" ? "destructive" : "warning"}>{rules.mode.replace("_", " ")}</Badge></TableCell><TableCell>{rules.min_reserve_reentry} buy-ins</TableCell><TableCell>{rules.max_reentries_per_tournament}</TableCell></TableRow>)}</TableBody></Table>}</CardContent></Card>
        </div>
      )}
    </>
  );
}
