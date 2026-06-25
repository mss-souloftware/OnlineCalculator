"use client";

import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

interface Option<T extends string> {
  value: T;
  label: string;
  icon?: string;
}

/** Segmented toggle (units, gender, etc.). Active segment uses the emerald gradient. */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  className,
}: {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel?: string;
  className?: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn(
        "inline-flex w-full rounded-lg border border-border bg-background p-1",
        className,
      )}
    >
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={cn(
              // min-w-0 lets the segments shrink below their text's intrinsic
              // width (text wraps) so many-/long-labelled controls don't overflow
              // narrow containers like a 300px embed column.
              "inline-flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-md px-2.5 py-2 text-center text-sm font-medium transition-colors",
              active
                ? "bg-gradient-to-t from-primary to-primary-to text-primary-foreground"
                : "text-muted hover:text-foreground",
            )}
          >
            {o.icon && <Icon name={o.icon} className="text-xs" />}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
