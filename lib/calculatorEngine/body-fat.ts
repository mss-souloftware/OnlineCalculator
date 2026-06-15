/**
 * Body fat engine — U.S. Navy circumference method (metric). Weight is used
 * only to split the result into fat mass and lean mass.
 */
import type { Gender } from "./bmr";

export type { Gender } from "./bmr";

export interface BodyFatInput {
  gender: Gender;
  heightCm: number;
  neckCm: number;
  waistCm: number;
  /** Hip circumference (women only). */
  hipCm: number;
  weightKg: number;
}

export interface BodyFatResult {
  bodyFatPercent: number;
  category: string;
  fatMassKg: number;
  leanMassKg: number;
}

/** ACE body-fat categories, which differ by sex. */
export function bodyFatCategory(bf: number, gender: Gender): string {
  const bands =
    gender === "male"
      ? [
          [6, "Essential fat"],
          [14, "Athletes"],
          [18, "Fitness"],
          [25, "Average"],
        ]
      : [
          [14, "Essential fat"],
          [21, "Athletes"],
          [25, "Fitness"],
          [32, "Average"],
        ];
  for (const [max, label] of bands) {
    if (bf < (max as number)) return label as string;
  }
  return "Obese";
}

export function calculateBodyFat(input: BodyFatInput): BodyFatResult {
  const { gender, heightCm, neckCm, waistCm, hipCm, weightKg } = input;
  let bf = 0;

  if (gender === "male") {
    const d = waistCm - neckCm;
    if (d > 0 && heightCm > 0) {
      bf =
        495 /
          (1.0324 -
            0.19077 * Math.log10(d) +
            0.15456 * Math.log10(heightCm)) -
        450;
    }
  } else {
    const d = waistCm + hipCm - neckCm;
    if (d > 0 && heightCm > 0) {
      bf =
        495 /
          (1.29579 -
            0.35004 * Math.log10(d) +
            0.221 * Math.log10(heightCm)) -
        450;
    }
  }

  bf = Math.max(0, Math.min(75, Number.isFinite(bf) ? bf : 0));
  const fatMassKg = (Math.max(0, weightKg || 0) * bf) / 100;
  const leanMassKg = Math.max(0, (weightKg || 0) - fatMassKg);

  return {
    bodyFatPercent: bf,
    category: bodyFatCategory(bf, gender),
    fatMassKg,
    leanMassKg,
  };
}
