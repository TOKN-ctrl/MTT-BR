import Link from "next/link";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatTournamentFormat } from "@/lib/domain/calculations";
import { loadAppData } from "@/lib/data/app-data";
import { DataGate, EmptyState, PageHeader } from "../_components/page-kit";

export default async function TournamentsPage() {
  const data = await loadAppData();
  if (data.status !== "ready") {
    return (
      <>
        <PageHeader description="MTT schedule, bullets, formats, and result completion status." title="Tournaments" />
        <DataGate data={data} />
      </>
    );
  }

  return (
    <>
      <PageHeader
        action={<Button asChild><Link href="/tournaments/new"><Plus />New tournament</Link></Button>}
        description="MTT schedule, bullets, formats, and result completion status."
        title="Tournaments"
      />
      <Card>
        <CardHeader><CardTitle>All tournaments</CardTitle></CardHeader>
        <CardContent>
          {data.tournaments.length === 0 ? (
            <EmptyState actionHref="/tournaments/new" actionLabel="Log tournament" description="Create an MTT before adding bullets and results." title="No tournaments logged" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow><TableHead>Name</TableHead><TableHead>Format</TableHead><TableHead>Buy-in</TableHead><TableHead>Bullets</TableHead><TableHead>Status</TableHead></TableRow>
              </TableHeader>
              <TableBody>
                {data.tournaments.map((tournament) => {
                  const bullets = data.entries.filter((entry) => entry.tournament_id === tournament.id).length;
                  const result = data.results.find((item) => item.tournament_id === tournament.id);
                  return (
                    <TableRow key={tournament.id}>
                      <TableCell><Link className="font-medium text-primary hover:underline" href={`/tournaments/${tournament.id}`}>{tournament.name}</Link><div className="text-xs text-muted-foreground">{tournament.platform_or_venue}</div></TableCell>
                      <TableCell>{formatTournamentFormat(tournament.format)}</TableCell>
                      <TableCell>{tournament.currency} {tournament.base_buy_in} + {tournament.fee}</TableCell>
                      <TableCell>{bullets}</TableCell>
                      <TableCell><Badge variant={result ? "success" : "outline"}>{result ? "result saved" : "open"}</Badge></TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </>
  );
}
