import {
  calculateAggregateRoi,
  calculateAverageBullets,
  calculateAverageBuyIn,
  calculateBuyInsRemaining,
  calculateCurrentBankroll,
  calculateDrawdown,
  calculateItmPercentage,
  calculateSatelliteCampaignRoi,
  calculateSimpleTournamentStats,
} from "@/lib/domain/calculations";
import type { AppData } from "./app-data";

export function buildDashboardSummary(data: Extract<AppData, { status: "ready" }>) {
  const bankroll = calculateCurrentBankroll(data.transactions);
  const averageBuyIn = calculateAverageBuyIn(data.entries, data.tournaments.length);
  const drawdown = calculateDrawdown(data.transactions);

  return {
    aggregateRoi: calculateAggregateRoi(data.entries, data.results),
    averageBullets: calculateAverageBullets(data.entries),
    averageBuyIn,
    bankroll,
    buyInsRemaining: calculateBuyInsRemaining(bankroll, averageBuyIn),
    finalTablePercentage: data.results.length ? (data.results.filter((result) => result.final_table).length / data.results.length) * 100 : null,
    itmPercentage: calculateItmPercentage(data.results),
    satellite: calculateSatelliteCampaignRoi(data.satellites),
    simple: calculateSimpleTournamentStats(data.tournaments, data.entries, data.results),
    ...drawdown,
  };
}
