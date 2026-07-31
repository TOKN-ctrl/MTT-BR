import { describe, expect, it } from "vitest";
import {
  calculateAggregateRoi,
  calculateBankrollCurve,
  calculateBuyInsRemaining,
  calculateCurrentBankroll,
  calculateDrawdown,
  calculateSatelliteCampaignRoi,
  calculateTournamentCost,
  calculateTournamentPerformance,
} from "./calculations";

describe("bankroll calculations", () => {
  it("calculates current bankroll from immutable signed transactions", () => {
    expect(
      calculateCurrentBankroll([
        { amount_base: "1000.00" },
        { amount_base: "-109.00" },
        { amount_base: "250.50" },
      ]),
    ).toBe("1141.50");
  });

  it("calculates bankroll curve and drawdowns in chronological order", () => {
    const transactions = [
      { occurred_at: "2026-01-03T00:00:00Z", amount_base: "-300.00" },
      { occurred_at: "2026-01-01T00:00:00Z", amount_base: "1000.00" },
      { occurred_at: "2026-01-02T00:00:00Z", amount_base: "500.00" },
    ];

    expect(calculateBankrollCurve(transactions).map((point) => point.bankroll)).toEqual(["1000.00", "1500.00", "1200.00"]);
    expect(calculateDrawdown(transactions)).toEqual({
      bankrollPeak: "1500.00",
      currentDrawdown: "300.00",
      maximumDrawdown: "300.00",
    });
  });

  it("calculates buy-ins remaining", () => {
    expect(calculateBuyInsRemaining("5500.00", "55.00")).toBe(100);
  });
});

describe("tournament ROI calculations", () => {
  const entries = [
    { amount_paid_base: "100.00", fee_base: "9.00", add_on_base: "0.00" },
    { amount_paid_base: "100.00", fee_base: "9.00", add_on_base: "50.00" },
  ];

  it("calculates total tournament cost across bullets and add-ons", () => {
    expect(calculateTournamentCost(entries)).toBe("268.00");
  });

  it("calculates net profit and ROI", () => {
    expect(calculateTournamentPerformance(entries, { total_cash_returned_base: "536.00" })).toEqual({
      averageBullets: 2,
      netProfit: "268.00",
      roi: 100,
      totalCost: "268.00",
      totalReturned: "536.00",
    });
  });

  it("calculates aggregate ROI", () => {
    expect(calculateAggregateRoi(entries, [{ total_cash_returned_base: "134.00" }])).toBe(-50);
  });

  it("returns null ROI when cost is zero", () => {
    expect(calculateTournamentPerformance([], { total_cash_returned_base: "100.00" }).roi).toBeNull();
  });
});

describe("satellite campaigns", () => {
  it("calculates realized campaign ROI", () => {
    expect(
      calculateSatelliteCampaignRoi([
        { total_spend_base: "120.00", realized_value_base: "530.00" },
        { total_spend_base: "80.00", realized_value_base: "0.00" },
      ]),
    ).toEqual({
      realizedRoi: 165,
      realizedValue: "530.00",
      spend: "200.00",
    });
  });
});
