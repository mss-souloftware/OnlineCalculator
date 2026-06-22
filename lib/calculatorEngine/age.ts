/**
 * Age calculation engine — exact calendar age (years, months, days) plus totals
 * and next-birthday info. Pure functions, no UI coupling (SOP).
 *
 * All arithmetic is done on date *parts* in UTC to avoid timezone/DST drift.
 * The year/month/day breakdown uses a clamping month-anchor method (add whole
 * months to the birth date, clamping to the month's length) which stays correct
 * for awkward cases like a 31st-of-the-month birth or a 29 Feb leap birthday —
 * the naive "subtract and borrow" approach can yield negative days for those.
 */

const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const DAY_MS = 86_400_000;

export interface DateParts {
  year: number;
  /** 1–12. */
  month: number;
  day: number;
}

export interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalMonths: number;
  totalWeeks: number;
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
  bornOnWeekday: string;
  nextBirthdayInDays: number;
  nextBirthdayWeekday: string;
  /** The age the person reaches on that next birthday. */
  turningAge: number;
  error: string | null;
}

function daysInMonth(year: number, month: number): number {
  // Day 0 of the next month is the last day of `month`.
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

function isValidDate(p: DateParts): boolean {
  if (![p.year, p.month, p.day].every(Number.isInteger)) return false;
  if (p.month < 1 || p.month > 12 || p.day < 1) return false;
  return p.day <= daysInMonth(p.year, p.month);
}

const toMs = (p: DateParts) => Date.UTC(p.year, p.month - 1, p.day);

/** Adds `n` whole months to a date, clamping the day to the new month length. */
function addMonths(p: DateParts, n: number): DateParts {
  const total = p.year * 12 + (p.month - 1) + n;
  const year = Math.floor(total / 12);
  const month = (total % 12) + 1;
  return { year, month, day: Math.min(p.day, daysInMonth(year, month)) };
}

export function calculateAge(birth: DateParts, asOf: DateParts): AgeResult {
  const blank: AgeResult = {
    years: 0,
    months: 0,
    days: 0,
    totalMonths: 0,
    totalWeeks: 0,
    totalDays: 0,
    totalHours: 0,
    totalMinutes: 0,
    bornOnWeekday: "",
    nextBirthdayInDays: 0,
    nextBirthdayWeekday: "",
    turningAge: 0,
    error: null,
  };

  if (!isValidDate(birth)) {
    return { ...blank, error: "Please enter a valid date of birth." };
  }
  if (!isValidDate(asOf)) {
    return { ...blank, error: "Please enter a valid comparison date." };
  }

  const birthMs = toMs(birth);
  const asOfMs = toMs(asOf);
  if (birthMs > asOfMs) {
    return { ...blank, error: "Date of birth can't be after the comparison date." };
  }

  // Completed whole months between the dates, via the clamping anchor.
  let totalMonths =
    (asOf.year - birth.year) * 12 + (asOf.month - birth.month);
  if (toMs(addMonths(birth, totalMonths)) > asOfMs) totalMonths -= 1;
  const anchor = addMonths(birth, totalMonths);

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  const days = Math.floor((asOfMs - toMs(anchor)) / DAY_MS);

  const totalDays = Math.floor((asOfMs - birthMs) / DAY_MS);
  const totalWeeks = Math.floor(totalDays / 7);
  const totalHours = totalDays * 24;
  const totalMinutes = totalHours * 60;

  // Next birthday on or after the comparison date (29 Feb clamps to the 28th).
  const birthdayInYear = (year: number) =>
    Date.UTC(year, birth.month - 1, Math.min(birth.day, daysInMonth(year, birth.month)));
  let nbYear = asOf.year;
  if (birthdayInYear(nbYear) < asOfMs) nbYear += 1;
  const nbMs = birthdayInYear(nbYear);

  return {
    years,
    months,
    days,
    totalMonths,
    totalWeeks,
    totalDays,
    totalHours,
    totalMinutes,
    bornOnWeekday: WEEKDAYS[new Date(birthMs).getUTCDay()],
    nextBirthdayInDays: Math.round((nbMs - asOfMs) / DAY_MS),
    nextBirthdayWeekday: WEEKDAYS[new Date(nbMs).getUTCDay()],
    turningAge: nbYear - birth.year,
    error: null,
  };
}
