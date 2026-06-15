/**
 * Credit card payoff engine — given a fixed monthly payment, how long until the
 * balance is clear and how much interest it costs. Detects the case where the
 * payment doesn't even cover the monthly interest (balance never clears).
 */
import type { AmortizationYear } from "./amortization";

export type { AmortizationYear } from "./amortization";

export interface CreditCardInput {
  /** Current balance owed. */
  balance: number;
  /** Annual percentage rate, e.g. 19.99 for 19.99%. */
  apr: number;
  /** Fixed amount paid each month. */
  monthlyPayment: number;
}

export interface CreditCardResult {
  payoffMonths: number;
  totalInterest: number;
  totalPaid: number;
  /** True if the payment is too small to ever clear the balance. */
  neverPaysOff: boolean;
  /** Interest accruing in the first month — the payment must exceed this. */
  firstMonthInterest: number;
  schedule: AmortizationYear[];
}

const MAX_MONTHS = 1200; // 100-year safety cap

export function calculateCreditCardPayoff(
  input: CreditCardInput,
): CreditCardResult {
  const startBalance = Math.max(0, input.balance || 0);
  const apr = Math.max(0, input.apr || 0);
  const payment = Math.max(0, input.monthlyPayment || 0);
  const r = apr / 100 / 12;
  const firstMonthInterest = startBalance * r;

  if (startBalance <= 0) {
    return {
      payoffMonths: 0,
      totalInterest: 0,
      totalPaid: 0,
      neverPaysOff: false,
      firstMonthInterest,
      schedule: [],
    };
  }

  if (payment <= firstMonthInterest) {
    return {
      payoffMonths: Infinity,
      totalInterest: Infinity,
      totalPaid: Infinity,
      neverPaysOff: true,
      firstMonthInterest,
      schedule: [],
    };
  }

  const schedule: AmortizationYear[] = [];
  let balance = startBalance;
  let totalInterest = 0;
  let months = 0;
  let year = 1;
  let monthsInYear = 0;
  let yearInterest = 0;
  let yearPrincipal = 0;

  while (balance > 0.005 && months < MAX_MONTHS) {
    const interest = balance * r;
    let principal = payment - interest;
    if (principal > balance) principal = balance;
    balance -= principal;
    totalInterest += interest;
    yearInterest += interest;
    yearPrincipal += principal;
    months++;
    monthsInYear++;

    if (monthsInYear === 12 || balance <= 0.005) {
      schedule.push({
        year,
        principalPaid: yearPrincipal,
        interestPaid: yearInterest,
        balance: Math.max(0, balance),
      });
      year++;
      monthsInYear = 0;
      yearInterest = 0;
      yearPrincipal = 0;
    }
  }

  return {
    payoffMonths: months,
    totalInterest,
    totalPaid: startBalance + totalInterest,
    neverPaysOff: false,
    firstMonthInterest,
    schedule,
  };
}
