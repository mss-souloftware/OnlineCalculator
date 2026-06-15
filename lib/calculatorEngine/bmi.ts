/**
 * BMI engine — Body Mass Index for adults: weight(kg) / height(m)². Age and
 * gender don't change the adult formula, so they're intentionally omitted.
 */

export type BmiCategory =
  | "Underweight"
  | "Normal weight"
  | "Overweight"
  | "Obese";

export interface BmiResult {
  bmi: number;
  category: BmiCategory;
  /** Healthy weight range (kg) for this height, BMI 18.5–24.9. */
  healthyMinKg: number;
  healthyMaxKg: number;
}

export function bmiCategory(bmi: number): BmiCategory {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal weight";
  if (bmi < 30) return "Overweight";
  return "Obese";
}

export function calculateBmi(weightKg: number, heightCm: number): BmiResult {
  const w = Math.max(0, weightKg || 0);
  const m = Math.max(0, heightCm || 0) / 100;
  const bmi = m > 0 ? w / (m * m) : 0;
  return {
    bmi,
    category: bmiCategory(bmi),
    healthyMinKg: 18.5 * m * m,
    healthyMaxKg: 24.9 * m * m,
  };
}
