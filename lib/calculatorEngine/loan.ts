/**
 * Loan calculation engine — pure functions. Thin wrapper over the shared
 * amortization math; a loan is simply a principal amortized over a term.
 */
import { amortize, type AmortizationResult } from "./amortization";

export interface LoanInput {
  /** Amount borrowed (principal). */
  amount: number;
  /** Annual interest rate as a percentage, e.g. 8.5 for 8.5%. */
  annualRate: number;
  /** Loan term in years. */
  termYears: number;
}

export interface LoanResult extends AmortizationResult {
  /** The principal borrowed (echoed for convenience). */
  principal: number;
}

export function calculateLoan(input: LoanInput): LoanResult {
  const principal = Math.max(0, input.amount || 0);
  const result = amortize(principal, input.annualRate, input.termYears);
  return { principal, ...result };
}
