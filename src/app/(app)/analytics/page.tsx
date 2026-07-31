import { RoiBarChart } from "@/components/charts/bankroll-charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { groupRoiByTournamentDimension } from "@/lib/domain/calculations";
import { loadAppData } from "@/lib/data/app-data";
import { DataGate, PageHeader } from "../_components/page-kit";

export default async function AnalyticsPage() {
  const data = await loadAppData();
  if (data.status !== "ready") return <><PageHeader description="ROI by format, buy-in band, platform, venue, date, and entry depth." title="Analytics" /><DataGate data={data} /></>;
  return (
    <>
      <PageHeader description="ROI by format, buy-in band, platform, venue, date, and entry depth." title="Analytics" />
      <div className="grid gap-4 xl:grid-cols-2">
        <Card><CardHeader><CardTitle>ROI by format</CardTitle></CardHeader><CardContent><RoiBarChart data={groupRoiByTournamentDimension(data.tournaments, data.entries, data.results, "format")} /></CardContent></Card>
        <Card><CardHeader><CardTitle>ROI by buy-in band</CardTitle></CardHeader><CardContent><RoiBarChart data={groupRoiByTournamentDimension(data.tournaments, data.entries, data.results, "buy_in_band")} /></CardContent></Card>
        <Card><CardHeader><CardTitle>ROI by platform or venue</CardTitle></CardHeader><CardContent><RoiBarChart data={groupRoiByTournamentDimension(data.tournaments, data.entries, data.results, "platform")} /></CardContent></Card>
        <Card><CardHeader><CardTitle>ROI by entry depth</CardTitle></CardHeader><CardContent><RoiBarChart data={groupRoiByTournamentDimension(data.tournaments, data.entries, data.results, "entry_depth")} /></CardContent></Card>
      </div>
    </>
  );
}
