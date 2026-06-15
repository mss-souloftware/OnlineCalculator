"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { calculateBodyFat, type Gender } from "@/lib/calculatorEngine/body-fat";
import { kgToLb, type UnitSystem } from "@/lib/calculatorEngine/units";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { LengthField } from "@/components/calculators/health/LengthField";
import { WeightField } from "@/components/calculators/health/WeightField";
import { BodyFatScale } from "@/components/calculators/body-fat/BodyFatScale";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Stat } from "@/components/calculators/ResultStat";
import { cn } from "@/lib/utils";

interface Inputs {
  unit: UnitSystem;
  gender: Gender;
  heightCm: number;
  neckCm: number;
  waistCm: number;
  hipCm: number;
  weightKg: number;
}

const DEFAULTS: Inputs = {
  unit: "metric",
  gender: "male",
  heightCm: 175,
  neckCm: 38,
  waistCm: 90,
  hipCm: 100,
  weightKg: 75,
};

const NUM_KEYS: (keyof Omit<Inputs, "unit" | "gender">)[] = [
  "heightCm",
  "neckCm",
  "waistCm",
  "hipCm",
  "weightKg",
];

const CATEGORY_STYLE: Record<string, string> = {
  "Essential fat": "text-sky-400 bg-sky-400/10 border-sky-400/30",
  Athletes: "text-primary bg-primary/10 border-primary/30",
  Fitness: "text-lime-400 bg-lime-400/10 border-lime-400/30",
  Average: "text-amber-500 bg-amber-500/10 border-amber-500/30",
  Obese: "text-red-500 bg-red-500/10 border-red-500/30",
};

export function BodyFatCalculator() {
  const [inputs, setInputs] = useState<Inputs>(DEFAULTS);
  const [copied, setCopied] = useState(false);
  const hydrated = useRef(false);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const next = { ...DEFAULTS };
    for (const key of NUM_KEYS) {
      const v = parseFloat(p.get(key) ?? "");
      if (Number.isFinite(v)) next[key] = v;
    }
    const u = p.get("unit");
    if (u === "metric" || u === "imperial") next.unit = u;
    const g = p.get("gender");
    if (g === "male" || g === "female") next.gender = g;
    setInputs(next);
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    const p = new URLSearchParams({ unit: inputs.unit, gender: inputs.gender });
    for (const key of NUM_KEYS) p.set(key, inputs[key].toFixed(1));
    window.history.replaceState(null, "", `${window.location.pathname}?${p}`);
  }, [inputs]);

  const result = useMemo(() => calculateBodyFat(inputs), [inputs]);

  const update =
    <K extends keyof Inputs>(key: K) =>
    (value: Inputs[K]) =>
      setInputs((p) => ({ ...p, [key]: value }));

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }

  const isFemale = inputs.gender === "female";
  const fmtWeight = (kg: number) =>
    inputs.unit === "metric"
      ? `${kg.toFixed(1)} kg`
      : `${kgToLb(kg).toFixed(1)} lb`;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
      {/* Inputs */}
      <div className="lg:col-span-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display text-lg font-semibold text-foreground">
            Measurements
          </h2>
          <div className="mt-6 space-y-7">
            <SegmentedControl<Gender>
              ariaLabel="Gender"
              value={inputs.gender}
              onChange={update("gender")}
              options={[
                { value: "male", label: "Male", icon: "fa-mars" },
                { value: "female", label: "Female", icon: "fa-venus" },
              ]}
            />
            <SegmentedControl<UnitSystem>
              ariaLabel="Unit system"
              value={inputs.unit}
              onChange={update("unit")}
              options={[
                { value: "metric", label: "Metric" },
                { value: "imperial", label: "Imperial" },
              ]}
            />
            <LengthField
              id="height"
              label="Height"
              unit={inputs.unit}
              cm={inputs.heightCm}
              onChange={update("heightCm")}
              minCm={120}
              maxCm={220}
            />
            <LengthField
              id="neck"
              label="Neck circumference"
              unit={inputs.unit}
              cm={inputs.neckCm}
              onChange={update("neckCm")}
              minCm={25}
              maxCm={60}
            />
            <LengthField
              id="waist"
              label="Waist circumference"
              unit={inputs.unit}
              cm={inputs.waistCm}
              onChange={update("waistCm")}
              minCm={50}
              maxCm={200}
            />
            {isFemale && (
              <LengthField
                id="hip"
                label="Hip circumference"
                unit={inputs.unit}
                cm={inputs.hipCm}
                onChange={update("hipCm")}
                minCm={70}
                maxCm={180}
              />
            )}
            <WeightField
              unit={inputs.unit}
              kg={inputs.weightKg}
              onChange={update("weightKg")}
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
              <p className="text-sm text-muted">Body fat</p>
              <p className="mt-1 font-mono text-5xl font-bold text-foreground">
                {result.bodyFatPercent.toFixed(1)}
                <span className="text-2xl text-muted">%</span>
              </p>
            </div>
            <span
              className={cn(
                "rounded-full border px-3 py-1 text-sm font-semibold",
                CATEGORY_STYLE[result.category] ?? CATEGORY_STYLE.Average,
              )}
            >
              {result.category}
            </span>
          </div>

          <BodyFatScale bodyFat={result.bodyFatPercent} gender={inputs.gender} />

          <dl className="space-y-3">
            <Stat label="Fat mass" value={fmtWeight(result.fatMassKg)} />
            <Stat label="Lean mass" value={fmtWeight(result.leanMassKg)} />
          </dl>

          <p className="mt-auto text-xs leading-6 text-faint">
            Estimated with the U.S. Navy circumference method. It&apos;s a good
            tape-measure estimate but less precise than a DEXA scan or
            hydrostatic weighing.
          </p>
        </div>
      </div>
    </div>
  );
}
