"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { evaluate, type AngleMode } from "@/lib/calculatorEngine/scientific";
import { useUrlState } from "@/lib/useUrlState";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HistoryEntry {
  expr: string;
  value: number;
}

const DEFAULT_ANGLE: AngleMode = "deg";
const MAX_HISTORY = 12;

/**
 * Multi-character tokens the inserts produce — removed whole by backspace.
 * Ordered longest/most-specific first so e.g. "asinh(" matches before "sinh(".
 */
const FUNCTION_TOKENS = [
  "asinh(",
  "acosh(",
  "atanh(",
  "asin(",
  "acos(",
  "atan(",
  "sinh(",
  "cosh(",
  "tanh(",
  "sin(",
  "cos(",
  "tan(",
  "log(",
  "ln(",
  "exp(",
  "abs(",
  "10^(",
  "e^(",
  "√(",
  "mod",
  "⁻¹",
];

/** Formats a computed value for the display: grouped, trimmed, exp when extreme. */
function formatResult(n: number): string {
  if (!Number.isFinite(n)) return "—";
  const abs = Math.abs(n);
  if (abs !== 0 && (abs >= 1e15 || abs < 1e-6)) {
    return n.toExponential(8).replace(/\.?0+e/, "e");
  }
  const rounded = Number(n.toPrecision(12));
  return rounded.toLocaleString("en-US", { maximumFractionDigits: 10 });
}

/** A plain, re-parseable string of a value, for chaining after "=". */
function toChainString(n: number): string {
  return String(Number(n.toPrecision(12)));
}

/**
 * Toggles the sign of the number at the end of the expression. A best-effort
 * "±" for the common case of negating the value just entered.
 */
