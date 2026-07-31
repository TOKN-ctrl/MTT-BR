import { notFound } from "next/navigation";
import { EntryForm, ResultForm } from "@/components/forms/entry-result-forms";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { calculateTournamentPerformance, formatTournamentFormat } from "@/lib/domain/calculations";
import { loadTournamentDetail } from "@/lib/data/app-data";
import { DataGate, MetricCard, PageHeader } from "../../_components/page-kit";

export default async function TournamentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { appData, tournament, entries, result } = await loadTournamentDetail(id);
  if (appData.status !== "ready") {
    return <DataGate data={appData} />;
  }
  if (!tournament) notFound();
  const performance = calculateTournamentPerformance(entries, result);

  return (
    <>
      <PageHeader description={`${tournament.platform_or_venue} · ${formatTournamentFormat(tournament.format)} · ${tournament.location_type}`} title={tournament.name} />
      <div className="mb-4 grid gap-4 md:grid-cols-4">
        <MetricCard label="Total cost" value={`${appData.baseCurrency} ${performance.totalCost}`} />
        <MetricCard label="Returned" value={`${appData.baseCurrency} ${performance.totalReturned}`} />
        <MetricCard label="Net profit" value={`${appData.baseCurrency} ${performance.netProfit}`} />
        <MetricCard label="ROI" value={performance.roi === null ? "N/A" : `${performance.roi.toFixed(2)}%`} />
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Bullets</CardTitle></CardHeader>
          <CardContent>
            <EntryForm tournamentId={tournament.id} />
            <div className="mt-6">
              <Table>
                <TableHeader><TableRow><TableHead>Bullet</TableHead><TableHead>Method</TableHead><TableHead>Cost</TableHead><TableHead>Planned</TableHead></TableRow></TableHeader>
                <TableBody>
                  {entries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>{entry.bullet_number}</TableCell>
                      <TableCell>{entry.entry_method.replaceAll("_", " ")}</TableCell>
                      <TableCell>{appData.baseCurrency} {calculateTournamentPerformance([entry], null).totalCost}</TableCell>
                      <TableCell><Badge variant={entry.planned ? "success" : "warning"}>{entry.planned ? "planned" : "unplanned"}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Result</CardTitle></CardHeader>
          <CardContent>
            <ResultForm tournamentId={tournament.id} />
            {result ? <p className="mt-4 text-sm text-muted-foreground">Current result: position {result.finishing_position ?? "N/A"}, returned {appData.baseCurrency} {result.total_cash_returned_base}.</p> : null}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
