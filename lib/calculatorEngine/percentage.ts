/**
 * Percentage calculation engine — the four everyday percentage questions, each
 * returning a numeric answer plus step-by-step working. Pure, no UI coupling.
 *
 *  • "of"     — what is P% of X?            → (P/100) × X
 *  • "isOf"   — X is what percent of Y?     → (X/Y) × 100
 *  • "change" — percentage change X → Y?    → ((Y−X)/X) × 100
 *  • "adjust" — increase/decrease X by P%   → X × (1 ± P/100)
 */

export type PercentMode = "of" | "isOf" | "change" | "adjust";
export type Direction = "increase" | "decrease";

export interface PercentInput {
  mode: PercentMode;
  /** The percentage (used by "of" and "adjust"). */
  percent: number;
  /** The primary value X (used by every mode). */
  value: number;
  /** The reference total Y (used by "isOf" and "change"). */
  total: number;
  /** Direction for "adjust". */
  direction: Direction;
}

export interface PercentResult {
  value: number;
  /** Whether the result is itself a percentage (append "%" when displaying). */
  isPercent: boolean;
  /** Optional plain-language summary, e.g. "a 25% increase". */
  detail: string | null;
  steps: string[];
  error: string | null;
}

/** Trims a number to a readable form for step text (max 6 dp, no padding). */
function n(value: number): string {
  return String(Number(value.toFixed(6)));
}

export function calculatePercentage(input: PercentInput): PercentResult {
  const { percent, value, total, direction } = input;
  const base: PercentResult = {
    value: 0,
    isPercent: false,
    detail: null,
    steps: [],
    error: null,
  };

  switch (input.mode) {
    case "of": {
      const result = (percent / 100) * value;
      return {
        ...base,
        value: result,
        steps: [
          `${n(percent)}% of ${n(value)} = (${n(percent)} ÷ 100) × ${n(value)}`,
          `= ${n(percent / 100)} × ${n(value)}`,
          `= ${n(result)}`,
        ],
      };
    }

    case "isOf": {
      if (total === 0) return { ...base, error: "The total cannot be zero." };
      const result = (value / total) * 100;
      return {
        ...base,
        value: result,
        isPercent: true,
        steps: [
          `(${n(value)} ÷ ${n(total)}) × 100`,
          `= ${n(value / total)} × 100`,
          `= ${n(result)}%`,
        ],
      };
    }

    case "change": {
      if (value === 0) {
        return { ...base, error: "Percentage change from zero is undefined." };
      }
      const diff = total - value;
      const result = (diff / value) * 100;
      const dir = result >= 0 ? "increase" : "decrease";
      return {
        ...base,
        value: result,
        isPercent: true,
        detail: `a ${n(Math.abs(result))}% ${dir}`,
        steps: [
          `Difference = ${n(total)} − ${n(value)} = ${n(diff)}`,
          `Percentage change = (${n(diff)} ÷ ${n(value)}) × 100`,
          `= ${n(result)}%  (${dir} of ${n(Math.abs(result))}%)`,
        ],
      };
    }

    case "adjust": {
      const sign = direction === "increase" ? 1 : -1;
      const delta = (percent / 100) * value;
      const result = value + sign * delta;
      const word = direction === "increase" ? "increased" : "decreased";
      const op = direction === "increase" ? "+" : "−";
      return {
        ...base,
        value: result,
        detail: `${n(value)} ${word} by ${n(percent)}% = ${n(result)}`,
        steps: [
          `${n(percent)}% of ${n(value)} = ${n(delta)}`,
          `${n(value)} ${op} ${n(delta)} = ${n(result)}`,
        ],
      };
    }
  }
}
