import { cn } from "@/lib/utils";

export interface DonutSegment {
  label: string;
  value: number;
  /** CSS color (e.g. "var(--primary)"). */
  color: string;
  /** Pre-formatted value for the legend. */
  display: string;
}

/**
 * Lightweight SVG donut (no chart library). Uses the r=15.915 trick so the
 * circumference is 100 and segment lengths map directly to percentages.
 */
export function DonutChart({
  segments,
  centerLabel,
  centerValue,
  className,
}: {
  segments: DonutSegment[];
  centerLabel?: string;
  centerValue?: string;
  className?: string;
}) {
  const total = segments.reduce((s, x) => s + Math.max(0, x.value), 0) || 1;
  let offset = 0;

  return (
    <div className={cn("flex flex-col items-center gap-5", className)}>
      <div className="relative h-44 w-44">
        <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
          <circle
            cx="18"
            cy="18"
            r="15.915"
            fill="none"
            stroke="var(--border)"
            strokeWidth="3.6"
          />
          {segments.map((s, i) => {
            const pct = (Math.max(0, s.value) / total) * 100;
            const circle = (
              <circle
                key={i}
                cx="18"
                cy="18"
                r="15.915"
                fill="none"
                stroke={s.color}
                strokeWidth="3.6"
                strokeDasharray={`${pct} ${100 - pct}`}
                strokeDashoffset={-offset}
              />
            );
            offset += pct;
            return circle;
          })}
        </svg>
        {(centerValue || centerLabel) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {centerLabel && (
              <span className="text-xs text-faint">{centerLabel}</span>
            )}
            {centerValue && (
              <span className="font-mono text-lg font-bold text-foreground">
                {centerValue}
              </span>
            )}
          </div>
        )}
      </div>

      <ul className="w-full space-y-2">
        {segments.map((s) => (
          <li key={s.label} className="flex items-center gap-2.5 text-sm">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ background: s.color }}
            />
            <span className="text-muted">{s.label}</span>
            <span className="ml-auto font-mono font-medium text-foreground">
              {s.display}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
