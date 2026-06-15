/**
 * Retirement engine — projects a nest egg from current savings plus monthly
 * contributions until retirement, then estimates sustainable monthly income
 * from a safe withdrawal rate. Growth math delegated to the shared simulator.
 */
import { simulateGrowth, type GrowthResult } from "./growth";

export type { GrowthYear } from "./growth";

export interface RetirementInput {
  currentAge: number;
  retirementAge: number;
  currentSavings: number;
  monthlyContribution: number;
  /** Expected annual return before retirement, as a percentage. */
  annualReturn: number;
  /** Safe annual withdrawal rate in retirement, as a percentage (e.g. 4). */
  withdrawalRate: number;
}

export interface RetirementResult extends GrowthResult {
  /** Years from now until retirement. */
  years: number;
  /** Projected savings at retirement. */
  corpus: number;
  /** Estimated monthly income from the withdrawal rate. */
  monthlyIncome: number;
}

export function calculateRetirement(input: RetirementInput): RetirementResult {
  const years = Math.max(
    0,
    Math.round((input.retirementAge || 0) - (input.currentAge || 0)),
  );

  const sim = simulateGrowth({
    initial: input.currentSavings,
    monthlyContribution: input.monthlyContribution,
    annualRate: input.annualReturn,
    years,
    periodsPerYear: 12,
  });

  const withdrawalRate = input.withdrawalRate > 0 ? input.withdrawalRate : 4;
  const monthlyIncome = (sim.finalBalance * (withdrawalRate / 100)) / 12;

  return { ...sim, years, corpus: sim.finalBalance, monthlyIncome };
}
