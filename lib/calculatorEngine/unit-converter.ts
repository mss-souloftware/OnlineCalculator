/**
 * Unit converter engine — multi-category conversions via a base unit per
 * category. Pure functions, no UI coupling (SOP).
 *
 * Linear categories store each unit's `toBase` factor (value × toBase = value
 * in base units), so converting is value × from.toBase ÷ to.toBase. Temperature
 * is affine (it has an offset), so it's converted through Celsius separately.
 */
import { KG_PER_LB, CM_PER_IN } from "./units";

// Length constants derived from the shared inch definition (metres).
const M_PER_IN = CM_PER_IN / 100; // 0.0254
const M_PER_FT = M_PER_IN * 12; // 0.3048
const M_PER_YD = M_PER_FT * 3; // 0.9144
const M_PER_MI = M_PER_YD * 1760; // 1609.344

export interface Unit {
  id: string;
  name: string;
  symbol: string;
  /** value × toBase = value in the category's base unit. */
  toBase: number;
}

export interface UnitCategory {
  id: string;
  name: string;
  icon: string;
  /** Temperature is affine, so it bypasses the toBase factor. */
  kind: "linear" | "temperature";
  units: Unit[];
}

export const CATEGORIES: UnitCategory[] = [
  {
    id: "length",
    name: "Length",
    icon: "fa-ruler",
    kind: "linear",
    units: [
      { id: "mm", name: "Millimetre", symbol: "mm", toBase: 0.001 },
      { id: "cm", name: "Centimetre", symbol: "cm", toBase: 0.01 },
      { id: "m", name: "Metre", symbol: "m", toBase: 1 },
      { id: "km", name: "Kilometre", symbol: "km", toBase: 1000 },
      { id: "in", name: "Inch", symbol: "in", toBase: M_PER_IN },
      { id: "ft", name: "Foot", symbol: "ft", toBase: M_PER_FT },
      { id: "yd", name: "Yard", symbol: "yd", toBase: M_PER_YD },
      { id: "mi", name: "Mile", symbol: "mi", toBase: M_PER_MI },
      { id: "nmi", name: "Nautical mile", symbol: "nmi", toBase: 1852 },
    ],
  },
  {
    id: "mass",
    name: "Weight / Mass",
    icon: "fa-weight-hanging",
    kind: "linear",
    units: [
      { id: "mg", name: "Milligram", symbol: "mg", toBase: 1e-6 },
      { id: "g", name: "Gram", symbol: "g", toBase: 0.001 },
      { id: "kg", name: "Kilogram", symbol: "kg", toBase: 1 },
      { id: "t", name: "Tonne", symbol: "t", toBase: 1000 },
      { id: "oz", name: "Ounce", symbol: "oz", toBase: KG_PER_LB / 16 },
      { id: "lb", name: "Pound", symbol: "lb", toBase: KG_PER_LB },
      { id: "st", name: "Stone", symbol: "st", toBase: KG_PER_LB * 14 },
    ],
  },
  {
    id: "temperature",
    name: "Temperature",
    icon: "fa-temperature-half",
    kind: "temperature",
    units: [
      { id: "C", name: "Celsius", symbol: "°C", toBase: 1 },
      { id: "F", name: "Fahrenheit", symbol: "°F", toBase: 1 },
      { id: "K", name: "Kelvin", symbol: "K", toBase: 1 },
    ],
  },
  {
    id: "area",
    name: "Area",
    icon: "fa-vector-square",
    kind: "linear",
    units: [
      { id: "cm2", name: "Square centimetre", symbol: "cm²", toBase: 0.0001 },
      { id: "m2", name: "Square metre", symbol: "m²", toBase: 1 },
      { id: "ha", name: "Hectare", symbol: "ha", toBase: 10000 },
      { id: "km2", name: "Square kilometre", symbol: "km²", toBase: 1e6 },
      { id: "in2", name: "Square inch", symbol: "in²", toBase: M_PER_IN ** 2 },
      { id: "ft2", name: "Square foot", symbol: "ft²", toBase: M_PER_FT ** 2 },
      { id: "yd2", name: "Square yard", symbol: "yd²", toBase: M_PER_YD ** 2 },
      { id: "ac", name: "Acre", symbol: "ac", toBase: 4046.8564224 },
      { id: "mi2", name: "Square mile", symbol: "mi²", toBase: M_PER_MI ** 2 },
    ],
  },
  {
    id: "volume",
    name: "Volume",
    icon: "fa-flask",
    kind: "linear",
    units: [
      { id: "mL", name: "Millilitre", symbol: "mL", toBase: 0.001 },
      { id: "L", name: "Litre", symbol: "L", toBase: 1 },
      { id: "m3", name: "Cubic metre", symbol: "m³", toBase: 1000 },
      { id: "tsp", name: "Teaspoon (US)", symbol: "tsp", toBase: 0.00492892159375 },
      { id: "tbsp", name: "Tablespoon (US)", symbol: "tbsp", toBase: 0.01478676478125 },
      { id: "floz", name: "Fluid ounce (US)", symbol: "fl oz", toBase: 0.0295735295625 },
      { id: "cup", name: "Cup (US)", symbol: "cup", toBase: 0.2365882365 },
      { id: "pt", name: "Pint (US)", symbol: "pt", toBase: 0.473176473 },
      { id: "qt", name: "Quart (US)", symbol: "qt", toBase: 0.946352946 },
      { id: "gal", name: "Gallon (US)", symbol: "gal", toBase: 3.785411784 },
      { id: "igal", name: "Gallon (UK)", symbol: "gal (UK)", toBase: 4.54609 },
    ],
  },
  {
    id: "speed",
    name: "Speed",
    icon: "fa-gauge-high",
    kind: "linear",
    units: [
      { id: "mps", name: "Metre / second", symbol: "m/s", toBase: 1 },
      { id: "kmh", name: "Kilometre / hour", symbol: "km/h", toBase: 1000 / 3600 },
      { id: "mph", name: "Mile / hour", symbol: "mph", toBase: M_PER_MI / 3600 },
      { id: "fps", name: "Foot / second", symbol: "ft/s", toBase: M_PER_FT },
      { id: "kn", name: "Knot", symbol: "kn", toBase: 1852 / 3600 },
    ],
  },
  {
    id: "time",
    name: "Time",
    icon: "fa-clock",
    kind: "linear",
    units: [
      { id: "ms", name: "Millisecond", symbol: "ms", toBase: 0.001 },
      { id: "s", name: "Second", symbol: "s", toBase: 1 },
      { id: "min", name: "Minute", symbol: "min", toBase: 60 },
      { id: "h", name: "Hour", symbol: "h", toBase: 3600 },
      { id: "d", name: "Day", symbol: "d", toBase: 86400 },
      { id: "wk", name: "Week", symbol: "wk", toBase: 604800 },
      { id: "mo", name: "Month (30.44 d)", symbol: "mo", toBase: 2629800 },
      { id: "yr", name: "Year (365.25 d)", symbol: "yr", toBase: 31557600 },
    ],
  },
  {
    id: "data",
    name: "Digital storage",
    icon: "fa-database",
    kind: "linear",
    units: [
      { id: "bit", name: "Bit", symbol: "bit", toBase: 0.125 },
      { id: "B", name: "Byte", symbol: "B", toBase: 1 },
      { id: "KB", name: "Kilobyte", symbol: "KB", toBase: 1e3 },
      { id: "MB", name: "Megabyte", symbol: "MB", toBase: 1e6 },
      { id: "GB", name: "Gigabyte", symbol: "GB", toBase: 1e9 },
      { id: "TB", name: "Terabyte", symbol: "TB", toBase: 1e12 },
      { id: "KiB", name: "Kibibyte", symbol: "KiB", toBase: 1024 },
      { id: "MiB", name: "Mebibyte", symbol: "MiB", toBase: 1024 ** 2 },
      { id: "GiB", name: "Gibibyte", symbol: "GiB", toBase: 1024 ** 3 },
    ],
  },
];

