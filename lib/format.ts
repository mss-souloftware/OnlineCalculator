/** Shared number formatting (used across calculators and charts). */

const EM_DASH = "—";

export function formatCurrency(
  value: number,
  { decimals = 0 }: { decimals?: number } = {},
): string {
  if (!Number.isFinite(value)) return EM_DASH;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatNumber(value: number, decimals = 0): string {
  if (!Number.isFinite(value)) return EM_DASH;
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatPercent(value: number, decimals = 2): string {
  if (!Number.isFinite(value)) return EM_DASH;
  return `${formatNumber(value, decimals)}%`;
}

/** Human duration from a month count, e.g. "4 yrs 2 mos", "8 months". */
export function formatDuration(totalMonths: number): string {
  if (!Number.isFinite(totalMonths)) return "Never";
  const months = Math.max(0, Math.round(totalMonths));
  const y = Math.floor(months / 12);
  const m = months % 12;
  if (y === 0) return `${m} ${m === 1 ? "month" : "months"}`;
  if (m === 0) return `${y} ${y === 1 ? "year" : "years"}`;
  return `${y} ${y === 1 ? "yr" : "yrs"} ${m} ${m === 1 ? "mo" : "mos"}`;
}

/** Compact currency for tight spaces, e.g. chart axes ("$1.2M", "$450K"). */
export function formatCompactCurrency(value: number): string {
  if (!Number.isFinite(value)) return EM_DASH;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}
