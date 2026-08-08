import Link from "next/link";
import { Plus } from "lucide-react";
import { TournamentProfitChart } from "@/components/charts/bankroll-charts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { buildTournamentProfitSeries, calculateTournamentPerformance } from "@/lib/domain/calculations";
import { loadAppData } from "@/lib/data/app-data";
import { buildDashboardSummary } from "@/lib/data/view-models";
import { DataGate, EmptyState, MetricCard, PageHeader } from "../_components/page-kit";

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
  const series = buildTournamentProfitSeries(data.tournaments, data.entries, data.results);
  const recentTournaments = data.tournaments.slice(0, 8);

  return (
    <>
      <PageHeader
        action={<Button asChild><Link href="/tournaments/new"><Plus />Log tournament</Link></Button>}
        description="Simple tournament stats across all MTTs: total buy-ins, total returned, and total profit."
        title="Stats"
      />
      {data.tournaments.length === 0 ? (
        <EmptyState actionHref="/tournaments/new" actionLabel="Log first tournament" description="Add a tournament buy-in and optional cash returned to start the charts." title="No tournaments logged yet" />
      ) : null}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard detail={`Average buy-in ${data.baseCurrency} ${summary.simple.averageBuyIn}`} label="Total buy-ins" value={`${data.baseCurrency} ${summary.simple.totalBuyIns}`} />
        <MetricCard detail={`ROI ${summary.simple.roi === null ? "N/A" : `${summary.simple.roi.toFixed(2)}%`}`} label="Total profit" value={`${data.baseCurrency} ${summary.simple.totalProfit}`} />
        <MetricCard detail={`${summary.simple.completedTournaments} tournaments with results`} label="Total returned" value={`${data.baseCurrency} ${summary.simple.totalReturned}`} />
        <MetricCard detail={`Average bullets ${summary.averageBullets.toFixed(2)}`} label="Tournaments" value={String(summary.simple.tournaments)} />
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Buy-ins vs returns</CardTitle>
          </CardHeader>
          <CardContent>
            <TournamentProfitChart data={series} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent tournaments</CardTitle>
          </CardHeader>
          <CardContent>
            {recentTournaments.length === 0 ? (
              <p className="text-sm text-muted-foreground">No tournaments yet.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Buy-ins</TableHead>
                    <TableHead>Profit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTournaments.map((tournament) => {
                    const entries = data.entries.filter((entry) => entry.tournament_id === tournament.id);
                    const result = data.results.find((item) => item.tournament_id === tournament.id);
                    const performance = calculateTournamentPerformance(entries, result);

                    return (
                      <TableRow key={tournament.id}>
                        <TableCell>
                          <Link className="font-medium text-primary hover:underline" href={`/tournaments/${tournament.id}`}>
                            {tournament.name}
                          </Link>
                          <div className="text-xs text-muted-foreground">{tournament.starts_at.slice(0, 10)}</div>
                        </TableCell>
                        <TableCell>{data.baseCurrency} {performance.totalCost}</TableCell>
                        <TableCell>{data.baseCurrency} {performance.netProfit}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
