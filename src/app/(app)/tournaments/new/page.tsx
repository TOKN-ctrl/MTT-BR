import { TournamentForm } from "@/components/forms/tournament-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { loadAppData } from "@/lib/data/app-data";
import { DataGate, PageHeader } from "../../_components/page-kit";

export default async function NewTournamentPage() {
  const data = await loadAppData();
  return (
    <>
      <PageHeader description="Fast MTT setup with format, speed, starting stack, guarantee, flight, and late-registration details." title="New tournament" />
      {data.status === "ready" ? (
        <Card>
          <CardHeader><CardTitle>Tournament details</CardTitle></CardHeader>
          <CardContent><TournamentForm baseCurrency={data.baseCurrency} /></CardContent>
        </Card>
      ) : (
        <DataGate data={data} />
      )}
    </>
  );
}
