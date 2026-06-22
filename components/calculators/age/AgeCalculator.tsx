"use client";

import { useMemo, useState } from "react";
import { useUrlState } from "@/lib/useUrlState";
import { calculateAge, type DateParts } from "@/lib/calculatorEngine/age";
import { formatNumber } from "@/lib/format";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Stat } from "@/components/calculators/ResultStat";

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/** Today's date as a YYYY-MM-DD string in the visitor's local time. */
function todayISO(): string {
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

function parseISO(value: string): DateParts {
  const [year, month, day] = value.split("-").map(Number);
  return { year, month, day };
}

const DEFAULT_DOB = "2000-01-01";

interface Inputs {
  dob: string;
  asOf: string;
}

function pluralize(value: number, unit: string): string {
  return `${value} ${unit}${value === 1 ? "" : "s"}`;
}

export function AgeCalculator() {
  const [inputs, setInputs] = useState<Inputs>({
    dob: DEFAULT_DOB,
    asOf: todayISO(),
  });
  const [copied, setCopied] = useState(false);

  // Hydrate from the URL and mirror changes back once the visitor edits a value.
  useUrlState(
    inputs,
    () => {
      const p = new URLSearchParams(window.location.search);
      const dob = p.get("dob");
      const asOf = p.get("at");
      return { dob: dob || DEFAULT_DOB, asOf: asOf || todayISO() };
    },
    (state) => {
      const p = new URLSearchParams();
      p.set("dob", state.dob);
      // Only pin the comparison date in the URL when it isn't today, so a plain
      // shared link keeps measuring against "today" for the next visitor.
      if (state.asOf !== todayISO()) p.set("at", state.asOf);
      return p.toString();
    },
    setInputs,
  );

  const result = useMemo(
    () => calculateAge(parseISO(inputs.dob), parseISO(inputs.asOf)),
    [inputs],
  );

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — no-op */
    }
  }

  const isToday = inputs.asOf === todayISO();

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
      {/* Inputs */}
      <div className="lg:col-span-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display text-lg font-semibold text-foreground">
            Your details
          </h2>

          <div className="mt-6 space-y-5">
            <DateField
              id="dob"
              label="Date of birth"
              value={inputs.dob}
              max={todayISO()}
              onChange={(dob) => setInputs((prev) => ({ ...prev, dob }))}
            />
            <DateField
              id="asOf"
              label="Age at the date of"
              value={inputs.asOf}
              onChange={(asOf) => setInputs((prev) => ({ ...prev, asOf }))}
              hint={
                isToday
                  ? "Using today's date"
                  : "Using a custom date — reset to use today"
              }
            />
          </div>

          <div className="mt-7 flex items-center gap-3 border-t border-border pt-5">
            <Button variant="secondary" size="sm" onClick={copyLink} className="flex-1">
              <Icon name={copied ? "fa-check" : "fa-link"} />
              {copied ? "Link copied" : "Copy share link"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setInputs({ dob: DEFAULT_DOB, asOf: todayISO() })}
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
            </div>
          ) : (
            <>
              <div className="rounded-xl bg-gradient-to-br from-primary/10 to-transparent p-5">
                <p className="text-sm text-muted">
                  {isToday ? "You are" : "Age on that date"}
                </p>
                <p className="mt-1 font-mono text-4xl font-bold text-foreground sm:text-5xl">
                  {result.years}
                  <span className="ml-1 text-2xl font-semibold text-muted">yr</span>{" "}
                  {result.months}
                  <span className="ml-1 text-2xl font-semibold text-muted">mo</span>{" "}
                  {result.days}
                  <span className="ml-1 text-2xl font-semibold text-muted">d</span>
                </p>
              </div>

              {/* Birthday + weekday callouts */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Callout
                  icon="fa-calendar-day"
                  title="Born on a"
                  value={result.bornOnWeekday}
                />
                <Callout
                  icon="fa-cake-candles"
                  title={
                    result.nextBirthdayInDays === 0
                      ? "Happy birthday!"
                      : "Next birthday"
                  }
                  value={
                    result.nextBirthdayInDays === 0
                      ? `Turning ${result.turningAge} today`
                      : `${pluralize(result.nextBirthdayInDays, "day")} · turns ${result.turningAge}`
                  }
                  sub={
                    result.nextBirthdayInDays === 0
                      ? undefined
                      : `on a ${result.nextBirthdayWeekday}`
                  }
                />
              </div>

              <div>
                <h3 className="font-display text-base font-semibold text-foreground">
                  Your age in other units
                </h3>
                <dl className="mt-4 space-y-3">
                  <Stat label="Months" value={formatNumber(result.totalMonths)} />
                  <Stat label="Weeks" value={formatNumber(result.totalWeeks)} />
                  <Stat label="Days" value={formatNumber(result.totalDays)} />
                  <Stat label="Hours" value={formatNumber(result.totalHours)} />
                  <Stat label="Minutes" value={formatNumber(result.totalMinutes)} />
                </dl>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function DateField({
  id,
  label,
  value,
  onChange,
  max,
  hint,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  max?: string;
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        id={id}
        type="date"
        value={value}
        max={max}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2.5 font-mono text-foreground transition-colors hover:border-border-strong focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
      {hint && <p className="mt-1.5 text-xs text-faint">{hint}</p>}
    </div>
  );
}

function Callout({
  icon,
  title,
  value,
  sub,
}: {
  icon: string;
  title: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-background p-4">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon name={icon} />
      </span>
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wide text-faint">{title}</p>
        <p className="font-medium text-foreground">{value}</p>
        {sub && <p className="text-xs text-muted">{sub}</p>}
      </div>
    </div>
  );
}
