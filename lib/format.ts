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
