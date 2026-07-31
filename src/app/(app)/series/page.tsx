import { SeriesForm } from "@/components/forms/operations-forms";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { loadAppData } from "@/lib/data/app-data";
import { DataGate, EmptyState, PageHeader } from "../_components/page-kit";

export default async function SeriesPage() {
  const data = await loadAppData();
  return (
    <>
      <PageHeader description="Control SCOOP/WCOOP/live-trip style tournament series spend before the schedule starts." title="Tournament-series budgets" />
      {data.status !== "ready" ? <DataGate data={data} /> : (
        <div className="grid gap-4 xl:grid-cols-[1fr_1.2fr]">
          <Card><CardHeader><CardTitle>New series</CardTitle></CardHeader><CardContent><SeriesForm /></CardContent></Card>
          <Card><CardHeader><CardTitle>Series</CardTitle></CardHeader><CardContent>{data.series.length === 0 ? <EmptyState title="No series budgets" description="Add a series budget to monitor festival-level spend." /> : <Table><TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Dates</TableHead><TableHead>Budget</TableHead></TableRow></TableHeader><TableBody>{data.series.map((series) => <TableRow key={series.id}><TableCell>{series.name}</TableCell><TableCell>{series.start_date} - {series.end_date ?? "open"}</TableCell><TableCell>{data.baseCurrency} {series.budget_base}</TableCell></TableRow>)}</TableBody></Table>}</CardContent></Card>
        </div>
      )}
    </>
  );
}
