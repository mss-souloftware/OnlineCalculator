"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { calculateEmi } from "@/lib/calculatorEngine/emi";
import { formatCurrency, formatDuration } from "@/lib/format";
import { RangeField } from "@/components/ui/RangeField";
import { DonutChart } from "@/components/charts/DonutChart";
import { AmortizationChart } from "@/components/charts/AmortizationChart";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Stat } from "@/components/calculators/ResultStat";
import { cn } from "@/lib/utils";

interface Inputs {
  principal: number;
  annualRate: number;
  tenureMonths: number;
}

const DEFAULTS: Inputs = { principal: 100000, annualRate: 10, tenureMonths: 60 };
const KEYS = Object.keys(DEFAULTS) as (keyof Inputs)[];

export function EmiCalculator() {
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

  const result = useMemo(() => calculateEmi(inputs), [inputs]);

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

  const visible = showAll ? result.schedule : result.schedule.slice(0, 10);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-display text-lg font-semibold text-foreground">
              Loan details
            </h2>
            <div className="mt-6 space-y-7">
              <RangeField
                id="principal"
                label="Loan amount"
                value={inputs.principal}
                onChange={set("principal")}
                min={1000}
                max={2000000}
                step={1000}
                prefix="$"
              />
              <RangeField
                id="annualRate"
                label="Interest rate"
                value={inputs.annualRate}
                onChange={set("annualRate")}
                min={0}
                max={36}
                step={0.1}
                suffix="%"
              />
              <RangeField
                id="tenureMonths"
                label="Loan tenure"
                value={inputs.tenureMonths}
                onChange={set("tenureMonths")}
                min={6}
                max={360}
                step={6}
                suffix="mo"
                hint={formatDuration(inputs.tenureMonths)}
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
              <p className="text-sm text-muted">Monthly EMI</p>
              <p className="mt-1 font-mono text-4xl font-bold text-foreground sm:text-5xl">
                {formatCurrency(result.monthlyPayment, { decimals: 2 })}
              </p>
              <p className="mt-1 text-xs text-faint">
                for {formatDuration(inputs.tenureMonths)}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <DonutChart
                centerLabel="Total payable"
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
                  label="Principal"
                  value={formatCurrency(result.principal)}
                />
                <Stat
                  label="Total interest"
                  value={formatCurrency(result.totalInterest)}
                />
                <Stat
                  label="Total payable"
                  value={formatCurrency(result.totalPayment)}
                />
                <Stat
                  label="Interest as % of principal"
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

      {result.schedule.length > 1 && (
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display text-lg font-semibold text-foreground">
            Amortization schedule
          </h2>
          <p className="mt-1 text-sm text-muted">
            Early instalments are mostly interest; principal grows over time.
          </p>
          <div className="mt-6">
            <AmortizationChart data={result.schedule} />
          </div>
        </div>
      )}

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
              {visible.map((row) => (
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
