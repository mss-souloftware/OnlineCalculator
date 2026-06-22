"use client";

import { useMemo, useState } from "react";
import { calculateSavings } from "@/lib/calculatorEngine/savings";
import { useUrlState } from "@/lib/useUrlState";
import { formatCurrency } from "@/lib/format";
import { RangeField } from "@/components/ui/RangeField";
import { DonutChart } from "@/components/charts/DonutChart";
import { StackedBarChart } from "@/components/charts/StackedBarChart";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Stat } from "@/components/calculators/ResultStat";
import { cn } from "@/lib/utils";

interface Inputs {
  initialDeposit: number;
  monthlyDeposit: number;
  annualRate: number;
  years: number;
  goal: number;
}

const DEFAULTS: Inputs = {
  initialDeposit: 1000,
  monthlyDeposit: 400,
  annualRate: 4,
  years: 6,
  goal: 30000,
};

const KEYS = Object.keys(DEFAULTS) as (keyof Inputs)[];

export function SavingsCalculator() {
  const [inputs, setInputs] = useState<Inputs>(DEFAULTS);
  const [showAll, setShowAll] = useState(false);
  const [copied, setCopied] = useState(false);
  // Hydrate from the URL and mirror changes back once the visitor edits a value.
  useUrlState(
    inputs,
    () => {
      const p = new URLSearchParams(window.location.search);
      const next = { ...DEFAULTS };
      for (const key of KEYS) {
        const v = parseFloat(p.get(key) ?? "");
        if (Number.isFinite(v)) next[key] = v;
      }
      return next;
    },
    (state) => {
      const p = new URLSearchParams();
      for (const key of KEYS) p.set(key, String(state[key]));
      return p.toString();
    },
    setInputs,
  );

  const result = useMemo(() => calculateSavings(inputs), [inputs]);

  const set = (key: keyof Inputs) => (value: number) =>
    setInputs((prev) => ({ ...prev, [key]: value }));

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }

  const yearly = result.growth.filter((g) => g.year > 0);
  const visible = showAll ? yearly : yearly.slice(0, 10);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-display text-lg font-semibold text-foreground">
              Your savings plan
            </h2>
            <div className="mt-6 space-y-7">
              <RangeField
                id="initialDeposit"
                label="Starting balance"
                value={inputs.initialDeposit}
                onChange={set("initialDeposit")}
                min={0}
                max={500000}
                step={500}
                prefix="$"
              />
              <RangeField
                id="monthlyDeposit"
                label="Monthly deposit"
                value={inputs.monthlyDeposit}
                onChange={set("monthlyDeposit")}
                min={0}
                max={10000}
                step={25}
                prefix="$"
              />
              <RangeField
                id="annualRate"
                label="Annual interest rate (APY)"
                value={inputs.annualRate}
                onChange={set("annualRate")}
                min={0}
                max={12}
                step={0.1}
                suffix="%"
              />
              <RangeField
                id="years"
                label="Saving for"
                value={inputs.years}
                onChange={set("years")}
                min={1}
                max={40}
                step={1}
                suffix="yrs"
              />
              <RangeField
                id="goal"
                label="Savings goal"
                value={inputs.goal}
                onChange={set("goal")}
                min={0}
                max={500000}
                step={1000}
                prefix="$"
                hint="Optional — set to $0 to hide goal tracking"
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
                onClick={() => setInputs(DEFAULTS)}
                aria-label="Reset to defaults"
              >
                <Icon name="fa-rotate-left" />
                Reset
              </Button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="flex h-full flex-col gap-6 rounded-2xl border border-border bg-card p-6">
            <div className="rounded-xl bg-gradient-to-br from-primary/10 to-transparent p-5">
              <p className="text-sm text-muted">
                Balance after {inputs.years}{" "}
                {inputs.years === 1 ? "year" : "years"}
              </p>
              <p className="mt-1 font-mono text-4xl font-bold text-foreground sm:text-5xl">
                {formatCurrency(result.finalBalance)}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <DonutChart
                centerLabel="Balance"
                centerValue={formatCurrency(result.finalBalance)}
                segments={[
                  {
                    label: "Total deposited",
                    value: result.totalContributions,
                    color: "var(--faint-foreground)",
                    display: formatCurrency(result.totalContributions),
                  },
                  {
                    label: "Interest earned",
                    value: result.totalInterest,
                    color: "var(--primary)",
                    display: formatCurrency(result.totalInterest),
                  },
                ]}
              />

              <dl className="space-y-3 self-center">
                <Stat
                  label="Total deposited"
                  value={formatCurrency(result.totalContributions)}
                />
                <Stat
                  label="Interest earned"
                  value={formatCurrency(result.totalInterest)}
                />
                <Stat
                  label="Final balance"
                  value={formatCurrency(result.finalBalance)}
                />
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Goal tracker */}
      {result.goal > 0 && (
        <div
          className={cn(
            "rounded-2xl border bg-card p-6",
            result.goalReached ? "border-primary/40" : "border-border",
          )}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="flex items-center gap-2.5 font-display text-lg font-semibold text-foreground">
              <Icon
                name={result.goalReached ? "fa-circle-check" : "fa-bullseye"}
                className="text-primary"
              />
              {formatCurrency(result.goal)} goal
            </h2>
            <span className="font-mono text-sm text-muted">
              {result.goalProgress.toFixed(0)}% there
            </span>
          </div>

          <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-background">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-primary-to transition-[width] duration-300"
              style={{ width: `${Math.min(100, result.goalProgress)}%` }}
            />
          </div>

          <p className="mt-4 text-sm leading-6 text-muted">
            {result.goalReached ? (
              <>
                <span className="font-medium text-foreground">On track.</span>{" "}
                You reach your {formatCurrency(result.goal)} goal in{" "}
                <span className="font-medium text-foreground">
                  year {result.goalYear}
                </span>
                .
              </>
            ) : (
              <>
                <span className="font-medium text-foreground">
                  {formatCurrency(result.shortfall)} short.
                </span>{" "}
                Increase your monthly deposit, extend the term, or find a higher
                rate to close the gap.
              </>
            )}
          </p>
        </div>
      )}

      {yearly.length > 1 && (
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display text-lg font-semibold text-foreground">
            Savings growth over {inputs.years} years
          </h2>
          <p className="mt-1 text-sm text-muted">
            Your deposits plus the interest they earn, year by year.
          </p>
          <div className="mt-6">
            <StackedBarChart
              lowerLabel="Deposited"
              upperLabel="Interest"
              totalLabel="Balance"
              data={yearly.map((g) => ({
                year: g.year,
                lower: g.contributions,
                upper: g.interest,
                total: g.balance,
              }))}
            />
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-display text-lg font-semibold text-foreground">
          Yearly breakdown
        </h2>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-faint">
                <th className="py-2.5 pr-4 font-medium">Year</th>
                <th className="py-2.5 pr-4 text-right font-medium">Deposited</th>
                <th className="py-2.5 pr-4 text-right font-medium">Interest</th>
                <th className="py-2.5 text-right font-medium">Balance</th>
              </tr>
            </thead>
            <tbody className="font-mono">
              {visible.map((row) => (
                <tr
                  key={row.year}
                  className="border-b border-border/60 last:border-0"
                >
                  <td className="py-2.5 pr-4 text-muted">{row.year}</td>
                  <td className="py-2.5 pr-4 text-right text-muted">
                    {formatCurrency(row.contributions)}
                  </td>
                  <td className="py-2.5 pr-4 text-right text-primary">
                    {formatCurrency(row.interest)}
                  </td>
                  <td className="py-2.5 text-right text-foreground">
                    {formatCurrency(row.balance)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {yearly.length > 10 && (
          <button
            onClick={() => setShowAll((v) => !v)}
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-to"
          >
            {showAll ? "Show less" : `Show all ${yearly.length} years`}
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
