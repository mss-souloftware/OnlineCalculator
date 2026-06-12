"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/format";

export interface StackedBarDatum {
  year: number;
  /** Bottom segment (emerald). */
  lower: number;
  /** Top segment (faint). */
  upper: number;
  /** Total shown in the tooltip's footer row. */
  total: number;
}

/**
 * Two-segment stacked bars per year with a hover/focus tooltip. Bars are scaled
 * to the largest total, so it reads as flat (loan amortization) or rising
 * (compound growth) depending on the data. Custom — no chart library.
 */
export function StackedBarChart({
  data,
  lowerLabel,
  upperLabel,
  totalLabel = "Total",
  className,
}: {
  data: StackedBarDatum[];
  lowerLabel: string;
  upperLabel: string;
  totalLabel?: string;
  className?: string;
}) {
  const [active, setActive] = useState<number | null>(null);
  const n = data.length;
  if (!n) return null;

  const maxTotal = Math.max(...data.map((d) => d.lower + d.upper), 1);

  const labelCount = Math.min(6, n);
  const labelIdx = Array.from({ length: labelCount }, (_, i) =>
    Math.round((i / Math.max(1, labelCount - 1)) * (n - 1)),
  );

  return (
    <div className={className}>
      <div className="mb-4 flex items-center gap-5 text-xs">
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm bg-primary" />
          <span className="text-muted">{lowerLabel}</span>
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm bg-faint/50" />
          <span className="text-muted">{upperLabel}</span>
        </span>
      </div>

      <div className="relative">
        {active !== null && (
          <div
            className="pointer-events-none absolute -top-2 z-10 w-44 -translate-x-1/2 -translate-y-full rounded-lg border border-border bg-card p-3 text-xs shadow-xl shadow-black/30"
            style={{ left: `${((active + 0.5) / n) * 100}%` }}
          >
            <div className="font-mono font-semibold text-foreground">
              Year {data[active].year}
            </div>
            <div className="mt-2 flex items-center gap-2 text-muted">
              <span className="h-2 w-2 rounded-sm bg-primary" />
              {lowerLabel}
              <span className="ml-auto font-mono text-foreground">
                {formatCurrency(data[active].lower)}
              </span>
            </div>
            <div className="mt-1 flex items-center gap-2 text-muted">
              <span className="h-2 w-2 rounded-sm bg-faint/50" />
              {upperLabel}
              <span className="ml-auto font-mono text-foreground">
                {formatCurrency(data[active].upper)}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between border-t border-border pt-1.5 text-muted">
              {totalLabel}
              <span className="font-mono text-foreground">
                {formatCurrency(data[active].total)}
              </span>
            </div>
          </div>
        )}

        <div
          className="flex h-56 items-end gap-px"
          onMouseLeave={() => setActive(null)}
        >
          {data.map((d, i) => {
            const lowerPct = (d.lower / maxTotal) * 100;
            const upperPct = (d.upper / maxTotal) * 100;
            const isActive = active === i;
            return (
              <button
                key={d.year}
                type="button"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                aria-label={`Year ${d.year}: ${lowerLabel} ${formatCurrency(
                  d.lower,
                )}, ${upperLabel} ${formatCurrency(d.upper)}`}
                className="flex h-full flex-1 flex-col justify-end outline-none"
              >
                <div
                  style={{ height: `${upperPct}%` }}
                  className={cn(
                    "w-full rounded-t-sm transition-colors",
                    isActive ? "bg-faint/80" : "bg-faint/45",
                  )}
                />
                <div
                  style={{ height: `${lowerPct}%` }}
                  className={cn(
                    "w-full transition-colors",
                    isActive ? "bg-primary" : "bg-primary/80",
                  )}
                />
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-2 flex justify-between font-mono text-[10px] text-faint">
        {labelIdx.map((i) => (
          <span key={i}>Yr {data[i].year}</span>
        ))}
      </div>
    </div>
  );
}
