"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { calculateRetirement } from "@/lib/calculatorEngine/retirement";
import { formatCurrency } from "@/lib/format";
import { RangeField } from "@/components/ui/RangeField";
import { DonutChart } from "@/components/charts/DonutChart";
import { StackedBarChart } from "@/components/charts/StackedBarChart";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Stat } from "@/components/calculators/ResultStat";
import { cn } from "@/lib/utils";

interface Inputs {
  currentAge: number;
  retirementAge: number;
  currentSavings: number;
  monthlyContribution: number;
  annualReturn: number;
  withdrawalRate: number;
}

const DEFAULTS: Inputs = {
  currentAge: 30,
  retirementAge: 65,
  currentSavings: 25000,
  monthlyContribution: 500,
  annualReturn: 7,
  withdrawalRate: 4,
};

const KEYS = Object.keys(DEFAULTS) as (keyof Inputs)[];

export function RetirementCalculator() {
  const [inputs, setInputs] = useState<Inputs>(DEFAULTS);
  const [showAll, setShowAll] = useState(false);
  const [copied, setCopied] = useState(false);
  const hydrated = useRef(false);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const next = { ...DEFAULTS };
    for (const key of KEYS) {
      const v = parseFloat(p.get(key) ?? "");
      if (Number.isFinite(v)) next[key] = v;
    }
    setInputs(next);
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    const p = new URLSearchParams();
    for (const key of KEYS) p.set(key, String(inputs[key]));
    window.history.replaceState(null, "", `${window.location.pathname}?${p}`);
  }, [inputs]);

  const result = useMemo(() => calculateRetirement(inputs), [inputs]);

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
              Your details
            </h2>
            <div className="mt-6 space-y-7">
              <RangeField
                id="currentAge"
                label="Current age"
                value={inputs.currentAge}
                onChange={set("currentAge")}
                min={18}
                max={75}
                step={1}
              />
              <RangeField
                id="retirementAge"
                label="Retirement age"
                value={inputs.retirementAge}
                onChange={set("retirementAge")}
                min={40}
                max={85}
                step={1}
                hint={`${result.years} years until retirement`}
              />
              <RangeField
                id="currentSavings"
                label="Current savings"
                value={inputs.currentSavings}
                onChange={set("currentSavings")}
                min={0}
                max={2000000}
                step={1000}
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
                max={15}
                step={0.1}
                suffix="%"
              />
              <RangeField
                id="withdrawalRate"
                label="Withdrawal rate"
                value={inputs.withdrawalRate}
                onChange={set("withdrawalRate")}
                min={2}
                max={8}
                step={0.1}
                suffix="%"
                hint="Annual % drawn in retirement (4% is a common rule of thumb)"
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-gradient-to-br from-primary/10 to-transparent p-5">
                <p className="text-sm text-muted">
                  Nest egg at age {inputs.retirementAge}
                </p>
                <p className="mt-1 font-mono text-3xl font-bold text-foreground sm:text-4xl">
                  {formatCurrency(result.corpus)}
                </p>
              </div>
              <div className="rounded-xl border border-border p-5">
                <p className="text-sm text-muted">Est. monthly income</p>
                <p className="mt-1 font-mono text-3xl font-bold text-primary sm:text-4xl">
                  {formatCurrency(result.monthlyIncome)}
                </p>
                <p className="mt-1 text-xs text-faint">
                  at {inputs.withdrawalRate}% withdrawal
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <DonutChart
                centerLabel="Nest egg"
                centerValue={formatCurrency(result.corpus)}
                segments={[
                  {
                    label: "Total contributed",
                    value: result.totalContributions,
                    color: "var(--faint-foreground)",
                    display: formatCurrency(result.totalContributions),
                  },
                  {
                    label: "Investment growth",
                    value: result.totalInterest,
                    color: "var(--primary)",
                    display: formatCurrency(result.totalInterest),
                  },
                ]}
              />

              <dl className="space-y-3 self-center">
                <Stat
                  label="Years to grow"
                  value={`${result.years}`}
                />
                <Stat
                  label="Total contributed"
                  value={formatCurrency(result.totalContributions)}
                />
                <Stat
                  label="Investment growth"
                  value={formatCurrency(result.totalInterest)}
                />
                <Stat
                  label="Nest egg"
                  value={formatCurrency(result.corpus)}
                />
              </dl>
            </div>
          </div>
        </div>
      </div>

      {yearly.length > 1 && (
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display text-lg font-semibold text-foreground">
            Growth to retirement
          </h2>
          <p className="mt-1 text-sm text-muted">
            Your contributions plus compounding investment growth, year by year.
          </p>
          <div className="mt-6">
            <StackedBarChart
              lowerLabel="Contributed"
              upperLabel="Growth"
              totalLabel="Nest egg"
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
          Yearly projection
        </h2>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-faint">
                <th className="py-2.5 pr-4 font-medium">Year</th>
                <th className="py-2.5 pr-4 text-right font-medium">Age</th>
                <th className="py-2.5 pr-4 text-right font-medium">
                  Contributed
                </th>
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
                    {inputs.currentAge + row.year}
                  </td>
                  <td className="py-2.5 pr-4 text-right text-muted">
                    {formatCurrency(row.contributions)}
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
