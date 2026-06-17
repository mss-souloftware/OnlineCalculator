/**
 * Fraction calculation engine — exact integer arithmetic on two fractions, with
 * human-readable step-by-step working. Pure functions, zero UI coupling (SOP).
 *
 * Each operand is entered as a mixed number (whole + numerator/denominator);
 * the whole part carries the overall sign. Results are reduced to lowest terms
 * with the sign kept on the numerator, then expressed as an improper fraction,
 * a mixed number and a decimal.
 */

export type Operation = "add" | "subtract" | "multiply" | "divide";

export interface Fraction {
  numerator: number;
  denominator: number;
}

export interface MixedInput {
  whole: number;
  numerator: number;
  denominator: number;
}

export interface MixedParts {
  /** Whole part; carries the sign when non-zero. */
  whole: number;
  /** Proper numerator; carries the sign only when the whole part is zero. */
  numerator: number;
  denominator: number;
}

export interface FractionResult {
  /** Simplified improper fraction; sign carried on the numerator. */
  improper: Fraction;
  mixed: MixedParts;
  decimal: number;
  /** Human-readable working, one line per step. */
  steps: string[];
  error: string | null;
}

const OP_SYMBOL: Record<Operation, string> = {
  add: "+",
  subtract: "−",
  multiply: "×",
  divide: "÷",
};

export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a || 1;
}

function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b);
}

/** Renders a fraction as text, collapsing a unit denominator to a whole number. */
export function fractionText(f: Fraction): string {
  return f.denominator === 1 ? String(f.numerator) : `${f.numerator}/${f.denominator}`;
}

function mixedInputText(m: MixedInput): string {
  if (m.whole !== 0 && m.numerator !== 0) {
    return `${m.whole} ${Math.abs(m.numerator)}/${m.denominator}`;
  }
  if (m.whole !== 0) return String(m.whole);
  return `${m.numerator}/${m.denominator}`;
}

export function mixedPartsText(m: MixedParts): string {
  if (m.numerator === 0) return String(m.whole);
  if (m.whole === 0) return `${m.numerator}/${m.denominator}`;
  return `${m.whole} ${m.numerator}/${m.denominator}`;
}

/** Reduces a fraction to lowest terms, moving any sign onto the numerator. */
export function simplify(f: Fraction): Fraction {
  let { numerator, denominator } = f;
  if (denominator < 0) {
    numerator = -numerator;
    denominator = -denominator;
  }
  const g = gcd(numerator, denominator);
  return { numerator: numerator / g, denominator: denominator / g };
}

/** Combines a mixed-number input into one improper fraction (denominator > 0). */
export function toImproper(m: MixedInput): Fraction {
  const denominator = Math.abs(m.denominator);
  const sign = m.denominator < 0 ? -1 : 1;
  if (m.whole !== 0) {
    const wholeSign = m.whole < 0 ? -1 : 1;
    return {
      numerator:
        sign * wholeSign * (Math.abs(m.whole) * denominator + Math.abs(m.numerator)),
      denominator,
    };
  }
  return { numerator: sign * m.numerator, denominator };
}

/** Splits a fraction into whole + proper-fraction parts for display. */
export function toMixedParts(f: Fraction): MixedParts {
  const sign = f.numerator < 0 ? -1 : 1;
  const absNum = Math.abs(f.numerator);
  const whole = Math.floor(absNum / f.denominator);
  const remainder = absNum % f.denominator;
  if (whole === 0) {
    return { whole: 0, numerator: remainder * sign, denominator: f.denominator };
  }
  return { whole: whole * sign, numerator: remainder, denominator: f.denominator };
}

/**
 * Applies `op` to two mixed-number inputs and returns the simplified result
 * plus the working. Guards against zero denominators and division by zero.
 */
export function calculateFraction(
  aInput: MixedInput,
  bInput: MixedInput,
  op: Operation,
): FractionResult {
  const blank: FractionResult = {
    improper: { numerator: 0, denominator: 1 },
    mixed: { whole: 0, numerator: 0, denominator: 1 },
    decimal: 0,
    steps: [],
    error: null,
  };

  if (aInput.denominator === 0 || bInput.denominator === 0) {
    return { ...blank, error: "A denominator cannot be zero." };
  }

  const a = toImproper(aInput);
  const b = toImproper(bInput);
  const steps: string[] = [];

  // Show the improper-fraction conversion only when a whole part was entered.
  const conversions: string[] = [];
  if (aInput.whole !== 0) {
    conversions.push(`${mixedInputText(aInput)} = ${fractionText(a)}`);
  }
  if (bInput.whole !== 0) {
    conversions.push(`${mixedInputText(bInput)} = ${fractionText(b)}`);
  }
  if (conversions.length) {
    steps.push(`Convert to improper fractions:  ${conversions.join(",   ")}`);
  }

  let combined: Fraction;

  if (op === "add" || op === "subtract") {
    const common = lcm(a.denominator, b.denominator);
    const an = a.numerator * (common / a.denominator);
    const bn = b.numerator * (common / b.denominator);
    steps.push(
      `Rewrite over the common denominator ${common}:  ` +
        `${fractionText(a)} = ${an}/${common},   ${fractionText(b)} = ${bn}/${common}`,
    );
    const numerator = op === "add" ? an + bn : an - bn;
    steps.push(
      `${op === "add" ? "Add" : "Subtract"} the numerators:  ` +
        `${an}/${common} ${OP_SYMBOL[op]} ${bn}/${common} = ${numerator}/${common}`,
    );
    combined = { numerator, denominator: common };
  } else if (op === "multiply") {
    combined = {
      numerator: a.numerator * b.numerator,
      denominator: a.denominator * b.denominator,
    };
    steps.push(
      `Multiply the numerators and denominators:  ` +
        `${fractionText(a)} × ${fractionText(b)} = ` +
        `${combined.numerator}/${combined.denominator}`,
    );
  } else {
    if (b.numerator === 0) return { ...blank, error: "Cannot divide by zero." };
    steps.push(
      `Multiply by the reciprocal:  ${fractionText(a)} ÷ ${fractionText(b)} = ` +
        `${fractionText(a)} × ${b.denominator}/${b.numerator}`,
    );
    combined = {
      numerator: a.numerator * b.denominator,
      denominator: a.denominator * b.numerator,
    };
    if (combined.denominator < 0) {
      combined = { numerator: -combined.numerator, denominator: -combined.denominator };
    }
    steps.push(`= ${fractionText(combined)}`);
  }

  const simplified = simplify(combined);
  if (
    simplified.numerator !== combined.numerator ||
    simplified.denominator !== combined.denominator
  ) {
    steps.push(`Simplify:  ${fractionText(combined)} = ${fractionText(simplified)}`);
  }

  const mixed = toMixedParts(simplified);
  if (mixed.whole !== 0 && mixed.numerator !== 0) {
    steps.push(
      `As a mixed number:  ${fractionText(simplified)} = ${mixedPartsText(mixed)}`,
    );
  }

  return {
    improper: simplified,
    mixed,
    decimal: simplified.numerator / simplified.denominator,
    steps,
    error: null,
  };
}
