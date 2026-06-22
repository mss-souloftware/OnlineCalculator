"use client";

import { useMemo, useState } from "react";
import { useUrlState } from "@/lib/useUrlState";
import {
  addToDate,
  calculateDuration,
  type DateParts,
} from "@/lib/calculatorEngine/date-calculator";
import { formatNumber } from "@/lib/format";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Stat } from "@/components/calculators/ResultStat";

type Mode = "difference" | "add";

interface Inputs {
  mode: Mode;
  from: string;
  to: string;
  op: "add" | "subtract";
  years: number;
  months: number;
  weeks: number;
  days: number;
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function todayISO(): string {
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

function parseISO(value: string): DateParts {
  const [year, month, day] = value.split("-").map(Number);
  return { year, month, day };
}

/** Adds whole days to an ISO date string (used only for sensible defaults). */
function shiftISO(iso: string, days: number): string {
  const p = parseISO(iso);
  const d = new Date(Date.UTC(p.year, p.month - 1, p.day) + days * 86_400_000);
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

function formatLong(p: DateParts): string {
  return new Date(Date.UTC(p.year, p.month - 1, p.day)).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

function defaults(): Inputs {
  const today = todayISO();
  return {
    mode: "difference",
    from: today,
    to: shiftISO(today, 90),
    op: "add",
    years: 0,
    months: 0,
    weeks: 0,
    days: 30,
  };
}

function pluralize(value: number, unit: string): string {
  return `${value} ${unit}${value === 1 ? "" : "s"}`;
}

/** Joins non-zero parts into "1 year, 2 months, 3 days" (or "0 days"). */
function durationPhrase(years: number, months: number, days: number): string {
  const parts: string[] = [];
  if (years) parts.push(pluralize(years, "year"));
  if (months) parts.push(pluralize(months, "month"));
  if (days) parts.push(pluralize(days, "day"));
  return parts.length ? parts.join(", ") : "0 days";
}

/** Full interval phrase incl. weeks, e.g. "2 months, 1 week" (or "nothing"). */
function intervalPhrase(i: {
  years: number;
  months: number;
  weeks: number;
  days: number;
}): string {
  const parts: string[] = [];
  if (i.years) parts.push(pluralize(i.years, "year"));
  if (i.months) parts.push(pluralize(i.months, "month"));
  if (i.weeks) parts.push(pluralize(i.weeks, "week"));
  if (i.days) parts.push(pluralize(i.days, "day"));
  return parts.length ? parts.join(", ") : "nothing";
}

export function DateCalculator() {
  const [inputs, setInputs] = useState<Inputs>(defaults);
  const [copied, setCopied] = useState(false);

  // Hydrate from the URL and mirror changes back once the visitor edits a value.
  useUrlState(
    inputs,
    () => {
      const p = new URLSearchParams(window.location.search);
      const base = defaults();
      const mode = p.get("mode");
      if (mode === "difference" || mode === "add") base.mode = mode;
      if (p.get("from")) base.from = p.get("from")!;
      if (p.get("to")) base.to = p.get("to")!;
      const op = p.get("op");
      if (op === "add" || op === "subtract") base.op = op;
      const int = (key: string, fallback: number) => {
        const v = parseInt(p.get(key) ?? "", 10);
        return Number.isFinite(v) ? v : fallback;
      };
      base.years = int("y", base.years);
      base.months = int("mo", base.months);
      base.weeks = int("w", base.weeks);
      base.days = int("d", base.days);
      return base;
    },
    (state) => {
      const p = new URLSearchParams({ mode: state.mode, from: state.from });
      if (state.mode === "difference") {
        p.set("to", state.to);
      } else {
        p.set("op", state.op);
        p.set("y", String(state.years));
        p.set("mo", String(state.months));
        p.set("w", String(state.weeks));
        p.set("d", String(state.days));
      }
      return p.toString();
    },
    setInputs,
  );

  const duration = useMemo(
    () => calculateDuration(parseISO(inputs.from), parseISO(inputs.to)),
    [inputs.from, inputs.to],
  );

  const added = useMemo(
    () =>
      addToDate(parseISO(inputs.from), inputs.op, {
        years: inputs.years,
        months: inputs.months,
        weeks: inputs.weeks,
        days: inputs.days,
      }),
    [inputs.from, inputs.op, inputs.years, inputs.months, inputs.weeks, inputs.days],
  );

  const setInt = (field: keyof Inputs) => (value: number) =>
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
          <SegmentedControl
            ariaLabel="Calculation type"
            options={[
              { value: "difference", label: "Difference" },
              { value: "add", label: "Add / Subtract" },
            ]}
            value={inputs.mode}
            onChange={(mode) => setInputs((prev) => ({ ...prev, mode }))}
          />

          {inputs.mode === "difference" ? (
            <div className="mt-6 space-y-5">
              <DateField
                id="from"
                label="Start date"
                value={inputs.from}
                onChange={(from) => setInputs((prev) => ({ ...prev, from }))}
              />
              <DateField
                id="to"
                label="End date"
                value={inputs.to}
                onChange={(to) => setInputs((prev) => ({ ...prev, to }))}
              />
            </div>
          ) : (
            <div className="mt-6 space-y-5">
              <DateField
                id="from"
                label="Start date"
                value={inputs.from}
                onChange={(from) => setInputs((prev) => ({ ...prev, from }))}
              />
              <SegmentedControl
                ariaLabel="Direction"
                options={[
                  { value: "add", label: "Add" },
                  { value: "subtract", label: "Subtract" },
                ]}
                value={inputs.op}
                onChange={(op) => setInputs((prev) => ({ ...prev, op }))}
              />
              <div className="grid grid-cols-2 gap-3">
                <CountField label="Years" value={inputs.years} onChange={setInt("years")} />
                <CountField label="Months" value={inputs.months} onChange={setInt("months")} />
                <CountField label="Weeks" value={inputs.weeks} onChange={setInt("weeks")} />
                <CountField label="Days" value={inputs.days} onChange={setInt("days")} />
              </div>
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
              onClick={() => setInputs(defaults())}
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
          {inputs.mode === "difference" ? (
            duration.error ? (
              <ErrorPanel message={duration.error} />
            ) : (
              <>
                <div className="rounded-xl bg-gradient-to-br from-primary/10 to-transparent p-5">
                  <p className="text-sm text-muted">Duration</p>
                  <p className="mt-1 font-mono text-3xl font-bold text-foreground sm:text-4xl">
                    {durationPhrase(duration.years, duration.months, duration.days)}
                  </p>
                  {duration.direction === "before" && (
                    <p className="mt-1 text-xs text-faint">
                      The end date is before the start date.
                    </p>
                  )}
                </div>

                <dl className="space-y-3">
                  <Stat label="Total days" value={formatNumber(duration.totalDays)} />
                  <Stat
                    label="Total weeks"
                    value={
                      duration.remainderDays === 0
                        ? formatNumber(duration.totalWeeks)
                        : `${formatNumber(duration.totalWeeks)} wk ${duration.remainderDays} d`
                    }
                  />
                  <Stat label="Business days (Mon–Fri)" value={formatNumber(duration.businessDays)} />
                </dl>
              </>
            )
          ) : added.error ? (
            <ErrorPanel message={added.error} />
          ) : (
            <>
              <div className="rounded-xl bg-gradient-to-br from-primary/10 to-transparent p-5">
                <p className="text-sm text-muted">Resulting date</p>
                <p className="mt-1 font-mono text-2xl font-bold text-foreground sm:text-3xl">
                  {formatLong(added)}
                </p>
              </div>
              <p className="text-sm leading-7 text-muted">
                {formatLong(parseISO(inputs.from))} {inputs.op === "add" ? "plus" : "minus"}{" "}
                {intervalPhrase(inputs)} lands on{" "}
                <span className="font-medium text-foreground">{added.weekday}</span>.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ErrorPanel({ message }: { message: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center rounded-xl bg-red-500/5 p-8 text-center">
      <Icon name="fa-triangle-exclamation" className="text-2xl text-red-500" />
      <p className="mt-3 font-medium text-foreground">{message}</p>
    </div>
  );
}

function DateField({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
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
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2.5 font-mono text-foreground transition-colors hover:border-border-strong focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
    </div>
  );
}

function CountField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <label className="text-xs font-medium uppercase tracking-wide text-faint">
        {label}
      </label>
      <input
        aria-label={label}
        type="number"
        inputMode="numeric"
        value={Number.isNaN(value) ? "" : value}
        onChange={(e) => onChange(Math.max(0, Math.trunc(Number(e.target.value) || 0)))}
        className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-center font-mono text-foreground transition-colors hover:border-border-strong focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
    </div>
  );
}
