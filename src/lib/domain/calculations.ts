import type {
  BankrollTransactionRow,
  SatelliteCampaignRow,
  TournamentEntryRow,
  TournamentFormat,
  TournamentResultRow,
  TournamentRow,
} from "@/types/database.types";
import { addMoney, compareMoney, divideToPercent, fromUnits, subtractMoney, toUnits } from "./money";

export type TournamentPerformance = {
  totalCost: string;
  totalReturned: string;
  netProfit: string;
  roi: number | null;
  averageBullets: number;
};

export function calculateCurrentBankroll(transactions: Pick<BankrollTransactionRow, "amount_base">[]) {
  return addMoney(transactions.map((transaction) => transaction.amount_base));
}

export function calculateTournamentCost(entries: Pick<TournamentEntryRow, "amount_paid_base" | "fee_base" | "add_on_base">[]) {
  return addMoney(entries.flatMap((entry) => [entry.amount_paid_base, entry.fee_base, entry.add_on_base]));
}

export function calculateTournamentPerformance(
  entries: Pick<TournamentEntryRow, "amount_paid_base" | "fee_base" | "add_on_base">[],
  result?: Pick<TournamentResultRow, "total_cash_returned_base"> | null,
): TournamentPerformance {
  const totalCost = calculateTournamentCost(entries);
  const totalReturned = result?.total_cash_returned_base ?? "0.00";
  const netProfit = subtractMoney(totalReturned, totalCost);

  return {
    averageBullets: entries.length,
    netProfit,
    roi: divideToPercent(netProfit, totalCost),
    totalCost,
    totalReturned,
  };
}

export function calculateItmPercentage(results: Pick<TournamentResultRow, "total_cash_returned_base">[]) {
  if (results.length === 0) return null;
  const itm = results.filter((result) => compareMoney(result.total_cash_returned_base, "0") > 0).length;
  return (itm / results.length) * 100;
}

export function calculateFinalTablePercentage(results: Pick<TournamentResultRow, "final_table">[]) {
  if (results.length === 0) return null;
  return (results.filter((result) => result.final_table).length / results.length) * 100;
}

export function calculateAverageBuyIn(
  entries: Pick<TournamentEntryRow, "amount_paid_base" | "fee_base" | "add_on_base">[],
  tournamentCount: number,
) {
  if (tournamentCount === 0) return "0.00";
  const total = toUnits(calculateTournamentCost(entries));
  return fromUnits(total / BigInt(tournamentCount));
}

export function calculateAverageBullets(entries: Pick<TournamentEntryRow, "tournament_id">[]) {
  if (entries.length === 0) return 0;
  const tournaments = new Set(entries.map((entry) => entry.tournament_id));
  return entries.length / tournaments.size;
}

export function calculateBankrollCurve(transactions: Pick<BankrollTransactionRow, "amount_base" | "occurred_at">[]) {
  let current = 0n;
  let peak = 0n;
  let maxDrawdown = 0n;

  return transactions
    .slice()
    .sort((left, right) => left.occurred_at.localeCompare(right.occurred_at))
    .map((transaction) => {
      current += toUnits(transaction.amount_base);
      if (current > peak) peak = current;
      const drawdown = peak - current;
      if (drawdown > maxDrawdown) maxDrawdown = drawdown;

      return {
        bankroll: fromUnits(current),
        date: transaction.occurred_at,
        drawdown: fromUnits(drawdown),
        peak: fromUnits(peak),
      };
    });
}

export function calculateDrawdown(transactions: Pick<BankrollTransactionRow, "amount_base" | "occurred_at">[]) {
  const curve = calculateBankrollCurve(transactions);
  const last = curve.at(-1);

  return {
    bankrollPeak: curve.reduce((peak, point) => (compareMoney(point.peak, peak) > 0 ? point.peak : peak), "0.00"),
    currentDrawdown: last?.drawdown ?? "0.00",
    maximumDrawdown: curve.reduce((max, point) => (compareMoney(point.drawdown, max) > 0 ? point.drawdown : max), "0.00"),
  };
}

