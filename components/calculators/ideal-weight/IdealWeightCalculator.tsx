"use client";

import { useMemo, useState } from "react";
import { useUrlState } from "@/lib/useUrlState";
import {
  calculateIdealWeight,
  type FrameSize,
  type Gender,
} from "@/lib/calculatorEngine/ideal-weight";
import { kgToLb, type UnitSystem } from "@/lib/calculatorEngine/units";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { LengthField } from "@/components/calculators/health/LengthField";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Stat } from "@/components/calculators/ResultStat";

interface Inputs {
  unit: UnitSystem;
  gender: Gender;
  heightCm: number;
  frame: FrameSize;
}

const DEFAULTS: Inputs = {
  unit: "metric",
  gender: "male",
  heightCm: 175,
  frame: "medium",
};

export function IdealWeightCalculator() {
  const [inputs, setInputs] = useState<Inputs>(DEFAULTS);
  const [copied, setCopied] = useState(false);
  // Hydrate from the URL and mirror changes back once the visitor edits a value.
  useUrlState(
    inputs,
    () => {
      const p = new URLSearchParams(window.location.search);
      const next = { ...DEFAULTS };
      const h = parseFloat(p.get("heightCm") ?? "");
      if (Number.isFinite(h)) next.heightCm = h;
      const u = p.get("unit");
      if (u === "metric" || u === "imperial") next.unit = u;
      const g = p.get("gender");
      if (g === "male" || g === "female") next.gender = g;
      const f = p.get("frame");
      if (f === "small" || f === "medium" || f === "large") next.frame = f;
      return next;
    },
    (state) => {
      const p = new URLSearchParams({
        unit: state.unit,
        gender: state.gender,
        heightCm: state.heightCm.toFixed(1),
        frame: state.frame,
      });
      return p.toString();
    },
    setInputs,
  );

  const result = useMemo(() => calculateIdealWeight(inputs), [inputs]);

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

  const fmtWeight = (kg: number) =>
    inputs.unit === "metric"
      ? `${kg.toFixed(1)} kg`
      : `${Math.round(kgToLb(kg))} lb`;
  const maxKg = Math.max(...result.formulas.map((f) => f.weightKg), 1);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
      {/* Inputs */}
      <div className="lg:col-span-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display text-lg font-semibold text-foreground">
            Your details
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
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Body frame
              </label>
              <SegmentedControl<FrameSize>
                ariaLabel="Body frame"
                value={inputs.frame}
                onChange={update("frame")}
                options={[
                  { value: "small", label: "Small" },
                  { value: "medium", label: "Medium" },
                  { value: "large", label: "Large" },
                ]}
              />
              <p className="mt-1.5 text-xs text-faint">
                Larger frames carry more weight at the same height.
              </p>
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
            <p className="text-sm text-muted">Estimated ideal weight</p>
            <p className="mt-1 font-mono text-4xl font-bold text-foreground sm:text-5xl">
              {fmtWeight(result.recommendedKg)}
            </p>
            <p className="mt-1 text-xs text-faint">
              average of four formulas, {inputs.frame} frame
            </p>
          </div>

          <div>
            <p className="mb-3 text-sm font-medium text-foreground">
              By formula
            </p>
            <ul className="space-y-3">
              {result.formulas.map((f) => (
                <li key={f.name}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted">{f.name}</span>
                    <span className="font-mono text-foreground">
                      {fmtWeight(f.weightKg)}
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-background">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-primary-to"
                      style={{ width: `${(f.weightKg / maxKg) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <dl className="space-y-3 border-t border-border pt-4">
            <Stat
              label="Healthy BMI range for your height"
              value={`${fmtWeight(result.healthyMinKg)} – ${fmtWeight(result.healthyMaxKg)}`}
            />
          </dl>

          <p className="mt-auto text-xs leading-6 text-faint">
            “Ideal weight” formulas are population guides, not personal targets.
            They don&apos;t account for muscle, age or build — use them as a
            reference alongside professional advice.
          </p>
        </div>
      </div>
    </div>
  );
}
