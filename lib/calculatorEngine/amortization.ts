/**
 * Shared amortization math for any fixed-rate, fully-amortizing loan.
 * Pure functions, zero UI coupling (SOP). Reused by the mortgage and loan
 * calculators so the schedule logic lives in exactly one place.
 */

export interface AmortizationYear {
  year: number;
  principalPaid: number;
  interestPaid: number;
  /** Remaining balance at the end of the year. */
  balance: number;
}

export interface AmortizationResult {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  /** Year-by-year summary. */
  schedule: AmortizationYear[];
}

/**
 * Standard amortizing loan. Handles the 0% edge case and a 0 term, and never
 * returns NaN/Infinity.
 */
export function amortize(
  loanAmount: number,
  annualRate: number,
  termYears: number,
): AmortizationResult {
  loanAmount = Math.max(0, loanAmount || 0);
  termYears = Math.max(0, termYears || 0);
  annualRate = Math.max(0, annualRate || 0);

  const n = Math.round(termYears * 12);
  const r = annualRate / 100 / 12;

  let monthlyPayment = 0;
  if (n > 0) {
    monthlyPayment =
      r === 0
        ? loanAmount / n
        : (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  }
  if (!Number.isFinite(monthlyPayment)) monthlyPayment = 0;

  const schedule: AmortizationYear[] = [];
  let balance = loanAmount;
  for (let year = 1; year <= termYears && balance > 0.005; year++) {
    let principalPaid = 0;
    let interestPaid = 0;
    for (let m = 0; m < 12 && balance > 0.005; m++) {
      const interest = balance * r;
      let principal = monthlyPayment - interest;
      if (principal > balance) principal = balance;
      balance -= principal;
      interestPaid += interest;
      principalPaid += principal;
    }
    schedule.push({
      year,
      principalPaid,
      interestPaid,
      balance: Math.max(0, balance),
    });
  }

  const totalPayment = monthlyPayment * n;
  const totalInterest = Math.max(0, totalPayment - loanAmount);

  return { monthlyPayment, totalPayment, totalInterest, schedule };
}
