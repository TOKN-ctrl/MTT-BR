import { TournamentForm } from "@/components/forms/tournament-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { loadAppData } from "@/lib/data/app-data";
import { DataGate, PageHeader } from "../../_components/page-kit";

export default async function NewTournamentPage() {
  const data = await loadAppData();
  return (
    <>
      <PageHeader description="Log the tournament details, first buy-in, and optional cash returned. Saving sends you back to the stats dashboard." title="Log tournament" />
      {data.status === "ready" ? (
        <Card>
          <CardHeader><CardTitle>Tournament record</CardTitle></CardHeader>
          <CardContent><TournamentForm baseCurrency={data.baseCurrency} /></CardContent>
        </Card>
      ) : (
        <DataGate data={data} />
      )}
    </>
  );
}
