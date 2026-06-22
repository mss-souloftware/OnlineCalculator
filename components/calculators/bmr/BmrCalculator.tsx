"use client";

import { useMemo, useState } from "react";
import { useUrlState } from "@/lib/useUrlState";
import { calculateBmr, type Gender } from "@/lib/calculatorEngine/bmr";
import { formatNumber } from "@/lib/format";
import { type UnitSystem } from "@/lib/calculatorEngine/units";
import { BodyMetricsFields } from "@/components/calculators/health/BodyMetricsFields";
import { RangeField } from "@/components/ui/RangeField";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Inputs {
  unit: UnitSystem;
  weightKg: number;
  heightCm: number;
  age: number;
  gender: Gender;
  activity: string;
}

const DEFAULTS: Inputs = {
  unit: "metric",
  weightKg: 70,
  heightCm: 175,
  age: 30,
  gender: "male",
  activity: "moderate",
};

export function BmrCalculator() {
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
      const a = parseFloat(p.get("age") ?? "");
      const u = p.get("unit");
      const g = p.get("gender");
      const act = p.get("activity");
      if (Number.isFinite(w)) next.weightKg = w;
      if (Number.isFinite(h)) next.heightCm = h;
      if (Number.isFinite(a)) next.age = a;
      if (u === "metric" || u === "imperial") next.unit = u;
      if (g === "male" || g === "female") next.gender = g;
      if (act) next.activity = act;
      return next;
    },
    (state) => {
      const p = new URLSearchParams({
        unit: state.unit,
        weightKg: state.weightKg.toFixed(1),
        heightCm: state.heightCm.toFixed(1),
        age: String(state.age),
        gender: state.gender,
        activity: state.activity,
      });
      return p.toString();
    },
    setInputs,
  );

  const result = useMemo(
    () =>
      calculateBmr({
        weightKg: inputs.weightKg,
        heightCm: inputs.heightCm,
        age: inputs.age,
        gender: inputs.gender,
      }),
    [inputs.weightKg, inputs.heightCm, inputs.age, inputs.gender],
  );

  const selected =
    result.activityLevels.find((a) => a.key === inputs.activity) ??
    result.activityLevels[2];

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
      {/* Inputs */}
      <div className="lg:col-span-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display text-lg font-semibold text-foreground">
            About you
          </h2>
          <div className="mt-6 space-y-7">
            <SegmentedControl<Gender>
              ariaLabel="Gender"
              value={inputs.gender}
              onChange={(gender) => setInputs((p) => ({ ...p, gender }))}
              options={[
                { value: "male", label: "Male", icon: "fa-mars" },
                { value: "female", label: "Female", icon: "fa-venus" },
              ]}
            />
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
            <RangeField
              id="age"
              label="Age"
              value={inputs.age}
              onChange={(age) => setInputs((p) => ({ ...p, age }))}
              min={15}
              max={100}
              step={1}
              suffix="yrs"
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-gradient-to-br from-primary/10 to-transparent p-5">
              <p className="text-sm text-muted">Your BMR</p>
              <p className="mt-1 font-mono text-4xl font-bold text-foreground">
                {formatNumber(result.bmr)}
              </p>
              <p className="mt-1 text-xs text-faint">calories/day at rest</p>
            </div>
            <div className="rounded-xl border border-border p-5">
              <p className="text-sm text-muted">Maintenance calories</p>
              <p className="mt-1 font-mono text-4xl font-bold text-primary">
                {formatNumber(selected.calories)}
              </p>
              <p className="mt-1 text-xs text-faint">{selected.label} · ×{selected.multiplier}</p>
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-medium text-foreground">
              Daily calories by activity level
            </p>
            <ul className="space-y-2">
              {result.activityLevels.map((a) => {
                const active = a.key === inputs.activity;
                return (
                  <li key={a.key}>
                    <button
                      type="button"
                      onClick={() =>
                        setInputs((p) => ({ ...p, activity: a.key }))
                      }
                      aria-pressed={active}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors",
                        active
                          ? "border-primary/50 bg-primary/10"
                          : "border-border bg-background hover:border-border-strong",
                      )}
                    >
                      <span className="min-w-0">
                        <span className="block text-sm font-medium text-foreground">
                          {a.label}
                        </span>
                        <span className="block truncate text-xs text-faint">
                          {a.description}
                        </span>
                      </span>
                      <span className="ml-auto text-right">
                        <span className="block font-mono text-sm font-semibold text-foreground">
                          {formatNumber(a.calories)}
                        </span>
                        <span className="block font-mono text-[10px] text-faint">
                          ×{a.multiplier}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <p className="mt-auto text-xs leading-6 text-faint">
            BMR is the energy your body uses at complete rest. Multiply it by an
            activity factor to estimate the calories you burn in a day (TDEE).
            Figures are estimates from the Mifflin-St Jeor equation.
          </p>
        </div>
      </div>
    </div>
  );
}
