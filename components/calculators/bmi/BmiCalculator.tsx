"use client";

import { useMemo, useState } from "react";
import { useUrlState } from "@/lib/useUrlState";
import { calculateBmi, type BmiCategory } from "@/lib/calculatorEngine/bmi";
import { kgToLb, type UnitSystem } from "@/lib/calculatorEngine/units";
import { BodyMetricsFields } from "@/components/calculators/health/BodyMetricsFields";
import { BmiScale } from "@/components/calculators/bmi/BmiScale";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Stat } from "@/components/calculators/ResultStat";
import { cn } from "@/lib/utils";

interface Inputs {
  unit: UnitSystem;
  weightKg: number;
  heightCm: number;
}

const DEFAULTS: Inputs = { unit: "metric", weightKg: 70, heightCm: 175 };

const CATEGORY_STYLE: Record<BmiCategory, string> = {
  Underweight: "text-sky-400 bg-sky-400/10 border-sky-400/30",
  "Normal weight": "text-primary bg-primary/10 border-primary/30",
  Overweight: "text-amber-500 bg-amber-500/10 border-amber-500/30",
  Obese: "text-red-500 bg-red-500/10 border-red-500/30",
};

export function BmiCalculator() {
  const [inputs, setInputs] = useState<Inputs>(DEFAULTS);
  const [copied, setCopied] = useState(false);
  // Hydrate from the URL and mirror changes back once the visitor edits a value.
  useUrlState(
    inputs,
    () => {
      const p = new URLSearchParams(window.location.search);
      const next = { ...DEFAULTS };
      const w = parseFloat(p.get("weightKg") ?? "");
      const h = parseFloat(p.get("heightCm") ?? "");
      const u = p.get("unit");
      if (Number.isFinite(w)) next.weightKg = w;
      if (Number.isFinite(h)) next.heightCm = h;
      if (u === "metric" || u === "imperial") next.unit = u;
      return next;
    },
    (state) => {
      const p = new URLSearchParams({
        unit: state.unit,
        weightKg: state.weightKg.toFixed(1),
        heightCm: state.heightCm.toFixed(1),
      });
      return p.toString();
    },
    setInputs,
  );

  const result = useMemo(
    () => calculateBmi(inputs.weightKg, inputs.heightCm),
    [inputs.weightKg, inputs.heightCm],
  );

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }

  const fmtWeight = (kg: number) =>
    inputs.unit === "metric"
      ? `${Math.round(kg)} kg`
      : `${Math.round(kgToLb(kg))} lb`;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
      {/* Inputs */}
      <div className="lg:col-span-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display text-lg font-semibold text-foreground">
            Your measurements
          </h2>
          <div className="mt-6 space-y-7">
            <BodyMetricsFields
              unit={inputs.unit}
              onUnitChange={(unit) => setInputs((p) => ({ ...p, unit }))}
              weightKg={inputs.weightKg}
              onWeightKgChange={(weightKg) =>
                setInputs((p) => ({ ...p, weightKg }))
              }
              heightCm={inputs.heightCm}
              onHeightCmChange={(heightCm) =>
                setInputs((p) => ({ ...p, heightCm }))
              }
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

      {/* Results */}
      <div className="lg:col-span-3">
        <div className="flex h-full flex-col gap-6 rounded-2xl border border-border bg-card p-6">
          <div className="flex flex-wrap items-end justify-between gap-4 rounded-xl bg-gradient-to-br from-primary/10 to-transparent p-5">
            <div>
              <p className="text-sm text-muted">Your BMI</p>
              <p className="mt-1 font-mono text-5xl font-bold text-foreground">
                {Number.isFinite(result.bmi) ? result.bmi.toFixed(1) : "—"}
              </p>
            </div>
            <span
              className={cn(
                "rounded-full border px-3 py-1 text-sm font-semibold",
                CATEGORY_STYLE[result.category],
              )}
            >
              {result.category}
            </span>
          </div>

          <div>
            <BmiScale bmi={result.bmi} />
          </div>

          <dl className="space-y-3">
            <Stat
              label="Healthy weight for your height"
              value={`${fmtWeight(result.healthyMinKg)} – ${fmtWeight(result.healthyMaxKg)}`}
            />
            <Stat label="BMI category" value={result.category} />
          </dl>

          <p className="mt-auto text-xs leading-6 text-faint">
            BMI is a screening tool, not a diagnosis. It doesn&apos;t distinguish
            muscle from fat or account for age, sex and body composition. For a
            full picture, speak with a healthcare professional.
          </p>
        </div>
      </div>
    </div>
  );
}
