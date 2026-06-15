"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { calculateCreditCardPayoff } from "@/lib/calculatorEngine/credit-card-payoff";
import { formatCurrency, formatDuration } from "@/lib/format";
import { RangeField } from "@/components/ui/RangeField";
import { DonutChart } from "@/components/charts/DonutChart";
import { AmortizationChart } from "@/components/charts/AmortizationChart";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Stat } from "@/components/calculators/ResultStat";
import { cn } from "@/lib/utils";

interface Inputs {
  balance: number;
  apr: number;
  monthlyPayment: number;
}

const DEFAULTS: Inputs = { balance: 5000, apr: 19.99, monthlyPayment: 200 };
const KEYS = Object.keys(DEFAULTS) as (keyof Inputs)[];

export function CreditCardPayoffCalculator() {
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

  const result = useMemo(() => calculateCreditCardPayoff(inputs), [inputs]);

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
              Your card
            </h2>
            <div className="mt-6 space-y-7">
              <RangeField
                id="balance"
                label="Current balance"
                value={inputs.balance}
                onChange={set("balance")}
                min={100}
                max={100000}
                step={100}
                prefix="$"
              />
              <RangeField
                id="apr"
                label="Interest rate (APR)"
                value={inputs.apr}
                onChange={set("apr")}
                min={0}
                max={36}
                step={0.01}
                suffix="%"
              />
              <RangeField
                id="monthlyPayment"
                label="Monthly payment"
                value={inputs.monthlyPayment}
                onChange={set("monthlyPayment")}
                min={10}
                max={5000}
                step={10}
                prefix="$"
                hint={`Minimum to make progress: more than ${formatCurrency(result.firstMonthInterest, { decimals: 2 })}/mo`}
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
          {result.neverPaysOff ? (
            <div className="flex h-full flex-col justify-center rounded-2xl border border-amber-500/40 bg-amber-500/5 p-8">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/15 text-amber-500">
                <Icon name="fa-triangle-exclamation" className="text-2xl" />
              </span>
              <h2 className="mt-4 font-display text-xl font-bold text-foreground">
                This balance will never be paid off
              </h2>
              <p className="mt-2 leading-7 text-muted">
                At {inputs.apr}% APR, the first month&apos;s interest alone is{" "}
                <span className="font-mono font-medium text-foreground">
                  {formatCurrency(result.firstMonthInterest, { decimals: 2 })}
                </span>
                , which is more than your{" "}
                {formatCurrency(inputs.monthlyPayment)} payment. Increase your
                monthly payment above the interest to start reducing the balance.
              </p>
            </div>
          ) : (
            <div className="flex h-full flex-col gap-6 rounded-2xl border border-border bg-card p-6">
              <div className="rounded-xl bg-gradient-to-br from-primary/10 to-transparent p-5">
                <p className="text-sm text-muted">Time to pay off</p>
                <p className="mt-1 font-mono text-4xl font-bold text-foreground sm:text-5xl">
                  {formatDuration(result.payoffMonths)}
                </p>
                <p className="mt-1 text-xs text-faint">
                  {result.payoffMonths} monthly payments
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <DonutChart
                  centerLabel="Total paid"
                  centerValue={formatCurrency(result.totalPaid)}
                  segments={[
                    {
                      label: "Balance (principal)",
                      value: inputs.balance,
                      color: "var(--primary)",
                      display: formatCurrency(inputs.balance),
                    },
                    {
                      label: "Interest",
                      value: result.totalInterest,
                      color: "var(--faint-foreground)",
                      display: formatCurrency(result.totalInterest),
                    },
                  ]}
                />

                <dl className="space-y-3 self-center">
                  <Stat
                    label="Payoff time"
                    value={formatDuration(result.payoffMonths)}
                  />
                  <Stat
                    label="Total interest"
                    value={formatCurrency(result.totalInterest)}
                  />
                  <Stat
                    label="Total paid"
                    value={formatCurrency(result.totalPaid)}
                  />
                  <Stat
                    label="Interest vs balance"
                    value={
                      inputs.balance > 0
                        ? `${((result.totalInterest / inputs.balance) * 100).toFixed(0)}%`
                        : "—"
                    }
                  />
                </dl>
              </div>
            </div>
          )}
        </div>
      </div>

      {!result.neverPaysOff && result.schedule.length > 1 && (
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display text-lg font-semibold text-foreground">
            Balance over time
          </h2>
          <p className="mt-1 text-sm text-muted">
            How much of each year&apos;s payments clears the balance versus
            interest.
          </p>
          <div className="mt-6">
            <AmortizationChart data={result.schedule} />
          </div>
        </div>
      )}

      {!result.neverPaysOff && (
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display text-lg font-semibold text-foreground">
            Yearly schedule
          </h2>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-faint">
                  <th className="py-2.5 pr-4 font-medium">Year</th>
                  <th className="py-2.5 pr-4 text-right font-medium">
                    Principal
                  </th>
                  <th className="py-2.5 pr-4 text-right font-medium">
                    Interest
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
              {showAll
                ? "Show less"
                : `Show all ${result.schedule.length} years`}
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
      )}
    </div>
  );
}
