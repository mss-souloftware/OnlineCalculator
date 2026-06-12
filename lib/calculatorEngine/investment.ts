/**
 * Investment engine — initial amount plus monthly contributions (with an
 * optional annual step-up) growing at an expected return, compounded monthly.
 */
import { simulateGrowth, type GrowthResult } from "./growth";

export type { GrowthYear } from "./growth";

export interface InvestmentInput {
  /** Initial lump-sum investment. */
  initial: number;
  /** Monthly contribution. */
  monthlyContribution: number;
  /** Expected annual return as a percentage, e.g. 8 for 8%. */
  annualReturn: number;
  years: number;
  /** Annual % increase applied to the monthly contribution each year. */
  annualIncrease: number;
}

export type InvestmentResult = GrowthResult;

export function calculateInvestment(input: InvestmentInput): InvestmentResult {
  return simulateGrowth({
    initial: input.initial,
    monthlyContribution: input.monthlyContribution,
    annualRate: input.annualReturn,
    years: input.years,
    periodsPerYear: 12,
    annualContributionIncrease: input.annualIncrease,
  });
}
