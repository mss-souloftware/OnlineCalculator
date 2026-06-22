"use client";

import { useMemo, useState } from "react";
import { useUrlState } from "@/lib/useUrlState";
import { calculateLoan } from "@/lib/calculatorEngine/loan";
import { formatCurrency } from "@/lib/format";
import { RangeField } from "@/components/ui/RangeField";
import { DonutChart } from "@/components/charts/DonutChart";
import { AmortizationChart } from "@/components/charts/AmortizationChart";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Stat } from "@/components/calculators/ResultStat";
import { cn } from "@/lib/utils";

interface Inputs {
  amount: number;
  annualRate: number;
  termYears: number;
}

const DEFAULTS: Inputs = { amount: 25000, annualRate: 8.5, termYears: 5 };
const PARAM_KEYS: (keyof Inputs)[] = ["amount", "annualRate", "termYears"];

const PRESETS: { type: string; icon: string; values: Inputs }[] = [
  { type: "Personal", icon: "fa-user", values: { amount: 15000, annualRate: 11, termYears: 5 } },
  { type: "Auto", icon: "fa-car", values: { amount: 35000, annualRate: 7.5, termYears: 6 } },
  { type: "Student", icon: "fa-graduation-cap", values: { amount: 25000, annualRate: 6, termYears: 10 } },
  { type: "Business", icon: "fa-briefcase", values: { amount: 75000, annualRate: 9, termYears: 7 } },
];

