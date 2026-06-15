/**
 * Calorie engine — BMR (Mifflin-St Jeor) × activity = maintenance (TDEE),
 * then a goal adjustment gives a daily target, split into macronutrients.
 */
import { calculateBmr, type BmrInput } from "./bmr";

export interface CalorieGoal {
  key: string;
  label: string;
  /** Daily calorie delta from maintenance. */
  delta: number;
}

export const GOALS: CalorieGoal[] = [
  { key: "lose1", label: "Lose 1 kg / 2 lb a week", delta: -1000 },
  { key: "lose05", label: "Lose 0.5 kg / 1 lb a week", delta: -500 },
  { key: "lose025", label: "Lose 0.25 kg / 0.5 lb a week", delta: -250 },
  { key: "maintain", label: "Maintain weight", delta: 0 },
  { key: "gain025", label: "Gain 0.25 kg / 0.5 lb a week", delta: 250 },
  { key: "gain05", label: "Gain 0.5 kg / 1 lb a week", delta: 500 },
];

export type MacroSplit = "balanced" | "lowcarb" | "highprotein";

export const MACRO_SPLITS: Record<
  MacroSplit,
  { label: string; protein: number; carbs: number; fat: number }
> = {
  balanced: { label: "Balanced", protein: 30, carbs: 40, fat: 30 },
  lowcarb: { label: "Low-carb", protein: 40, carbs: 20, fat: 40 },
  highprotein: { label: "High-protein", protein: 40, carbs: 35, fat: 25 },
};

export interface CalorieInput extends BmrInput {
  activityKey: string;
  goalKey: string;
  macroSplit: MacroSplit;
}

export interface MacroBreakdown {
  /** Grams per day. */
  protein: number;
  carbs: number;
  fat: number;
}

export interface CalorieResult {
  bmr: number;
  maintenance: number;
  target: number;
  goalDelta: number;
  /** Macronutrient grams per day. */
  grams: MacroBreakdown;
  /** Macronutrient calories per day. */
  calories: MacroBreakdown;
}

const CAL_PER_GRAM = { protein: 4, carbs: 4, fat: 9 };

export function calculateCalories(input: CalorieInput): CalorieResult {
  const bmrResult = calculateBmr(input);
  const activity =
    bmrResult.activityLevels.find((a) => a.key === input.activityKey) ??
    bmrResult.activityLevels[2];
  const maintenance = activity.calories;

  const goal =
    GOALS.find((g) => g.key === input.goalKey) ??
    GOALS.find((g) => g.key === "maintain")!;
  const target = Math.max(0, maintenance + goal.delta);

  const split = MACRO_SPLITS[input.macroSplit];
  const calories: MacroBreakdown = {
    protein: (target * split.protein) / 100,
    carbs: (target * split.carbs) / 100,
    fat: (target * split.fat) / 100,
  };

  return {
    bmr: bmrResult.bmr,
    maintenance,
    target,
    goalDelta: goal.delta,
    calories,
    grams: {
      protein: calories.protein / CAL_PER_GRAM.protein,
      carbs: calories.carbs / CAL_PER_GRAM.carbs,
      fat: calories.fat / CAL_PER_GRAM.fat,
    },
  };
}
