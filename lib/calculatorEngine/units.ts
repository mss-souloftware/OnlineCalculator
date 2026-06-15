/** Unit conversions for health calculators. Pure functions. */

export const KG_PER_LB = 0.45359237;
export const CM_PER_IN = 2.54;

export type UnitSystem = "metric" | "imperial";

export const lbToKg = (lb: number) => lb * KG_PER_LB;
export const kgToLb = (kg: number) => kg / KG_PER_LB;
export const inToCm = (inch: number) => inch * CM_PER_IN;
export const cmToIn = (cm: number) => cm / CM_PER_IN;
export const ftInToCm = (ft: number, inch: number) => inToCm(ft * 12 + inch);

/** Format a centimetre height as feet/inches, e.g. 175 → 5′ 9″. */
export function formatFtIn(cm: number): string {
  const totalIn = Math.round(cm / CM_PER_IN);
  const ft = Math.floor(totalIn / 12);
  const inch = totalIn % 12;
  return `${ft}′ ${inch}″`;
}
