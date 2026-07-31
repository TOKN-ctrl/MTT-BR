import { CsvImportForm } from "@/components/forms/operations-forms";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { loadAppData } from "@/lib/data/app-data";
import { DataGate, PageHeader } from "../_components/page-kit";

export default async function ImportPage() {
  const data = await loadAppData();
  return (
    <>
      <PageHeader description="CSV import/export bookkeeping for bankroll, tournaments, bullets, results, and tickets." title="CSV import/export" />
      {data.status !== "ready" ? <DataGate data={data} /> : (
        <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
          <Card><CardHeader><CardTitle>Record validated import</CardTitle></CardHeader><CardContent><CsvImportForm /></CardContent></Card>
          <Card>
            <CardHeader><CardTitle>Export CSV</CardTitle></CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {["bankroll", "tournaments", "entries", "results", "satellites", "tickets"].map((kind) => (
                <Button asChild key={kind} variant="outline">
                  <a href={`/api/export/${kind}`}>{kind}</a>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
