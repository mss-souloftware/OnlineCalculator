"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  CATEGORIES,
  convert,
  getCategory,
  type UnitCategory,
} from "@/lib/calculatorEngine/unit-converter";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Inputs {
  categoryId: string;
  fromId: string;
  toId: string;
  amount: number;
}

function defaultsFor(category: UnitCategory): Pick<Inputs, "fromId" | "toId"> {
  return { fromId: category.units[0].id, toId: category.units[1].id };
}

const DEFAULTS: Inputs = {
  categoryId: "length",
  fromId: "m",
  toId: "ft",
  amount: 1,
};

function readParams(): Inputs {
  const p = new URLSearchParams(window.location.search);
  const category = getCategory(p.get("cat") ?? "") ?? getCategory(DEFAULTS.categoryId)!;
  const has = (id: string | null) => category.units.some((u) => u.id === id);
  const from = has(p.get("from")) ? p.get("from")! : category.units[0].id;
  const to = has(p.get("to")) ? p.get("to")! : category.units[1].id;
  const amount = parseFloat(p.get("amt") ?? "");
  return {
    categoryId: category.id,
    fromId: from,
    toId: to,
    amount: Number.isFinite(amount) ? amount : DEFAULTS.amount,
  };
}

/** Up to 7 significant figures, grouped; exponential for very large/small. */
function fmt(n: number): string {
  if (!Number.isFinite(n)) return "—";
  if (n === 0) return "0";
  const abs = Math.abs(n);
  if (abs >= 1e12 || abs < 1e-6) return n.toExponential(4).replace(/\.?0+e/, "e");
  return Number(n.toPrecision(7)).toLocaleString("en-US", {
    maximumFractionDigits: 6,
  });
}

export function UnitConverter() {
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
      cat: inputs.categoryId,
      from: inputs.fromId,
      to: inputs.toId,
      amt: String(inputs.amount),
    });
    window.history.replaceState(null, "", `${window.location.pathname}?${p}`);
  }, [inputs]);

  const category = getCategory(inputs.categoryId)!;
  const fromUnit = category.units.find((u) => u.id === inputs.fromId)!;
  const toUnit = category.units.find((u) => u.id === inputs.toId)!;

  const converted = useMemo(
    () => convert(inputs.categoryId, inputs.amount, inputs.fromId, inputs.toId),
    [inputs],
  );

  // 1 fromUnit expressed in toUnit — the conversion rate shown under the result.
  const unitRate = useMemo(
    () => convert(inputs.categoryId, 1, inputs.fromId, inputs.toId),
    [inputs.categoryId, inputs.fromId, inputs.toId],
  );

  function selectCategory(c: UnitCategory) {
    setInputs((prev) => ({ ...prev, categoryId: c.id, ...defaultsFor(c) }));
  }

  function swap() {
    setInputs((prev) => ({
      ...prev,
      fromId: prev.toId,
      toId: prev.fromId,
      amount: convert(prev.categoryId, prev.amount, prev.fromId, prev.toId),
    }));
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

  return (
    <div className="space-y-6">
      {/* Category picker */}
      <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => {
            const active = c.id === inputs.categoryId;
            return (
              <button
                key={c.id}
                type="button"
                aria-pressed={active}
                onClick={() => selectCategory(c)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors",
                  active
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-border text-muted hover:border-border-strong hover:text-foreground",
                )}
              >
                <Icon name={c.icon} className="text-xs" fixedWidth />
                {c.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Converter */}
        <div className="lg:col-span-3">
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="grid grid-cols-1 items-end gap-4 sm:grid-cols-[1fr_auto_1fr]">
              {/* From */}
              <div>
                <label
                  htmlFor="amount"
                  className="text-xs font-medium uppercase tracking-wide text-faint"
                >
                  From
                </label>
                <input
                  id="amount"
                  type="number"
                  inputMode="decimal"
                  value={Number.isNaN(inputs.amount) ? "" : inputs.amount}
                  onChange={(e) =>
                    setInputs((prev) => ({
                      ...prev,
                      amount: Number(e.target.value) || 0,
                    }))
                  }
                  className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2.5 font-mono text-lg text-foreground transition-colors hover:border-border-strong focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                />
                <UnitSelect
                  label="Convert from unit"
                  category={category}
                  value={inputs.fromId}
                  onChange={(fromId) => setInputs((prev) => ({ ...prev, fromId }))}
                />
              </div>

              {/* Swap */}
              <div className="flex justify-center sm:pb-1">
                <button
                  type="button"
                  onClick={swap}
                  aria-label="Swap units"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border text-muted transition-colors hover:border-primary/60 hover:text-primary"
                >
                  <Icon name="fa-right-left" />
                </button>
              </div>

              {/* To */}
              <div>
                <span className="text-xs font-medium uppercase tracking-wide text-faint">
                  To
                </span>
                <div className="mt-2 w-full overflow-x-auto rounded-lg border border-border bg-background px-3 py-2.5 font-mono text-lg font-semibold text-foreground">
                  {fmt(converted)}
                </div>
                <UnitSelect
                  label="Convert to unit"
                  category={category}
                  value={inputs.toId}
                  onChange={(toId) => setInputs((prev) => ({ ...prev, toId }))}
                />
              </div>
            </div>

            <div className="mt-6 rounded-xl bg-gradient-to-br from-primary/10 to-transparent p-4">
              <p className="font-mono text-sm text-muted">
                <span className="font-semibold text-foreground">
                  {fmt(inputs.amount)} {fromUnit.symbol}
                </span>{" "}
                ={" "}
                <span className="font-semibold text-foreground">
                  {fmt(converted)} {toUnit.symbol}
                </span>
              </p>
              <p className="mt-1 text-xs text-faint">
                1 {fromUnit.symbol} = {fmt(unitRate)} {toUnit.symbol}
              </p>
            </div>

            <div className="mt-6 flex items-center gap-3 border-t border-border pt-5">
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

        {/* All units in this category */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-display text-lg font-semibold text-foreground">
              {fmt(inputs.amount)} {fromUnit.symbol} in {category.name.toLowerCase()}
            </h2>
            <dl className="mt-4 space-y-3">
              {category.units.map((u) => (
                <div
                  key={u.id}
                  className={cn(
                    "flex items-baseline justify-between gap-4 border-b border-border/60 pb-3 last:border-0 last:pb-0",
                    u.id === inputs.toId && "text-primary",
                  )}
                >
                  <dt className="text-sm text-muted">
                    {u.name}{" "}
                    <span className="text-faint">({u.symbol})</span>
                  </dt>
                  <dd
                    className={cn(
                      "font-mono text-sm font-medium",
                      u.id === inputs.toId ? "text-primary" : "text-foreground",
                    )}
                  >
                    {fmt(convert(inputs.categoryId, inputs.amount, inputs.fromId, u.id))}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

function UnitSelect({
  label,
  category,
  value,
  onChange,
}: {
  label: string;
  category: UnitCategory;
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="relative mt-2">
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-lg border border-border bg-background py-2.5 pl-3 pr-9 text-sm text-foreground transition-colors hover:border-border-strong focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {category.units.map((u) => (
          <option key={u.id} value={u.id}>
            {u.name} ({u.symbol})
          </option>
        ))}
      </select>
      <Icon
        name="fa-chevron-down"
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-faint"
      />
    </div>
  );
}
