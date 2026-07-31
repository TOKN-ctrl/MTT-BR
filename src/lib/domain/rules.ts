import type { RuleClassification, RuleMode, TournamentFormat } from "@/types/database.types";
import { compareMoney, multiplyMoney } from "./money";

export type RuleSet = {
  mode: RuleMode;
  minReserveByFormat: Partial<Record<TournamentFormat, string>>;
  maxDailyLoss?: string | null;
  maxDailySpend?: string | null;
  maxReentriesPerTournament: number;
  maxSeriesBudget?: string | null;
  satelliteBudget?: string | null;
};

export type PlannedTournament = {
  format: TournamentFormat;
  totalEstimatedCost: string;
  plannedReentries: number;
  dailySpendAfterEntry?: string;
  dailyLossAfterEntry?: string;
  seriesSpendAfterEntry?: string;
  satelliteSpendAfterEntry?: string;
};

export type ClassificationResult = {
  classification: RuleClassification;
  requiredBankroll: string;
  violations: string[];
};

export function classifyTournament(bankroll: string, rules: RuleSet, tournament: PlannedTournament): ClassificationResult {
  const reserve = reserveForFormat(rules, tournament.format);
  const requiredBankroll = multiplyMoney(tournament.totalEstimatedCost, reserve);
  const violations = collectViolations(rules, tournament);
  const bankrollToRequired = compareMoney(bankroll, requiredBankroll);

  if (rules.mode === "strict" && (violations.length > 0 || bankrollToRequired < 0)) {
    return { classification: "blocked", requiredBankroll, violations };
  }

  if (bankrollToRequired >= 0 && violations.length === 0) {
    return { classification: "safe", requiredBankroll, violations };
  }

  const elevatedThreshold = multiplyMoney(requiredBankroll, "0.75");
  if (compareMoney(bankroll, elevatedThreshold) >= 0 && violations.length <= 1) {
    return { classification: "elevated_risk", requiredBankroll, violations };
  }

  return { classification: rules.mode === "warning_only" ? "shot" : "blocked", requiredBankroll, violations };
}

export function reserveForFormat(rules: RuleSet, format: TournamentFormat) {
  if (format === "satellite" || format === "step_satellite") return rules.minReserveByFormat.satellite ?? "50";
  if (format === "reentry" || format === "multi_flight") return rules.minReserveByFormat.reentry ?? "150";
  if (format === "rebuy_add_on") return rules.minReserveByFormat.rebuy_add_on ?? "200";
  if (format === "regular_bounty" || format === "progressive_knockout" || format === "mystery_bounty") {
    return rules.minReserveByFormat.regular_bounty ?? "125";
  }
  return rules.minReserveByFormat.freezeout ?? "100";
}

function collectViolations(rules: RuleSet, tournament: PlannedTournament) {
  const violations: string[] = [];

  if (tournament.plannedReentries > rules.maxReentriesPerTournament) {
    violations.push("Planned reentries exceed the tournament limit.");
  }
  if (rules.maxDailySpend && tournament.dailySpendAfterEntry && compareMoney(tournament.dailySpendAfterEntry, rules.maxDailySpend) > 0) {
    violations.push("Daily tournament spend limit exceeded.");
  }
  if (rules.maxDailyLoss && tournament.dailyLossAfterEntry && compareMoney(tournament.dailyLossAfterEntry, rules.maxDailyLoss) > 0) {
    violations.push("Daily loss limit exceeded.");
  }
  if (rules.maxSeriesBudget && tournament.seriesSpendAfterEntry && compareMoney(tournament.seriesSpendAfterEntry, rules.maxSeriesBudget) > 0) {
    violations.push("Series budget exceeded.");
  }
  if (
    rules.satelliteBudget &&
    tournament.satelliteSpendAfterEntry &&
    compareMoney(tournament.satelliteSpendAfterEntry, rules.satelliteBudget) > 0
  ) {
    violations.push("Satellite budget exceeded.");
  }

  return violations;
}