export function getCategory(id: string): UnitCategory | undefined {
  return CATEGORIES.find((c) => c.id === id);
}

export function getUnit(category: UnitCategory, id: string): Unit | undefined {
  return category.units.find((u) => u.id === id);
}

/** Converts a temperature between Celsius, Fahrenheit and Kelvin. */
function convertTemperature(value: number, fromId: string, toId: string): number {
  // Step 1: to Celsius.
  let celsius: number;
  switch (fromId) {
    case "F":
      celsius = ((value - 32) * 5) / 9;
      break;
    case "K":
      celsius = value - 273.15;
      break;
    default:
      celsius = value;
  }
  // Step 2: Celsius to the target.
  switch (toId) {
    case "F":
      return (celsius * 9) / 5 + 32;
    case "K":
      return celsius + 273.15;
    default:
      return celsius;
  }
}

/**
 * Converts `value` from one unit to another within a category. Returns NaN if
 * the category or units are unknown.
 */
export function convert(
  categoryId: string,
  value: number,
  fromId: string,
  toId: string,
): number {
  const category = getCategory(categoryId);
  if (!category) return NaN;
  if (category.kind === "temperature") {
    return convertTemperature(value, fromId, toId);
  }
  const from = getUnit(category, fromId);
  const to = getUnit(category, toId);
  if (!from || !to) return NaN;
  return (value * from.toBase) / to.toBase;
}
