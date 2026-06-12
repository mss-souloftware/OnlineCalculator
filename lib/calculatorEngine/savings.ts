/**
 * Savings engine — regular monthly deposits (plus an optional starting balance)
 * growing at an interest rate, compounded monthly, with savings-goal analysis.
 */
import { simulateGrowth, type GrowthResult } from "./growth";

export type { GrowthYear } from "./growth";

export interface SavingsInput {
  /** Starting balance. */
  initialDeposit: number;
  /** Monthly deposit. */
  monthlyDeposit: number;
  /** Annual interest rate as a percentage, e.g. 4 for 4%. */
  annualRate: number;
  years: number;
  /** Optional savings target (0 = no goal). */
  goal: number;
}

export interface SavingsResult extends GrowthResult {
  goal: number;
  goalReached: boolean;
  /** First year the goal is met, or null if never within the term. */
  goalYear: number | null;
  /** Amount still short of the goal at the end of the term. */
  shortfall: number;
  /** Progress toward the goal, 0–100. */
  goalProgress: number;
}

export function calculateSavings(input: SavingsInput): SavingsResult {
  const sim = simulateGrowth({
    initial: input.initialDeposit,
    monthlyContribution: input.monthlyDeposit,
    annualRate: input.annualRate,
    years: input.years,
    periodsPerYear: 12,
  });

  const goal = Math.max(0, input.goal || 0);
  const goalReached = goal > 0 && sim.finalBalance >= goal;
  const hit = goal > 0 ? sim.growth.find((g) => g.balance >= goal) : undefined;

  return {
    ...sim,
    goal,
    goalReached,
    goalYear: hit ? hit.year : null,
    shortfall: goal > 0 ? Math.max(0, goal - sim.finalBalance) : 0,
    goalProgress:
      goal > 0 ? Math.min(100, (sim.finalBalance / goal) * 100) : 0,
  };
}
