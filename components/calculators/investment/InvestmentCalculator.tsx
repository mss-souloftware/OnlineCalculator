"use client";

import { useMemo, useState } from "react";
import { calculateInvestment } from "@/lib/calculatorEngine/investment";
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
  initial: number;
  monthlyContribution: number;
  annualReturn: number;
  years: number;
  annualIncrease: number;
}

const DEFAULTS: Inputs = {
  initial: 10000,
  monthlyContribution: 500,
  annualReturn: 8,
  years: 20,
  annualIncrease: 0,
};

const KEYS = Object.keys(DEFAULTS) as (keyof Inputs)[];

export function InvestmentCalculator() {
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

  const result = useMemo(() => calculateInvestment(inputs), [inputs]);

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
  const multiple =
    result.totalContributions > 0
      ? result.finalBalance / result.totalContributions
      : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-display text-lg font-semibold text-foreground">
              Your plan
            </h2>
            <div className="mt-6 space-y-7">
              <RangeField
                id="initial"
                label="Initial investment"
                value={inputs.initial}
                onChange={set("initial")}
                min={0}
                max={1000000}
                step={500}
                prefix="$"
              />
              <RangeField
                id="monthlyContribution"
                label="Monthly contribution"
                value={inputs.monthlyContribution}
                onChange={set("monthlyContribution")}
                min={0}
                max={10000}
                step={50}
                prefix="$"
              />
              <RangeField
                id="annualReturn"
                label="Expected annual return"
                value={inputs.annualReturn}
                onChange={set("annualReturn")}
                min={0}
                max={20}
                step={0.1}
                suffix="%"
              />
              <RangeField
                id="years"
                label="Years invested"
                value={inputs.years}
                onChange={set("years")}
                min={1}
                max={50}
                step={1}
                suffix="yrs"
              />
              <RangeField
                id="annualIncrease"
                label="Annual contribution increase"
                value={inputs.annualIncrease}
                onChange={set("annualIncrease")}
                min={0}
                max={15}
                step={0.5}
                suffix="%"
                hint="Raise your contribution each year, e.g. with your salary"
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
                Portfolio value after {inputs.years}{" "}
                {inputs.years === 1 ? "year" : "years"}
              </p>
              <p className="mt-1 font-mono text-4xl font-bold text-foreground sm:text-5xl">
                {formatCurrency(result.finalBalance)}
              </p>
              {multiple > 0 && (
                <p className="mt-1 text-xs text-faint">
                  {multiple.toFixed(2)}× your total invested
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <DonutChart
                centerLabel="Portfolio"
                centerValue={formatCurrency(result.finalBalance)}
                segments={[
                  {
                    label: "Total invested",
                    value: result.totalContributions,
                    color: "var(--faint-foreground)",
                    display: formatCurrency(result.totalContributions),
                  },
                  {
                    label: "Total returns",
                    value: result.totalInterest,
                    color: "var(--primary)",
                    display: formatCurrency(result.totalInterest),
                  },
                ]}
              />

              <dl className="space-y-3 self-center">
                <Stat
                  label="Total invested"
                  value={formatCurrency(result.totalContributions)}
                />
                <Stat
                  label="Total returns"
                  value={formatCurrency(result.totalInterest)}
                />
                <Stat
                  label="Portfolio value"
                  value={formatCurrency(result.finalBalance)}
                />
                <Stat
                  label="Returns share"
                  value={
                    result.finalBalance > 0
                      ? `${((result.totalInterest / result.finalBalance) * 100).toFixed(0)}%`
                      : "—"
                  }
                />
              </dl>
            </div>
          </div>
        </div>
      </div>

      {yearly.length > 1 && (
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display text-lg font-semibold text-foreground">
            Portfolio growth over {inputs.years} years
          </h2>
          <p className="mt-1 text-sm text-muted">
            Compounding returns stack on top of everything you invest.
          </p>
          <div className="mt-6">
            <StackedBarChart
              lowerLabel="Invested"
              upperLabel="Returns"
              totalLabel="Portfolio"
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
                <th className="py-2.5 pr-4 text-right font-medium">Invested</th>
                <th className="py-2.5 pr-4 text-right font-medium">Returns</th>
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
