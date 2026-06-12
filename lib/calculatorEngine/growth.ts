/**
 * Shared compound-growth simulator — pure functions. Models an initial balance
 * plus regular contributions growing at a periodic rate, with an optional
 * annual step-up to the contribution. Powers the compound interest, investment
 * and savings calculators so the growth loop lives in exactly one place.
 */

export interface GrowthYear {
  year: number;
  /** Total balance at year end. */
  balance: number;
  /** Cumulative money put in (initial + contributions). */
  contributions: number;
  /** Cumulative interest/returns earned. */
  interest: number;
}

export interface GrowthResult {
  finalBalance: number;
  totalContributions: number;
  totalInterest: number;
  /** Year-by-year growth, including year 0. */
  growth: GrowthYear[];
}

export interface GrowthInput {
  /** Starting balance. */
  initial: number;
  /** Base monthly contribution. */
  monthlyContribution: number;
  /** Annual rate of return/interest as a percentage, e.g. 8 for 8%. */
  annualRate: number;
  years: number;
  /** Compounding periods per year (1, 2, 4, 12, 365). Defaults to 12. */
  periodsPerYear?: number;
  /** Annual % increase applied to the monthly contribution each year. */
  annualContributionIncrease?: number;
}

export function simulateGrowth(input: GrowthInput): GrowthResult {
  const initial = Math.max(0, input.initial || 0);
  const annualRate = Math.max(0, input.annualRate || 0);
  const years = Math.max(0, Math.round(input.years || 0));
  const n = Math.max(1, Math.round(input.periodsPerYear || 12));
  const stepUp = Math.max(0, input.annualContributionIncrease || 0) / 100;

  const ratePerPeriod = annualRate / 100 / n;

  let balance = initial;
  let contributions = initial;
  let currentMonthly = Math.max(0, input.monthlyContribution || 0);

  const growth: GrowthYear[] = [
    { year: 0, balance, contributions, interest: 0 },
  ];

  for (let year = 1; year <= years; year++) {
    const contributionPerPeriod = (currentMonthly * 12) / n;
    for (let p = 0; p < n; p++) {
      balance += balance * ratePerPeriod; // growth for the period
      balance += contributionPerPeriod; // end-of-period contribution
      contributions += contributionPerPeriod;
    }
    growth.push({
      year,
      balance,
      contributions,
      interest: Math.max(0, balance - contributions),
    });
    currentMonthly *= 1 + stepUp; // raise next year's contribution
  }

  if (!Number.isFinite(balance)) balance = 0;

  return {
    finalBalance: balance,
    totalContributions: contributions,
    totalInterest: Math.max(0, balance - contributions),
    growth,
  };
}
