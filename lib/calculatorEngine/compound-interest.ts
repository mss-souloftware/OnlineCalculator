/**
 * Compound interest engine — its distinguishing feature is the compounding
 * frequency selector. The growth math is delegated to the shared simulator.
 */
import { simulateGrowth, type GrowthResult } from "./growth";

export type { GrowthYear, GrowthResult } from "./growth";

export type CompoundFrequency =
  | "annually"
  | "semiannually"
  | "quarterly"
  | "monthly"
  | "daily";

export const FREQUENCIES: {
  value: CompoundFrequency;
  label: string;
  perYear: number;
}[] = [
  { value: "annually", label: "Annually", perYear: 1 },
  { value: "semiannually", label: "Semi-annually", perYear: 2 },
  { value: "quarterly", label: "Quarterly", perYear: 4 },
  { value: "monthly", label: "Monthly", perYear: 12 },
  { value: "daily", label: "Daily", perYear: 365 },
];

export function periodsPerYear(frequency: CompoundFrequency): number {
  return FREQUENCIES.find((f) => f.value === frequency)?.perYear ?? 12;
}

export interface CompoundInput {
  principal: number;
  /** Annual interest rate as a percentage, e.g. 7 for 7%. */
  annualRate: number;
  years: number;
  frequency: CompoundFrequency;
  /** Optional regular monthly contribution (0 for none). */
  monthlyContribution: number;
}

export type CompoundResult = GrowthResult;

export function calculateCompoundInterest(
  input: CompoundInput,
): CompoundResult {
  return simulateGrowth({
    initial: input.principal,
    monthlyContribution: input.monthlyContribution,
    annualRate: input.annualRate,
    years: input.years,
    periodsPerYear: periodsPerYear(input.frequency),
  });
}
