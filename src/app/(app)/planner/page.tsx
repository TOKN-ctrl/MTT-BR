import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { calculateCurrentBankroll } from "@/lib/domain/calculations";
import { classifyTournament } from "@/lib/domain/rules";
import { addMoney } from "@/lib/domain/money";
import { loadAppData } from "@/lib/data/app-data";
import { DataGate, EmptyState, PageHeader } from "../_components/page-kit";

export default async function PlannerPage() {
  const data = await loadAppData();
  if (data.status !== "ready") return <><PageHeader description="Classify planned tournaments as safe, elevated risk, shot, or blocked using your saved rules." title="Tournament planner" /><DataGate data={data} /></>;
  const bankroll = calculateCurrentBankroll(data.transactions);
  const rulesRow = data.rules[0];
  const rules = rulesRow ? {
    maxDailyLoss: rulesRow.max_daily_loss_base,
    maxDailySpend: rulesRow.max_daily_spend_base,
    maxReentriesPerTournament: rulesRow.max_reentries_per_tournament,
    maxSeriesBudget: rulesRow.max_series_budget_base,
    minReserveByFormat: {
      freezeout: rulesRow.min_reserve_freezeout,
      reentry: rulesRow.min_reserve_reentry,
      rebuy_add_on: rulesRow.min_reserve_rebuy_add_on,
      regular_bounty: rulesRow.min_reserve_bounty,
      satellite: rulesRow.min_reserve_satellite,
    },
    mode: rulesRow.mode,
    satelliteBudget: rulesRow.satellite_budget_base,
  } : null;
  const planned = data.tournaments.slice(0, 20).map((tournament) => {
    const totalEstimatedCost = addMoney([tournament.base_buy_in, tournament.fee]);
    return {
      tournament,
      result: rules ? classifyTournament(bankroll, rules, { format: tournament.format, plannedReentries: 0, totalEstimatedCost }) : null,
    };
  });
  return (
    <>
      <PageHeader description="Classify planned tournaments as safe, elevated risk, shot, or blocked using your saved rules." title="Tournament planner" />
      <Card><CardHeader><CardTitle>Planned classifications</CardTitle></CardHeader><CardContent>{!rules ? <EmptyState actionHref="/rules" actionLabel="Create rules" title="No active rules" description="Planner output requires a saved bankroll rule set." /> : <Table><TableHeader><TableRow><TableHead>Tournament</TableHead><TableHead>Estimated cost</TableHead><TableHead>Required bankroll</TableHead><TableHead>Classification</TableHead></TableRow></TableHeader><TableBody>{planned.map(({ tournament, result }) => <TableRow key={tournament.id}><TableCell>{tournament.name}</TableCell><TableCell>{data.baseCurrency} {addMoney([tournament.base_buy_in, tournament.fee])}</TableCell><TableCell>{data.baseCurrency} {result?.requiredBankroll}</TableCell><TableCell><Badge variant={result?.classification === "blocked" ? "destructive" : result?.classification === "safe" ? "success" : "warning"}>{result?.classification.replace("_", " ")}</Badge></TableCell></TableRow>)}</TableBody></Table>}</CardContent></Card>
    </>
  );
}