function toggleSign(expr: string): string {
  const match = expr.match(/(\d*\.?\d+(?:[eE][+-]?\d+)?|π|e)$/);
  if (!match) return expr + "−";
  const numStart = match.index!;
  const before = expr[numStart - 1];
  const beforeBefore = expr[numStart - 2];
  // A "−" right before the number is a sign only if it follows an operator,
  // an opening bracket, or starts the expression — then we strip it.
  const signIsUnary =
    (before === "−" || before === "-") &&
    (numStart - 1 === 0 ||
      beforeBefore === undefined ||
      /[+\-−×÷^(]/.test(beforeBefore));
  if (signIsUnary) {
    return expr.slice(0, numStart - 1) + expr.slice(numStart);
  }
  return expr.slice(0, numStart) + "−" + expr.slice(numStart);
}

export function ScientificCalculator() {
  const [expression, setExpression] = useState("");
  const [angle, setAngle] = useState<AngleMode>(DEFAULT_ANGLE);
  const [inv, setInv] = useState(false);
  const [hyp, setHyp] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  // After "=", the next value-key starts fresh while an operator chains on.
  const justEvaluated = useRef(false);

  // Hydrate expression + angle from the URL (?expr=…&angle=…) and mirror changes
  // back once the visitor edits — the URL stays clean until then.
  const urlState = useMemo(() => ({ expression, angle }), [expression, angle]);
  useUrlState(
    urlState,
    () => {
      const p = new URLSearchParams(window.location.search);
      const a = p.get("angle");
      return {
        expression: p.get("expr") ?? "",
        angle: a === "deg" || a === "rad" ? a : DEFAULT_ANGLE,
      };
    },
    (s) => {
      const p = new URLSearchParams();
      if (s.expression) p.set("expr", s.expression);
      p.set("angle", s.angle);
      return p.toString();
    },
    (s) => {
      setExpression(s.expression);
      setAngle(s.angle);
    },
  );

  const result = useMemo(() => evaluate(expression, angle), [expression, angle]);

  // ── Input handlers ───────────────────────────────────────────────────────

  const insert = useCallback((text: string, startsValue: boolean) => {
    setNotice(null);
    setExpression((prev) => {
      if (justEvaluated.current) {
        justEvaluated.current = false;
        // A new value replaces the previous answer; an operator continues it.
        return startsValue ? text : prev + text;
      }
      return prev + text;
    });
  }, []);

  const clearAll = useCallback(() => {
    justEvaluated.current = false;
    setNotice(null);
    setExpression("");
  }, []);

  const backspace = useCallback(() => {
    justEvaluated.current = false;
    setNotice(null);
    setExpression((prev) => {
      const token = FUNCTION_TOKENS.find((t) => prev.endsWith(t));
      return token ? prev.slice(0, -token.length) : prev.slice(0, -1);
    });
  }, []);

  const negate = useCallback(() => {
    justEvaluated.current = false;
    setNotice(null);
    setExpression((prev) => toggleSign(prev));
  }, []);

  const equals = useCallback(() => {
    const r = evaluate(expression, angle);
    if (r.value === null) {
      if (expression.trim()) setNotice(r.error ?? "Error");
      return;
    }
    setHistory((prev) =>
      [{ expr: expression, value: r.value! }, ...prev].slice(0, MAX_HISTORY),
    );
    setExpression(toChainString(r.value));
    justEvaluated.current = true;
    setNotice(null);
  }, [expression, angle]);

  // Physical keyboard support — only when no input/textarea is focused.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const el = document.activeElement;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA")) return;

      const { key } = e;
      if (/^[0-9]$/.test(key) || key === ".") {
        insert(key, true);
      } else if (key === "+") {
        insert("+", false);
      } else if (key === "-") {
        insert("−", false);
      } else if (key === "*") {
        insert("×", false);
      } else if (key === "/") {
        e.preventDefault();
        insert("÷", false);
      } else if (key === "^") {
        insert("^", false);
      } else if (key === "(" || key === ")") {
        insert(key, key === "(");
      } else if (key === "!" || key === "%") {
        insert(key, false);
      } else if (key === "Enter" || key === "=") {
        e.preventDefault();
        equals();
      } else if (key === "Backspace") {
        e.preventDefault();
        backspace();
      } else if (key === "Escape") {
        clearAll();
      } else {
        return;
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [insert, equals, backspace, clearAll]);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — no-op */
    }
  }

  function reset() {
    clearAll();
    setAngle(DEFAULT_ANGLE);
    setInv(false);
    setHyp(false);
    setHistory([]);
  }

  // sin/cos/tan keys flip through inverse (INV) and hyperbolic (hyp) variants.
  const trigInsert = (fn: "sin" | "cos" | "tan") =>
    `${inv ? "a" : ""}${fn}${hyp ? "h" : ""}(`;
  const trigLabel = (fn: "sin" | "cos" | "tan") => {
    const base = `${fn}${hyp ? "h" : ""}`;
    return inv ? <Sup base={base} exp="−1" /> : base;
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
      {/* Calculator */}
      <div className="lg:col-span-3">
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
          {/* Mode controls */}
          <div className="flex items-center gap-3">
            <SegmentedControl
              ariaLabel="Angle unit"
              className="max-w-[12rem]"
              options={[
                { value: "deg", label: "DEG" },
                { value: "rad", label: "RAD" },
              ]}
              value={angle}
              onChange={(v) => setAngle(v)}
            />
            <button
              type="button"
              aria-pressed={hyp}
              onClick={() => setHyp((v) => !v)}
              className={cn(
                "ml-auto inline-flex h-10 items-center rounded-lg border px-4 text-sm font-medium transition-colors",
                hyp
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border text-muted hover:text-foreground",
              )}
            >
              hyp
            </button>
            <button
              type="button"
              aria-pressed={inv}
              onClick={() => setInv((v) => !v)}
              className={cn(
                "inline-flex h-10 items-center gap-2 rounded-lg border px-4 text-sm font-medium transition-colors",
                inv
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border text-muted hover:text-foreground",
              )}
            >
              <Icon name="fa-arrows-up-down" className="text-xs" />
              INV
            </button>
          </div>

          {/* Display */}
          <div className="mt-4 rounded-xl border border-border bg-background p-4">
            <div className="min-h-[1.5rem] overflow-x-auto whitespace-nowrap text-right font-mono text-sm text-muted">
              {expression || <span className="text-faint">0</span>}
            </div>
            <div
              className={cn(
                "mt-1 overflow-x-auto whitespace-nowrap text-right font-mono text-3xl font-bold sm:text-4xl",
                notice ? "text-red-500" : "text-foreground",
              )}
            >
              {notice
                ? notice
                : result.value !== null
                  ? `= ${formatResult(result.value)}`
                  : " "}
            </div>
          </div>

          {/* Keypad */}
          <div className="mt-4 grid grid-cols-5 gap-2">
            <KeyBtn kind="fn" onClick={() => setInv((v) => !v)} active={inv} ariaLabel="Inverse functions">
              INV
            </KeyBtn>
            <KeyBtn kind="fn" onClick={() => insert("(", true)} ariaLabel="Open bracket">
              (
            </KeyBtn>
            <KeyBtn kind="fn" onClick={() => insert(")", false)} ariaLabel="Close bracket">
              )
            </KeyBtn>
            <KeyBtn kind="fn" onClick={() => insert("%", false)} ariaLabel="Percent">
              %
            </KeyBtn>
            <KeyBtn kind="danger" onClick={clearAll} ariaLabel="All clear">
              AC
            </KeyBtn>

            <KeyBtn
              kind="fn"
              onClick={() => insert(trigInsert("sin"), true)}
              ariaLabel={trigInsert("sin").slice(0, -1)}
            >
              {trigLabel("sin")}
            </KeyBtn>
            <KeyBtn
              kind="fn"
              onClick={() => insert(trigInsert("cos"), true)}
              ariaLabel={trigInsert("cos").slice(0, -1)}
            >
              {trigLabel("cos")}
            </KeyBtn>
            <KeyBtn
              kind="fn"
              onClick={() => insert(trigInsert("tan"), true)}
              ariaLabel={trigInsert("tan").slice(0, -1)}
            >
              {trigLabel("tan")}
            </KeyBtn>
            <KeyBtn kind="op" onClick={() => insert("^", false)} ariaLabel="Power">
              <Sup base="x" exp="y" />
            </KeyBtn>
            <KeyBtn kind="op" onClick={() => insert("÷", false)} ariaLabel="Divide">
              ÷
            </KeyBtn>

            <KeyBtn
              kind="fn"
              onClick={() => insert(inv ? "e^(" : "ln(", inv)}
              ariaLabel={inv ? "e to the power" : "Natural logarithm"}
            >
              {inv ? <Sup base="e" exp="x" /> : "ln"}
            </KeyBtn>
            <KeyBtn
              kind="fn"
              onClick={() => insert(inv ? "10^(" : "log(", inv)}
              ariaLabel={inv ? "10 to the power" : "Logarithm base 10"}
            >
              {inv ? <Sup base="10" exp="x" /> : "log"}
            </KeyBtn>
            <KeyBtn
              kind="fn"
              onClick={() => insert(inv ? "^2" : "√(", !inv)}
              ariaLabel={inv ? "Square" : "Square root"}
            >
              {inv ? <Sup base="x" exp="2" /> : "√"}
            </KeyBtn>
            <KeyBtn kind="fn" onClick={() => insert("!", false)} ariaLabel="Factorial">
              x!
            </KeyBtn>
            <KeyBtn kind="op" onClick={() => insert("×", false)} ariaLabel="Multiply">
              ×
            </KeyBtn>

            <KeyBtn kind="fn" onClick={() => insert("⁻¹", false)} ariaLabel="Reciprocal (1 over x)">
              1/x
            </KeyBtn>
            <KeyBtn kind="fn" onClick={() => insert("√", false)} ariaLabel="Nth root">
              <span>
                <sup className="text-[0.65em]">y</sup>√x
              </span>
            </KeyBtn>
            <KeyBtn kind="fn" onClick={() => insert("mod", false)} ariaLabel="Modulo (remainder)">
              mod
            </KeyBtn>
            <KeyBtn kind="fn" onClick={() => insert("P", false)} ariaLabel="Permutations nPr">
              nPr
            </KeyBtn>
            <KeyBtn kind="fn" onClick={() => insert("C", false)} ariaLabel="Combinations nCr">
              nCr
            </KeyBtn>

            <KeyBtn kind="fn" onClick={() => insert("π", true)} ariaLabel="Pi">
              π
            </KeyBtn>
            <KeyBtn kind="num" onClick={() => insert("7", true)}>7</KeyBtn>
            <KeyBtn kind="num" onClick={() => insert("8", true)}>8</KeyBtn>
            <KeyBtn kind="num" onClick={() => insert("9", true)}>9</KeyBtn>
            <KeyBtn kind="op" onClick={() => insert("−", false)} ariaLabel="Subtract">
              −
            </KeyBtn>

            <KeyBtn kind="fn" onClick={() => insert("e", true)} ariaLabel="Euler's number">
              e
            </KeyBtn>
            <KeyBtn kind="num" onClick={() => insert("4", true)}>4</KeyBtn>
            <KeyBtn kind="num" onClick={() => insert("5", true)}>5</KeyBtn>
            <KeyBtn kind="num" onClick={() => insert("6", true)}>6</KeyBtn>
            <KeyBtn kind="op" onClick={() => insert("+", false)} ariaLabel="Add">
              +
            </KeyBtn>

            <KeyBtn kind="fn" onClick={negate} ariaLabel="Toggle sign">
              ±
            </KeyBtn>
            <KeyBtn kind="num" onClick={() => insert("1", true)}>1</KeyBtn>
            <KeyBtn kind="num" onClick={() => insert("2", true)}>2</KeyBtn>
            <KeyBtn kind="num" onClick={() => insert("3", true)}>3</KeyBtn>
            <KeyBtn
              kind="equals"
              onClick={equals}
              ariaLabel="Equals"
              className="row-span-2"
            >
              =
            </KeyBtn>

            <KeyBtn kind="action" onClick={backspace} ariaLabel="Delete">
              <Icon name="fa-delete-left" />
            </KeyBtn>
            <KeyBtn kind="num" onClick={() => insert("0", true)} className="col-span-2">
              0
            </KeyBtn>
            <KeyBtn kind="num" onClick={() => insert(".", true)} ariaLabel="Decimal point">
              .
            </KeyBtn>
          </div>
        </div>
      </div>

      {/* History & actions */}
      <div className="lg:col-span-2">
        <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-foreground">
              History
            </h2>
            {history.length > 0 && (
              <button
                onClick={() => setHistory([])}
                className="text-sm font-medium text-muted hover:text-foreground"
              >
                Clear
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <p className="mt-4 text-sm leading-7 text-faint">
              Your calculations appear here. Tap any result to reuse it. You can
              also type with your keyboard — including{" "}
              <span className="font-mono text-muted">( )</span>,{" "}
              <span className="font-mono text-muted">^</span> and{" "}
              <span className="font-mono text-muted">Enter</span> to evaluate.
            </p>
          ) : (
            <ul className="mt-4 space-y-2">
              {history.map((h, i) => (
                <li key={i}>
                  <button
                    onClick={() => {
                      justEvaluated.current = false;
                      setNotice(null);
                      setExpression(h.expr);
                    }}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-right transition-colors hover:border-border-strong hover:bg-card-hover"
                  >
                    <span className="block truncate font-mono text-xs text-muted">
                      {h.expr}
                    </span>
                    <span className="block truncate font-mono text-sm font-medium text-foreground">
                      = {formatResult(h.value)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-6 flex items-center gap-3 border-t border-border pt-5">
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
              onClick={reset}
              aria-label="Reset calculator"
            >
              <Icon name="fa-rotate-left" />
              Reset
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/** A keypad button. `kind` picks the brand colour treatment. */
function KeyBtn({
  kind,
  onClick,
  className,
  ariaLabel,
  active,
  children,
}: {
  kind: "num" | "op" | "fn" | "equals" | "action" | "danger";
  onClick: () => void;
  className?: string;
  ariaLabel?: string;
  active?: boolean;
  children: ReactNode;
}) {
  const styles: Record<typeof kind, string> = {
    num: "border-border bg-background text-foreground hover:bg-card-hover",
    op: "border-primary/20 bg-primary/10 text-primary hover:bg-primary/20",
    fn: "border-border bg-background text-muted hover:text-foreground text-sm",
    action: "border-border bg-background text-faint hover:text-foreground",
    danger: "border-red-500/20 bg-red-500/10 text-red-500 hover:bg-red-500/20",
    equals:
      "border-transparent bg-gradient-to-t from-primary to-primary-to text-primary-foreground font-semibold",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={cn(
        "flex h-12 items-center justify-center rounded-xl border font-mono text-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card sm:h-14",
        styles[kind],
        active && kind === "fn" && "border-primary/40 bg-primary/10 text-primary",
        className,
      )}
    >
      {children}
    </button>
  );
}

/** Renders a base with a small superscript, e.g. xʸ, sin⁻¹, 10ˣ. */
function Sup({ base, exp }: { base: string; exp: string }) {
  return (
    <span>
      {base}
      <sup className="text-[0.65em]">{exp}</sup>
    </span>
  );
}
