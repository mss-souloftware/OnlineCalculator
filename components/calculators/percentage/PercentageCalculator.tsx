"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  calculatePercentage,
  type Direction,
  type PercentMode,
} from "@/lib/calculatorEngine/percentage";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Inputs {
  mode: PercentMode;
  percent: number;
  value: number;
  total: number;
  direction: Direction;
}

const DEFAULTS: Inputs = {
  mode: "of",
  percent: 15,
  value: 200,
  total: 50,
  direction: "increase",
};

const MODES: { value: PercentMode; label: string }[] = [
  { value: "of", label: "Percent of" },
  { value: "isOf", label: "Is what %" },
  { value: "change", label: "Change" },
  { value: "adjust", label: "Adjust" },
];

const MODE_HINT: Record<PercentMode, string> = {
  of: "Find a percentage of a number.",
  isOf: "Express one number as a percentage of another.",
  change: "Measure the percentage increase or decrease between two numbers.",
  adjust: "Increase or decrease a number by a percentage.",
};

function readParams(): Inputs {
  const p = new URLSearchParams(window.location.search);
  const next = { ...DEFAULTS };
  const num = (key: string, fallback: number) => {
    const v = parseFloat(p.get(key) ?? "");
    return Number.isFinite(v) ? v : fallback;
  };
  const mode = p.get("mode");
  if (mode === "of" || mode === "isOf" || mode === "change" || mode === "adjust") {
    next.mode = mode;
  }
  next.percent = num("p", DEFAULTS.percent);
  next.value = num("x", DEFAULTS.value);
  next.total = num("y", DEFAULTS.total);
  const dir = p.get("dir");
  if (dir === "increase" || dir === "decrease") next.direction = dir;
  return next;
}

/** Grouped number, trimmed to at most 4 decimal places. */
function fmt(value: number, decimals = 4): string {
  if (!Number.isFinite(value)) return "—";
  return Number(value.toFixed(decimals)).toLocaleString("en-US", {
    maximumFractionDigits: decimals,
  });
}

export function PercentageCalculator() {
  const [inputs, setInputs] = useState<Inputs>(DEFAULTS);
  const [copied, setCopied] = useState(false);
  const hydrated = useRef(false);

  useEffect(() => {
    setInputs(readParams());
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    const p = new URLSearchParams({
      mode: inputs.mode,
      p: String(inputs.percent),
      x: String(inputs.value),
      y: String(inputs.total),
      dir: inputs.direction,
    });
    window.history.replaceState(null, "", `${window.location.pathname}?${p}`);
  }, [inputs]);

  const result = useMemo(() => calculatePercentage(inputs), [inputs]);

  const set = (field: keyof Inputs) => (value: number) =>
    setInputs((prev) => ({ ...prev, [field]: value }));

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — no-op */
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
      {/* Inputs */}
      <div className="lg:col-span-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display text-lg font-semibold text-foreground">
            What do you want to work out?
          </h2>

          <div className="mt-6">
            <SegmentedControl
              ariaLabel="Calculation type"
              options={MODES}
              value={inputs.mode}
              onChange={(mode) => setInputs((prev) => ({ ...prev, mode }))}
            />
            <p className="mt-3 text-sm text-muted">{MODE_HINT[inputs.mode]}</p>
          </div>

          {/* Natural-language question with inline inputs */}
          <div className="mt-7 flex flex-wrap items-center gap-x-2 gap-y-3 text-lg text-foreground">
            {inputs.mode === "of" && (
              <>
                <span>What is</span>
                <NumInput label="Percentage" value={inputs.percent} onChange={set("percent")} />
                <span>% of</span>
                <NumInput label="Value" value={inputs.value} onChange={set("value")} />
                <span>?</span>
              </>
            )}

            {inputs.mode === "isOf" && (
              <>
                <NumInput label="Value" value={inputs.value} onChange={set("value")} />
                <span>is what percent of</span>
                <NumInput label="Total" value={inputs.total} onChange={set("total")} />
                <span>?</span>
              </>
            )}

            {inputs.mode === "change" && (
              <>
                <span>From</span>
                <NumInput label="Starting value" value={inputs.value} onChange={set("value")} />
                <span>to</span>
                <NumInput label="Ending value" value={inputs.total} onChange={set("total")} />
              </>
            )}

            {inputs.mode === "adjust" && (
              <>
                <NumInput label="Value" value={inputs.value} onChange={set("value")} />
                <span>{inputs.direction === "increase" ? "increased" : "decreased"} by</span>
                <NumInput label="Percentage" value={inputs.percent} onChange={set("percent")} />
                <span>%</span>
              </>
            )}
          </div>

          {inputs.mode === "adjust" && (
            <div className="mt-5">
              <SegmentedControl
                ariaLabel="Direction"
                options={[
                  { value: "increase", label: "Increase" },
                  { value: "decrease", label: "Decrease" },
                ]}
                value={inputs.direction}
                onChange={(direction) => setInputs((prev) => ({ ...prev, direction }))}
              />
            </div>
          )}

          <div className="mt-7 flex items-center gap-3 border-t border-border pt-5">
            <Button variant="secondary" size="sm" onClick={copyLink} className="flex-1">
              <Icon name={copied ? "fa-check" : "fa-link"} />
              {copied ? "Link copied" : "Copy share link"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setInputs(DEFAULTS)}
              aria-label="Reset to defaults"
            >
              <Icon name="fa-rotate-left" />
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="lg:col-span-3">
        <div className="flex h-full flex-col gap-6 rounded-2xl border border-border bg-card p-6">
          {result.error ? (
            <div className="flex flex-1 flex-col items-center justify-center rounded-xl bg-red-500/5 p-8 text-center">
              <Icon name="fa-triangle-exclamation" className="text-2xl text-red-500" />
              <p className="mt-3 font-medium text-foreground">{result.error}</p>
              <p className="mt-1 text-sm text-muted">Adjust the numbers to see a result.</p>
            </div>
          ) : (
            <>
              <div className="rounded-xl bg-gradient-to-br from-primary/10 to-transparent p-5">
                <p className="text-sm text-muted">Result</p>
                <p className="mt-1 font-mono text-4xl font-bold text-foreground sm:text-5xl">
                  {fmt(result.value)}
                  {result.isPercent && <span className="text-3xl">%</span>}
                </p>
                {result.detail && (
                  <p className="mt-1 text-sm text-faint">{result.detail}</p>
                )}
              </div>

              <div className="border-t border-border pt-5">
                <h3 className="font-display text-base font-semibold text-foreground">
                  Step by step
                </h3>
                <ol className="mt-4 space-y-3">
                  {result.steps.map((step, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 font-mono text-xs font-semibold text-primary">
                        {i + 1}
                      </span>
                      <span className="pt-0.5 font-mono text-sm leading-6 text-muted">
                        {step}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function NumInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <input
      aria-label={label}
      type="number"
      inputMode="decimal"
      value={Number.isNaN(value) ? "" : value}
      onChange={(e) => onChange(Number(e.target.value) || 0)}
      className={cn(
        "w-24 rounded-lg border border-border bg-background px-3 py-2 text-center font-mono text-base text-foreground transition-colors",
        "hover:border-border-strong focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
      )}
    />
  );
}
