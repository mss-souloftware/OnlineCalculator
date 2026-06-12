"use client";

import { cn } from "@/lib/utils";

interface RangeFieldProps {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  /** Adornment shown before the number, e.g. "$". */
  prefix?: string;
  /** Adornment shown after the number, e.g. "%" or "yrs". */
  suffix?: string;
  hint?: string;
}

/**
 * Labeled numeric input paired with a native range slider (SOP: touch-friendly
 * sliders, real-time). The number field uses Roboto Mono per the brand, the
 * slider uses the emerald accent. Both are keyboard accessible.
 */
export function RangeField({
  id,
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  prefix,
  suffix,
  hint,
}: RangeFieldProps) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium text-foreground">
          {label}
        </label>
        <div className="flex items-center rounded-lg border border-border bg-background transition-colors focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/30">
          {prefix && (
            <span className="pl-3 font-mono text-sm text-faint">{prefix}</span>
          )}
          <input
            id={id}
            type="number"
            inputMode="decimal"
            value={Number.isFinite(value) ? value : ""}
            min={min}
            max={max}
            step={step}
            onChange={(e) => {
              const v = parseFloat(e.target.value);
              onChange(Number.isNaN(v) ? 0 : Math.max(0, v));
            }}
            className={cn(
              "w-28 bg-transparent py-2 text-right font-mono text-sm text-foreground focus:outline-none",
              prefix ? "pl-1.5" : "pl-3",
              suffix ? "pr-1.5" : "pr-3",
              "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
            )}
          />
          {suffix && (
            <span className="pr-3 font-mono text-sm text-faint">{suffix}</span>
          )}
        </div>
      </div>

      <input
        type="range"
        aria-label={label}
        min={min}
        max={max}
        step={step}
        value={Math.min(max, Math.max(min, Number.isFinite(value) ? value : min))}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="mt-3 w-full cursor-pointer accent-primary"
      />

      {hint && <p className="mt-1.5 text-xs text-faint">{hint}</p>}
    </div>
  );
}
