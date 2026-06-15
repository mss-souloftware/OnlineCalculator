/**
 * Ideal weight engine — the four classic clinical formulas (Robinson, Miller,
 * Devine, Hamwi), an average adjusted for frame size, and the BMI-healthy range.
 */
import type { Gender } from "./bmr";

export type { Gender } from "./bmr";

export type FrameSize = "small" | "medium" | "large";

export interface IdealWeightInput {
  gender: Gender;
  heightCm: number;
  frame: FrameSize;
}

export interface FormulaResult {
  name: string;
  weightKg: number;
}

export interface IdealWeightResult {
  formulas: FormulaResult[];
  averageKg: number;
  /** Average adjusted for frame size (small −10%, large +10%). */
  recommendedKg: number;
  healthyMinKg: number;
  healthyMaxKg: number;
}

export function calculateIdealWeight(
  input: IdealWeightInput,
): IdealWeightResult {
  const inchesOver5ft = Math.max(0, input.heightCm / 2.54 - 60);
  const male = input.gender === "male";

  const formulas: FormulaResult[] = [
    {
      name: "Robinson",
      weightKg: male ? 52 + 1.9 * inchesOver5ft : 49 + 1.7 * inchesOver5ft,
    },
    {
      name: "Miller",
      weightKg: male
        ? 56.2 + 1.41 * inchesOver5ft
        : 53.1 + 1.36 * inchesOver5ft,
    },
    {
      name: "Devine",
      weightKg: male ? 50 + 2.3 * inchesOver5ft : 45.5 + 2.3 * inchesOver5ft,
    },
    {
      name: "Hamwi",
      weightKg: male ? 48 + 2.7 * inchesOver5ft : 45.5 + 2.2 * inchesOver5ft,
    },
  ].map((f) => ({ ...f, weightKg: Math.max(0, f.weightKg) }));

  const averageKg =
    formulas.reduce((s, f) => s + f.weightKg, 0) / formulas.length;

  const frameMult =
    input.frame === "small" ? 0.9 : input.frame === "large" ? 1.1 : 1;
  const m = Math.max(0, input.heightCm || 0) / 100;

  return {
    formulas,
    averageKg,
    recommendedKg: averageKg * frameMult,
    healthyMinKg: 18.5 * m * m,
    healthyMaxKg: 24.9 * m * m,
  };
}
