/**
 * Date calculation engine — duration between two dates, and adding/subtracting
 * an interval from a date. Pure functions, no UI coupling (SOP).
 *
 * As with the age engine, all maths runs on date parts in UTC to avoid timezone
 * and DST drift, and the months breakdown uses a clamping month-anchor so it
 * stays correct across uneven month lengths and leap years.
 */

const DAY_MS = 86_400_000;
const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export interface DateParts {
  year: number;
  /** 1–12. */
  month: number;
  day: number;
}

export interface DurationResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalWeeks: number;
  remainderDays: number;
  /** Whole weekdays (Mon–Fri) elapsed between the two dates. */
  businessDays: number;
  /** Whether the second date is after, before, or the same as the first. */
  direction: "after" | "before" | "same";
  error: string | null;
}

export interface AddResult {
  year: number;
  month: number;
  day: number;
  weekday: string;
  error: string | null;
}

function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

function isValidDate(p: DateParts): boolean {
  if (![p.year, p.month, p.day].every(Number.isInteger)) return false;
  if (p.month < 1 || p.month > 12 || p.day < 1) return false;
  return p.day <= daysInMonth(p.year, p.month);
}

const toMs = (p: DateParts) => Date.UTC(p.year, p.month - 1, p.day);

function partsFromMs(ms: number): DateParts {
  const d = new Date(ms);
  return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate() };
}

/** Adds `n` whole months to a date, clamping the day to the new month length. */
function addMonths(p: DateParts, n: number): DateParts {
  const total = p.year * 12 + (p.month - 1) + n;
  const year = Math.floor(total / 12);
  const month = (total % 12) + 1;
  return { year, month, day: Math.min(p.day, daysInMonth(year, month)) };
}

export function weekdayOf(p: DateParts): string {
  return WEEKDAYS[new Date(toMs(p)).getUTCDay()];
}

/** Counts Mon–Fri days elapsed in (startMs, endMs], computed in O(7). */
function businessDaysBetween(startMs: number, endMs: number): number {
  const totalDays = Math.round((endMs - startMs) / DAY_MS);
  const fullWeeks = Math.floor(totalDays / 7);
  let count = fullWeeks * 5;
  const remaining = totalDays - fullWeeks * 7;
  let cursor = startMs;
  for (let i = 0; i < remaining; i++) {
    cursor += DAY_MS;
    const dow = new Date(cursor).getUTCDay();
    if (dow !== 0 && dow !== 6) count++;
  }
  return count;
}

/** The calendar duration between two dates, order-independent. */
export function calculateDuration(from: DateParts, to: DateParts): DurationResult {
  const blank: DurationResult = {
    years: 0,
    months: 0,
    days: 0,
    totalDays: 0,
    totalWeeks: 0,
    remainderDays: 0,
    businessDays: 0,
    direction: "same",
    error: null,
  };

  if (!isValidDate(from) || !isValidDate(to)) {
    return { ...blank, error: "Please enter two valid dates." };
  }

  const fromMs = toMs(from);
  const toMsValue = toMs(to);
  const direction =
    toMsValue > fromMs ? "after" : toMsValue < fromMs ? "before" : "same";

  // Measure from the earlier date to the later one so the breakdown is positive.
  const start = fromMs <= toMsValue ? from : to;
  const end = fromMs <= toMsValue ? to : from;
  const startMs = toMs(start);
  const endMs = toMs(end);

  let totalMonths = (end.year - start.year) * 12 + (end.month - start.month);
  if (toMs(addMonths(start, totalMonths)) > endMs) totalMonths -= 1;
  const anchor = addMonths(start, totalMonths);

  const totalDays = Math.round((endMs - startMs) / DAY_MS);

  return {
    years: Math.floor(totalMonths / 12),
    months: totalMonths % 12,
    days: Math.round((endMs - toMs(anchor)) / DAY_MS),
    totalDays,
    totalWeeks: Math.floor(totalDays / 7),
    remainderDays: totalDays % 7,
    businessDays: businessDaysBetween(startMs, endMs),
    direction,
    error: null,
  };
}

export interface Interval {
  years: number;
  months: number;
  weeks: number;
  days: number;
}

/** Adds or subtracts an interval from a date (months clamp, then days shift). */
export function addToDate(
  base: DateParts,
  op: "add" | "subtract",
  interval: Interval,
): AddResult {
  const blank: AddResult = { year: 0, month: 0, day: 0, weekday: "", error: null };
  if (!isValidDate(base)) return { ...blank, error: "Please enter a valid date." };

  const sign = op === "add" ? 1 : -1;
  const afterMonths = addMonths(base, sign * (interval.years * 12 + interval.months));
  const ms = toMs(afterMonths) + sign * (interval.weeks * 7 + interval.days) * DAY_MS;
  const parts = partsFromMs(ms);

  return { ...parts, weekday: WEEKDAYS[new Date(ms).getUTCDay()], error: null };
}
