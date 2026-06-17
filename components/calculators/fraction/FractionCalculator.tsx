"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  calculateFraction,
  fractionText,
  mixedPartsText,
  type MixedInput,
  type Operation,
} from "@/lib/calculatorEngine/fraction";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Stat } from "@/components/calculators/ResultStat";

interface Inputs {
  a: MixedInput;
  b: MixedInput;
  op: Operation;
}

const DEFAULTS: Inputs = {
  a: { whole: 0, numerator: 1, denominator: 2 },
  b: { whole: 0, numerator: 1, denominator: 3 },
  op: "add",
};

const OPS: { value: Operation; label: string }[] = [
  { value: "add", label: "+" },
  { value: "subtract", label: "−" },
  { value: "multiply", label: "×" },
  { value: "divide", label: "÷" },
];

const OP_SYMBOL: Record<Operation, string> = {
  add: "+",
  subtract: "−",
  multiply: "×",
  divide: "÷",
};

/** Reads inputs from the URL (flattened: a.whole→aw, b.numerator→bn, etc.). */
function readParams(): Inputs {
  const next: Inputs = structuredClone(DEFAULTS);
  const p = new URLSearchParams(window.location.search);
  const get = (key: string, fallback: number) => {
    const v = parseInt(p.get(key) ?? "", 10);
    return Number.isFinite(v) ? v : fallback;
  };
  next.a = { whole: get("aw", 0), numerator: get("an", 1), denominator: get("ad", 2) };
  next.b = { whole: get("bw", 0), numerator: get("bn", 1), denominator: get("bd", 3) };
  const op = p.get("op");
  if (op === "add" || op === "subtract" || op === "multiply" || op === "divide") {
    next.op = op;
  }
  return next;
}

/** A decimal trimmed to at most 6 places (recurring decimals stay readable). */
function formatDecimal(n: number): string {
  if (!Number.isFinite(n)) return "—";
  return String(Number(n.toFixed(6)));
}

export function FractionCalculator() {
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
      aw: String(inputs.a.whole),
      an: String(inputs.a.numerator),
      ad: String(inputs.a.denominator),
      bw: String(inputs.b.whole),
      bn: String(inputs.b.numerator),
      bd: String(inputs.b.denominator),
      op: inputs.op,
    });
    window.history.replaceState(null, "", `${window.location.pathname}?${p}`);
  }, [inputs]);

  const result = useMemo(
    () => calculateFraction(inputs.a, inputs.b, inputs.op),
    [inputs],
  );

  const setOperand =
    (which: "a" | "b", field: keyof MixedInput) => (value: number) =>
      setInputs((prev) => ({
        ...prev,
        [which]: { ...prev[which], [field]: value },
      }));

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
          <h2 className="font-display text-lg font-semibold text-foreground">
            Enter your fractions
          </h2>

          <div className="mt-6">
            <SegmentedControl
              ariaLabel="Operation"
              options={OPS}
              value={inputs.op}
              onChange={(op) => setInputs((prev) => ({ ...prev, op }))}
            />
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
            <FractionField
              legend="First fraction"
              prefix="a"
              value={inputs.a}
              onChange={(field, v) => setOperand("a", field)(v)}
            />
            <span
              aria-hidden
              className="font-mono text-2xl font-bold text-primary"
            >
              {OP_SYMBOL[inputs.op]}
            </span>
            <FractionField
              legend="Second fraction"
              prefix="b"
              value={inputs.b}
              onChange={(field, v) => setOperand("b", field)(v)}
            />
          </div>

          <p className="mt-5 text-center text-xs leading-6 text-faint">
            Leave the whole-number box at 0 for a simple fraction. Use negative
            values for negative fractions.
          </p>

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
          {result.error ? (
            <div className="flex flex-1 flex-col items-center justify-center rounded-xl bg-red-500/5 p-8 text-center">
              <Icon name="fa-triangle-exclamation" className="text-2xl text-red-500" />
              <p className="mt-3 font-medium text-foreground">{result.error}</p>
              <p className="mt-1 text-sm text-muted">
                Adjust the fractions to see a result.
              </p>
            </div>
          ) : (
            <>
              <div className="rounded-xl bg-gradient-to-br from-primary/10 to-transparent p-5">
                <p className="text-sm text-muted">Result</p>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
                  <ResultFraction result={result} />
                  {result.mixed.whole !== 0 && result.mixed.numerator !== 0 && (
                    <span className="font-mono text-lg text-muted">
                      = {mixedPartsText(result.mixed)}
                    </span>
                  )}
                </div>
              </div>

              <dl className="space-y-3">
                <Stat label="Simplified fraction" value={fractionText(result.improper)} />
                <Stat label="Mixed number" value={mixedPartsText(result.mixed)} />
                <Stat label="Decimal" value={formatDecimal(result.decimal)} />
              </dl>

              <div className="border-t border-border pt-5">
                <h3 className="font-display text-base font-semibold text-foreground">
                  Step by step
                </h3>
                {result.steps.length > 0 ? (
                  <ol className="mt-4 space-y-3">
                    {result.steps.map((step, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 font-mono text-xs font-semibold text-primary">
                          {i + 1}
                        </span>
                        <span className="pt-0.5 font-mono text-sm leading-6 text-muted">
                          {step}
                        </span>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="mt-3 text-sm text-muted">
                    These fractions are already in their simplest form.
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/** An editable mixed-number input: whole number beside a stacked fraction. */
function FractionField({
  legend,
  prefix,
  value,
  onChange,
}: {
  legend: string;
  prefix: string;
  value: MixedInput;
  onChange: (field: keyof MixedInput, value: number) => void;
}) {
  return (
    <fieldset className="flex items-center gap-2">
      <legend className="sr-only">{legend}</legend>
      <NumberBox
        id={`${prefix}-whole`}
        label="Whole number"
        value={value.whole}
        onChange={(v) => onChange("whole", v)}
      />
      <div className="flex flex-col items-center">
        <NumberBox
          id={`${prefix}-numerator`}
          label="Numerator"
          value={value.numerator}
          onChange={(v) => onChange("numerator", v)}
        />
        <div className="my-1.5 h-px w-16 bg-border-strong" />
        <NumberBox
          id={`${prefix}-denominator`}
          label="Denominator"
          value={value.denominator}
          onChange={(v) => onChange("denominator", v)}
        />
      </div>
    </fieldset>
  );
}

function NumberBox({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <input
      id={id}
      aria-label={label}
      type="number"
      inputMode="numeric"
      value={Number.isNaN(value) ? "" : value}
      onChange={(e) => onChange(Math.trunc(Number(e.target.value) || 0))}
      className="w-16 rounded-lg border border-border bg-background px-2 py-2 text-center font-mono text-foreground transition-colors hover:border-border-strong focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
    />
  );
}

/** Read-only stacked fraction for the result panel. */
function ResultFraction({ result }: { result: ReturnType<typeof calculateFraction> }) {
  const { numerator, denominator } = result.improper;
  if (denominator === 1) {
    return (
      <span className="font-mono text-5xl font-bold text-foreground">
        {numerator}
      </span>
    );
  }
  return (
    <span className="inline-flex flex-col items-center font-mono font-bold leading-none text-foreground">
      <span className="px-2 text-3xl">{numerator}</span>
      <span className="my-1 h-0.5 w-full bg-foreground" />
      <span className="px-2 text-3xl">{denominator}</span>
    </span>
  );
}
