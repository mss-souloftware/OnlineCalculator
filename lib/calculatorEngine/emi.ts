/**
 * EMI (Equated Monthly Instalment) engine — a loan repaid in equal monthly
 * instalments. Same amortization math as a loan, expressed with a month tenure.
 */
import { amortize, type AmortizationResult } from "./amortization";

export type { AmortizationYear } from "./amortization";

export interface EmiInput {
  /** Loan principal. */
  principal: number;
  /** Annual interest rate as a percentage, e.g. 10 for 10%. */
  annualRate: number;
  /** Loan tenure in months. */
  tenureMonths: number;
}

export interface EmiResult extends AmortizationResult {
  principal: number;
  tenureMonths: number;
}

export function calculateEmi(input: EmiInput): EmiResult {
  const principal = Math.max(0, input.principal || 0);
  const tenureMonths = Math.max(0, Math.round(input.tenureMonths || 0));
  const result = amortize(principal, input.annualRate, tenureMonths / 12);
  return { principal, tenureMonths, ...result };
}