export function LoanCalculator() {
  const [inputs, setInputs] = useState<Inputs>(DEFAULTS);
  const [activeType, setActiveType] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [copied, setCopied] = useState(false);
  // Hydrate from the URL and mirror changes back (the shareable state). The URL
  // only starts reflecting inputs once the visitor changes something.
  useUrlState(
    inputs,
    () => {
      const p = new URLSearchParams(window.location.search);
      const next = { ...DEFAULTS };
      for (const key of PARAM_KEYS) {
        const v = parseFloat(p.get(key) ?? "");
        if (Number.isFinite(v)) next[key] = v;
      }
      return next;
    },
    (state) => {
      const p = new URLSearchParams();
      for (const key of PARAM_KEYS) p.set(key, String(state[key]));
      return p.toString();
    },
    setInputs,
  );

  const result = useMemo(() => calculateLoan(inputs), [inputs]);

  const set = (key: keyof Inputs) => (value: number) => {
    setActiveType(null);
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  function applyPreset(preset: (typeof PRESETS)[number]) {
    setActiveType(preset.type);
    setInputs({ ...preset.values });
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — no-op */
    }
  }

  const visibleSchedule = showAll
    ? result.schedule
    : result.schedule.slice(0, 10);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Inputs */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-display text-lg font-semibold text-foreground">
              Loan details
            </h2>

            {/* Loan-type presets */}
            <div className="mt-5">
              <p className="mb-2 font-mono text-xs uppercase tracking-wider text-faint">
                Quick start
              </p>
              <div className="grid grid-cols-2 gap-2">
                {PRESETS.map((p) => {
                  const active = activeType === p.type;
                  return (
                    <button
                      key={p.type}
                      type="button"
                      onClick={() => applyPreset(p)}
                      aria-pressed={active}
                      className={cn(
                        "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                        active
                          ? "border-primary/50 bg-primary/10 text-primary"
                          : "border-border bg-background text-muted hover:border-border-strong hover:text-foreground",
                      )}
                    >
                      <Icon name={p.icon} className="text-xs" fixedWidth />
                      {p.type}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 space-y-7">
              <RangeField
                id="amount"
                label="Loan amount"
                value={inputs.amount}
                onChange={set("amount")}
                min={1000}
                max={200000}
                step={500}
                prefix="$"
              />
              <RangeField
                id="annualRate"
                label="Interest rate (APR)"
                value={inputs.annualRate}
                onChange={set("annualRate")}
                min={0}
                max={36}
                step={0.1}
                suffix="%"
              />
              <RangeField
                id="termYears"
                label="Loan term"
                value={inputs.termYears}
                onChange={set("termYears")}
                min={1}
                max={30}
                step={1}
                suffix="yrs"
              />
            </div>

            <div className="mt-7 flex items-center gap-3 border-t border-border pt-5">
              <Button
                variant="secondary"
                size="sm"
                onClick={copyLink}
                className="flex-1"
              >
                <Icon name={copied ? "fa-check" : "fa-link"} />
                {copied ? "Link copied" : "Copy share link"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setActiveType(null);
                  setInputs(DEFAULTS);
                }}
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
            <div className="rounded-xl bg-gradient-to-br from-primary/10 to-transparent p-5">
              <p className="text-sm text-muted">Estimated monthly payment</p>
              <p className="mt-1 font-mono text-4xl font-bold text-foreground sm:text-5xl">
                {formatCurrency(result.monthlyPayment, { decimals: 2 })}
              </p>
              <p className="mt-1 text-xs text-faint">
                Over {inputs.termYears} {inputs.termYears === 1 ? "year" : "years"}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <DonutChart
                centerLabel="Total of payments"
                centerValue={formatCurrency(result.totalPayment)}
                segments={[
                  {
                    label: "Principal",
                    value: result.principal,
                    color: "var(--primary)",
                    display: formatCurrency(result.principal),
                  },
                  {
                    label: "Total interest",
                    value: result.totalInterest,
                    color: "var(--faint-foreground)",
                    display: formatCurrency(result.totalInterest),
                  },
                ]}
              />

              <dl className="space-y-3 self-center">
                <Stat
                  label="Loan amount"
                  value={formatCurrency(result.principal)}
                />
                <Stat
                  label="Total interest"
                  value={formatCurrency(result.totalInterest)}
                />
                <Stat
                  label="Total of payments"
                  value={formatCurrency(result.totalPayment)}
                />
                <Stat
                  label="Interest as % of loan"
                  value={
                    result.principal > 0
                      ? `${((result.totalInterest / result.principal) * 100).toFixed(0)}%`
                      : "—"
                  }
                />
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Amortization chart */}
      {result.schedule.length > 1 && (
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display text-lg font-semibold text-foreground">
            Payment breakdown over {inputs.termYears} years
          </h2>
          <p className="mt-1 text-sm text-muted">
            Early payments are mostly interest; principal grows over time.
          </p>
          <div className="mt-6">
            <AmortizationChart data={result.schedule} />
          </div>
        </div>
      )}

      {/* Schedule table */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-display text-lg font-semibold text-foreground">
          Yearly schedule
        </h2>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-faint">
                <th className="py-2.5 pr-4 font-medium">Year</th>
                <th className="py-2.5 pr-4 text-right font-medium">Principal</th>
                <th className="py-2.5 pr-4 text-right font-medium">Interest</th>
                <th className="py-2.5 text-right font-medium">Balance</th>
              </tr>
            </thead>
            <tbody className="font-mono">
              {visibleSchedule.map((row) => (
                <tr
                  key={row.year}
                  className="border-b border-border/60 last:border-0"
                >
                  <td className="py-2.5 pr-4 text-muted">{row.year}</td>
                  <td className="py-2.5 pr-4 text-right text-foreground">
                    {formatCurrency(row.principalPaid)}
                  </td>
                  <td className="py-2.5 pr-4 text-right text-muted">
                    {formatCurrency(row.interestPaid)}
                  </td>
                  <td className="py-2.5 text-right text-foreground">
                    {formatCurrency(row.balance)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {result.schedule.length > 10 && (
          <button
            onClick={() => setShowAll((v) => !v)}
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-to"
          >
            {showAll ? "Show less" : `Show all ${result.schedule.length} years`}
            <Icon
              name="fa-chevron-down"
              className={cn(
                "text-xs transition-transform",
                showAll && "rotate-180",
              )}
            />
          </button>
        )}
      </div>
    </div>
  );
}
