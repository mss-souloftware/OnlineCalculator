/**
 * BMR engine — Basal Metabolic Rate via the Mifflin-St Jeor equation (the
 * modern standard), plus Total Daily Energy Expenditure at each activity level.
 */

export type Gender = "male" | "female";

export interface BmrInput {
  weightKg: number;
  heightCm: number;
  age: number;
  gender: Gender;
}

export interface ActivityLevel {
  key: string;
  label: string;
  description: string;
  multiplier: number;
  /** Maintenance calories at this activity level (BMR × multiplier). */
  calories: number;
}

export interface BmrResult {
  bmr: number;
  activityLevels: ActivityLevel[];
}

export const ACTIVITY_LEVELS: Omit<ActivityLevel, "calories">[] = [
  { key: "sedentary", label: "Sedentary", description: "Little or no exercise", multiplier: 1.2 },
  { key: "light", label: "Lightly active", description: "Exercise 1–3 days/week", multiplier: 1.375 },
  { key: "moderate", label: "Moderately active", description: "Exercise 3–5 days/week", multiplier: 1.55 },
  { key: "active", label: "Very active", description: "Exercise 6–7 days/week", multiplier: 1.725 },
  { key: "athlete", label: "Extra active", description: "Hard exercise + physical job", multiplier: 1.9 },
];

export function calculateBmr(input: BmrInput): BmrResult {
  const weightKg = Math.max(0, input.weightKg || 0);
  const heightCm = Math.max(0, input.heightCm || 0);
  const age = Math.max(0, input.age || 0);

  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  const bmr = Math.max(0, input.gender === "male" ? base + 5 : base - 161);

  return {
    bmr,
    activityLevels: ACTIVITY_LEVELS.map((a) => ({
      ...a,
      calories: bmr * a.multiplier,
    })),
  };
}