export function calculateBuyInsRemaining(bankroll: string, averageBuyIn: string) {
  const averageBuyInUnits = toUnits(averageBuyIn);
  if (averageBuyInUnits === 0n) return null;
  return Number((toUnits(bankroll) * 100n) / averageBuyInUnits) / 100;
}

export function calculateAggregateRoi(
  entries: Pick<TournamentEntryRow, "amount_paid_base" | "fee_base" | "add_on_base">[],
  results: Pick<TournamentResultRow, "total_cash_returned_base">[],
) {
  const totalCost = calculateTournamentCost(entries);
  const totalReturned = addMoney(results.map((result) => result.total_cash_returned_base));
  return divideToPercent(subtractMoney(totalReturned, totalCost), totalCost);
}

export function calculateSatelliteCampaignRoi(campaigns: Pick<SatelliteCampaignRow, "total_spend_base" | "realized_value_base">[]) {
  const spend = addMoney(campaigns.map((campaign) => campaign.total_spend_base));
  const realized = addMoney(campaigns.map((campaign) => campaign.realized_value_base));
  return {
    realizedRoi: divideToPercent(subtractMoney(realized, spend), spend),
    realizedValue: realized,
    spend,
  };
}

export function groupRoiByTournamentDimension(
  tournaments: Pick<TournamentRow, "id" | "format" | "platform_or_venue" | "starts_at" | "base_buy_in">[],
  entries: (Pick<TournamentEntryRow, "tournament_id" | "amount_paid_base" | "fee_base" | "add_on_base">)[],
  results: (Pick<TournamentResultRow, "tournament_id" | "total_cash_returned_base">)[],
  dimension: "format" | "platform" | "date" | "buy_in_band" | "entry_depth",
) {
  const rows = new Map<string, { cost: bigint; returned: bigint; tournaments: number }>();

  for (const tournament of tournaments) {
    const tournamentEntries = entries.filter((entry) => entry.tournament_id === tournament.id);
    const result = results.find((item) => item.tournament_id === tournament.id);
    const key = getDimensionKey(tournament, tournamentEntries.length, dimension);
    const existing = rows.get(key) ?? { cost: 0n, returned: 0n, tournaments: 0 };
    existing.cost += toUnits(calculateTournamentCost(tournamentEntries));
    existing.returned += toUnits(result?.total_cash_returned_base ?? "0.00");
    existing.tournaments += 1;
    rows.set(key, existing);
  }

  return Array.from(rows.entries()).map(([label, row]) => {
    const net = row.returned - row.cost;
    return {
      label,
      netProfit: fromUnits(net),
      roi: row.cost === 0n ? null : Number((net * 10_000n) / row.cost) / 100,
      tournaments: row.tournaments,
    };
  });
}

function getDimensionKey(
  tournament: Pick<TournamentRow, "format" | "platform_or_venue" | "starts_at" | "base_buy_in">,
  entryDepth: number,
  dimension: "format" | "platform" | "date" | "buy_in_band" | "entry_depth",
) {
  if (dimension === "format") return formatTournamentFormat(tournament.format);
  if (dimension === "platform") return tournament.platform_or_venue;
  if (dimension === "date") return tournament.starts_at.slice(0, 10);
  if (dimension === "entry_depth") return `${Math.max(entryDepth, 1)} bullet${entryDepth === 1 ? "" : "s"}`;

  const buyIn = toUnits(tournament.base_buy_in);
  if (buyIn < toUnits("22")) return "Under $22";
  if (buyIn < toUnits("55")) return "$22-$54";
  if (buyIn < toUnits("109")) return "$55-$108";
  if (buyIn < toUnits("530")) return "$109-$529";
  return "$530+";
}

export function formatTournamentFormat(format: TournamentFormat) {
  return format
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
