import { SatelliteCampaignForm } from "@/components/forms/operations-forms";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { calculateSatelliteCampaignRoi } from "@/lib/domain/calculations";
import { loadAppData } from "@/lib/data/app-data";
import { DataGate, EmptyState, MetricCard, PageHeader } from "../_components/page-kit";

export default async function SatellitesPage() {
  const data = await loadAppData();
  if (data.status !== "ready") return <><PageHeader description="Track satellite campaigns, tournament tickets, and realized ticket value separately from cash bankroll." title="Satellites and tickets" /><DataGate data={data} /></>;
  const satellite = calculateSatelliteCampaignRoi(data.satellites);
  return (
    <>
      <PageHeader description="Track satellite campaigns, tournament tickets, and realized ticket value separately from cash bankroll." title="Satellites and tickets" />
      <div className="mb-4 grid gap-4 md:grid-cols-3"><MetricCard label="Satellite spend" value={`${data.baseCurrency} ${satellite.spend}`} /><MetricCard label="Realized value" value={`${data.baseCurrency} ${satellite.realizedValue}`} /><MetricCard label="Realized ROI" value={satellite.realizedRoi === null ? "N/A" : `${satellite.realizedRoi.toFixed(2)}%`} /></div>
      <div className="grid gap-4 xl:grid-cols-[1fr_1.2fr]">
        <Card><CardHeader><CardTitle>Campaign</CardTitle></CardHeader><CardContent><SatelliteCampaignForm /></CardContent></Card>
        <Card><CardHeader><CardTitle>Campaigns</CardTitle></CardHeader><CardContent>{data.satellites.length === 0 ? <EmptyState title="No satellite campaigns" description="Campaign ROI becomes meaningful once spend and ticket value are tracked." /> : <Table><TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Spend</TableHead><TableHead>Value</TableHead></TableRow></TableHeader><TableBody>{data.satellites.map((campaign) => <TableRow key={campaign.id}><TableCell>{campaign.name}</TableCell><TableCell>{campaign.total_spend_base}</TableCell><TableCell>{campaign.realized_value_base}</TableCell></TableRow>)}</TableBody></Table>}</CardContent></Card>
      </div>
    </>
  );
}
