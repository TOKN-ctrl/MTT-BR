import { describe, expect, it } from "vitest";
import { classifyTournament, type RuleSet } from "./rules";

const rules: RuleSet = {
  maxDailyLoss: "500.00",
  maxDailySpend: "750.00",
  maxReentriesPerTournament: 2,
  maxSeriesBudget: "2500.00",
  minReserveByFormat: {
    freezeout: "100",
    reentry: "150",
    regular_bounty: "125",
    satellite: "50",
  },
  mode: "strict",
  satelliteBudget: "300.00",
};

describe("rules engine", () => {
  it("classifies a properly reserved freezeout as safe", () => {
    expect(
      classifyTournament("11000.00", rules, {
        format: "freezeout",
        plannedReentries: 0,
        totalEstimatedCost: "109.00",
      }),
    ).toMatchObject({ classification: "safe", requiredBankroll: "10900.00", violations: [] });
  });

  it("blocks under-reserved tournaments in strict mode", () => {
    expect(
      classifyTournament("5000.00", rules, {
        format: "reentry",
        plannedReentries: 1,
        totalEstimatedCost: "109.00",
      }).classification,
    ).toBe("blocked");
  });

  it("blocks hard spending violations in strict mode", () => {
    const result = classifyTournament("50000.00", rules, {
      dailySpendAfterEntry: "800.00",
      format: "freezeout",
      plannedReentries: 0,
      totalEstimatedCost: "109.00",
    });

    expect(result.classification).toBe("blocked");
    expect(result.violations).toContain("Daily tournament spend limit exceeded.");
  });

  it("allows warning-only shot classifications", () => {
    expect(
      classifyTournament(
        "5000.00",
        { ...rules, mode: "warning_only" },
        {
          format: "reentry",
          plannedReentries: 3,
          totalEstimatedCost: "109.00",
        },
      ).classification,
    ).toBe("shot");
  });
});
