"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  calculateCompoundInterest,
  FREQUENCIES,
  type CompoundFrequency,
} from "@/lib/calculatorEngine/compound-interest";
import { formatCurrency } from "@/lib/format";
import { RangeField } from "@/components/ui/RangeField";
import { DonutChart } from "@/components/charts/DonutChart";
import { StackedBarChart } from "@/components/charts/StackedBarChart";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Stat } from "@/components/calculators/ResultStat";
import { cn } from "@/lib/utils";

interface Inputs {
  principal: number;
  monthlyContribution: number;
  annualRate: number;
  years: number;
  frequency: CompoundFrequency;
}

const DEFAULTS: Inputs = {
  principal: 10000,
  monthlyContribution: 0,
  annualRate: 7,
  years: 10,
  frequency: "monthly",
};

const NUM_KEYS: (keyof Omit<Inputs, "frequency">)[] = [
  "principal",
  "monthlyContribution",
  "annualRate",
  "years",
];

const VALID_FREQ = new Set(FREQUENCIES.map((f) => f.value));

export function CompoundInterestCalculator() {
  const [inputs, setInputs] = useState<Inputs>(DEFAULTS);
  const [showAll, setShowAll] = useState(false);
  const [copied, setCopied] = useState(false);
  const hydrated = useRef(false);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const next = { ...DEFAULTS };
    for (const key of NUM_KEYS) {
      const v = parseFloat(p.get(key) ?? "");
      if (Number.isFinite(v)) next[key] = v;
    }
    const freq = p.get("frequency");
    if (freq && VALID_FREQ.has(freq as CompoundFrequency)) {
      next.frequency = freq as CompoundFrequency;
    }
    setInputs(next);
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    const p = new URLSearchParams();
    for (const key of NUM_KEYS) p.set(key, String(inputs[key]));
    p.set("frequency", inputs.frequency);
    window.history.replaceState(null, "", `${window.location.pathname}?${p}`);
  }, [inputs]);

  const result = useMemo(
    () => calculateCompoundInterest(inputs),
    [inputs],
  );

  const setNum = (key: keyof Omit<Inputs, "frequency">) => (value: number) =>
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
        {/* Inputs */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-display text-lg font-semibold text-foreground">
              Your investment
            </h2>
            <div className="mt-6 space-y-7">
              <RangeField
                id="principal"
                label="Initial deposit"
                value={inputs.principal}
                onChange={setNum("principal")}
                min={0}
                max={1000000}
                step={500}
                prefix="$"
              />
              <RangeField
                id="monthlyContribution"
                label="Monthly contribution"
                value={inputs.monthlyContribution}
                onChange={setNum("monthlyContribution")}
                min={0}
                max={10000}
                step={50}
                prefix="$"
                hint="Optional — set to $0 for a one-off deposit"
              />
              <RangeField
                id="annualRate"
                label="Annual interest rate"
                value={inputs.annualRate}
                onChange={setNum("annualRate")}
                min={0}
                max={20}
                step={0.1}
                suffix="%"
              />
              <RangeField
                id="years"
                label="Time to grow"
                value={inputs.years}
                onChange={setNum("years")}
                min={1}
                max={50}
                step={1}
                suffix="yrs"
              />

              <div>
                <label
                  htmlFor="frequency"
                  className="mb-1.5 block text-sm font-medium text-foreground"
                >
                  Compound frequency
                </label>
                <select
                  id="frequency"
                  value={inputs.frequency}
                  onChange={(e) =>
                    setInputs((prev) => ({
                      ...prev,
                      frequency: e.target.value as CompoundFrequency,
                    }))
                  }
                  className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground transition-colors focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  {FREQUENCIES.map((f) => (
                    <option key={f.value} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>
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

        {/* Results */}
        <div className="lg:col-span-3">
          <div className="flex h-full flex-col gap-6 rounded-2xl border border-border bg-card p-6">
            <div className="rounded-xl bg-gradient-to-br from-primary/10 to-transparent p-5">
              <p className="text-sm text-muted">
                Future value after {inputs.years}{" "}
                {inputs.years === 1 ? "year" : "years"}
              </p>
              <p className="mt-1 font-mono text-4xl font-bold text-foreground sm:text-5xl">
                {formatCurrency(result.finalBalance)}
              </p>
              {multiple > 0 && (
                <p className="mt-1 text-xs text-faint">
                  {multiple.toFixed(2)}× your total contributions
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <DonutChart
                centerLabel="Future value"
                centerValue={formatCurrency(result.finalBalance)}
                segments={[
                  {
                    label: "Contributions",
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
                  label="Total contributions"
                  value={formatCurrency(result.totalContributions)}
                />
                <Stat
                  label="Interest earned"
                  value={formatCurrency(result.totalInterest)}
                />
                <Stat
                  label="Future value"
                  value={formatCurrency(result.finalBalance)}
                />
                <Stat
                  label="Interest share"
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

      {/* Growth chart */}
      {yearly.length > 1 && (
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display text-lg font-semibold text-foreground">
            Growth over {inputs.years} years
          </h2>
          <p className="mt-1 text-sm text-muted">
            Watch interest compound on top of your contributions year after year.
          </p>
          <div className="mt-6">
            <StackedBarChart
              lowerLabel="Contributions"
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

      {/* Yearly table */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-display text-lg font-semibold text-foreground">
          Yearly breakdown
        </h2>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-faint">
                <th className="py-2.5 pr-4 font-medium">Year</th>
                <th className="py-2.5 pr-4 text-right font-medium">
                  Contributions
                </th>
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
