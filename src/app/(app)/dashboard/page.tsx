import { BankrollCurveChart } from "@/components/charts/bankroll-charts";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { calculateBankrollCurve } from "@/lib/domain/calculations";
import { loadAppData } from "@/lib/data/app-data";
import { buildDashboardSummary } from "@/lib/data/view-models";
import { DataGate, EmptyState, MetricCard, PageHeader, RiskNote } from "../_components/page-kit";

export default async function DashboardPage() {
  const data = await loadAppData();
  if (data.status !== "ready") {
    return (
      <>
        <PageHeader description="Live MTT bankroll risk, drawdown, spend discipline, and tournament performance." title="Dashboard" />
        <DataGate data={data} />
      </>
    );
  }

  const summary = buildDashboardSummary(data);
  const curve = calculateBankrollCurve(data.transactions);
  const upcoming = data.tournaments.filter((tournament) => !data.results.some((result) => result.tournament_id === tournament.id)).slice(0, 5);

  return (
    <>
      <PageHeader description="Live MTT bankroll risk, drawdown, spend discipline, and tournament performance." title="Dashboard" />
      {data.transactions.length === 0 ? (
        <EmptyState actionHref="/bankroll" actionLabel="Append first transaction" description="The dashboard calculates bankroll only from the immutable transaction ledger." title="Start with your bankroll ledger" />
      ) : null}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard detail={`${summary.buyInsRemaining ?? "N/A"} average buy-ins remaining`} label="Current bankroll" value={`${data.baseCurrency} ${summary.bankroll}`} />
        <MetricCard detail={`Peak ${summary.bankrollPeak}`} label="Current drawdown" value={summary.currentDrawdown} />
        <MetricCard detail={`Average bullets ${summary.averageBullets.toFixed(2)}`} label="Aggregate ROI" value={summary.aggregateRoi === null ? "N/A" : `${summary.aggregateRoi.toFixed(2)}%`} />
        <MetricCard detail={`Final tables ${summary.finalTablePercentage === null ? "N/A" : `${summary.finalTablePercentage.toFixed(2)}%`}`} label="ITM" value={summary.itmPercentage === null ? "N/A" : `${summary.itmPercentage.toFixed(2)}%`} />
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Bankroll curve</CardTitle>
          </CardHeader>
          <CardContent>
            <BankrollCurveChart data={curve} />
          </CardContent>
        </Card>
        <div className="space-y-4">
          <RiskNote>
            {data.rules.length === 0
              ? "No bankroll rule set has been saved yet. Planned tournaments cannot be classified until reserves and stop-loss limits exist."
              : `${data.rules[0].name} is active in ${data.rules[0].mode.replace("_", " ")} mode.`}
          </RiskNote>
          <Card>
            <CardHeader>
              <CardTitle>Upcoming / unresolved tournaments</CardTitle>
            </CardHeader>
            <CardContent>
              {upcoming.length === 0 ? (
                <p className="text-sm text-muted-foreground">No unresolved tournaments.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Risk</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {upcoming.map((tournament) => (
                      <TableRow key={tournament.id}>
                        <TableCell>{tournament.name}</TableCell>
                        <TableCell>
                          <Badge variant={tournament.planned_classification === "blocked" ? "destructive" : "outline"}>
                            {tournament.planned_classification?.replace("_", " ") ?? "unclassified"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
