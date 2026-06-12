/**
 * Mortgage calculation engine — pure functions, zero UI coupling (SOP).
 * A mortgage is the home price minus the down payment, amortized over a term,
 * so the schedule math is delegated to the shared `amortize` helper.
 */
import { amortize } from "./amortization";

export type { AmortizationYear } from "./amortization";

export interface MortgageInput {
  /** Total home price. */
  homePrice: number;
  /** Down payment amount (absolute, not a percentage). */
  downPayment: number;
  /** Annual interest rate as a percentage, e.g. 6.5 for 6.5%. */
  annualRate: number;
  /** Loan term in years. */
  termYears: number;
}

export interface MortgageResult {
  loanAmount: number;
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  downPaymentPercent: number;
  schedule: import("./amortization").AmortizationYear[];
}

/** Clamps a down payment that exceeds the home price, then amortizes the loan. */
export function calculateMortgage(input: MortgageInput): MortgageResult {
  const homePrice = Math.max(0, input.homePrice || 0);
  const downPayment = Math.min(Math.max(0, input.downPayment || 0), homePrice);
  const loanAmount = homePrice - downPayment;

  const { monthlyPayment, totalPayment, totalInterest, schedule } = amortize(
    loanAmount,
    input.annualRate,
    input.termYears,
  );

  const downPaymentPercent = homePrice > 0 ? (downPayment / homePrice) * 100 : 0;

  return {
    loanAmount,
    monthlyPayment,
    totalPayment,
    totalInterest,
    downPaymentPercent,
    schedule,
  };
}
