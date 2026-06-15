"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  calculateCalories,
  GOALS,
  MACRO_SPLITS,
  type MacroSplit,
} from "@/lib/calculatorEngine/calorie";
import { ACTIVITY_LEVELS, type Gender } from "@/lib/calculatorEngine/bmr";
import { type UnitSystem } from "@/lib/calculatorEngine/units";
import { formatNumber } from "@/lib/format";
import { BodyMetricsFields } from "@/components/calculators/health/BodyMetricsFields";
import { RangeField } from "@/components/ui/RangeField";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { DonutChart } from "@/components/charts/DonutChart";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Stat } from "@/components/calculators/ResultStat";

interface Inputs {
  unit: UnitSystem;
  weightKg: number;
  heightCm: number;
  age: number;
  gender: Gender;
  activity: string;
  goal: string;
  macroSplit: MacroSplit;
}

const DEFAULTS: Inputs = {
  unit: "metric",
  weightKg: 70,
  heightCm: 175,
  age: 30,
  gender: "male",
  activity: "moderate",
  goal: "lose05",
  macroSplit: "balanced",
};

const selectClass =
  "w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground transition-colors focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/30";

export function CalorieCalculator() {
  const [inputs, setInputs] = useState<Inputs>(DEFAULTS);
  const [copied, setCopied] = useState(false);
  const hydrated = useRef(false);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const next = { ...DEFAULTS };
    const w = parseFloat(p.get("weightKg") ?? "");
    const h = parseFloat(p.get("heightCm") ?? "");
    const a = parseFloat(p.get("age") ?? "");
    if (Number.isFinite(w)) next.weightKg = w;
    if (Number.isFinite(h)) next.heightCm = h;
    if (Number.isFinite(a)) next.age = a;
    const u = p.get("unit");
    if (u === "metric" || u === "imperial") next.unit = u;
    const g = p.get("gender");
    if (g === "male" || g === "female") next.gender = g;
    const act = p.get("activity");
    if (act && ACTIVITY_LEVELS.some((x) => x.key === act)) next.activity = act;
    const goal = p.get("goal");
    if (goal && GOALS.some((x) => x.key === goal)) next.goal = goal;
    const ms = p.get("macroSplit");
    if (ms && ms in MACRO_SPLITS) next.macroSplit = ms as MacroSplit;
    setInputs(next);
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    const p = new URLSearchParams({
      unit: inputs.unit,
      weightKg: inputs.weightKg.toFixed(1),
      heightCm: inputs.heightCm.toFixed(1),
      age: String(inputs.age),
      gender: inputs.gender,
      activity: inputs.activity,
      goal: inputs.goal,
      macroSplit: inputs.macroSplit,
    });
    window.history.replaceState(null, "", `${window.location.pathname}?${p}`);
  }, [inputs]);

  const result = useMemo(
    () =>
      calculateCalories({
        weightKg: inputs.weightKg,
        heightCm: inputs.heightCm,
        age: inputs.age,
        gender: inputs.gender,
        activityKey: inputs.activity,
        goalKey: inputs.goal,
        macroSplit: inputs.macroSplit,
      }),
    [inputs],
  );

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
              onChange={update("gender")}
              options={[
                { value: "male", label: "Male", icon: "fa-mars" },
                { value: "female", label: "Female", icon: "fa-venus" },
              ]}
            />
            <BodyMetricsFields
              unit={inputs.unit}
              onUnitChange={update("unit")}
              weightKg={inputs.weightKg}
              onWeightKgChange={update("weightKg")}
              heightCm={inputs.heightCm}
              onHeightCmChange={update("heightCm")}
            />
            <RangeField
              id="age"
              label="Age"
              value={inputs.age}
              onChange={update("age")}
              min={15}
              max={100}
              step={1}
              suffix="yrs"
            />
            <div>
              <label
                htmlFor="activity"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                Activity level
              </label>
              <select
                id="activity"
                value={inputs.activity}
                onChange={(e) => update("activity")(e.target.value)}
                className={selectClass}
              >
                {ACTIVITY_LEVELS.map((a) => (
                  <option key={a.key} value={a.key}>
                    {a.label} — {a.description}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="goal"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                Goal
              </label>
              <select
                id="goal"
                value={inputs.goal}
                onChange={(e) => update("goal")(e.target.value)}
                className={selectClass}
              >
                {GOALS.map((g) => (
                  <option key={g.key} value={g.key}>
                    {g.label}
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
            <p className="text-sm text-muted">Daily calorie target</p>
            <p className="mt-1 font-mono text-4xl font-bold text-foreground sm:text-5xl">
              {formatNumber(result.target)}
            </p>
            <p className="mt-1 text-xs text-faint">
              {result.goalDelta === 0
                ? "to maintain your weight"
                : `${result.goalDelta > 0 ? "+" : ""}${formatNumber(result.goalDelta)} cal vs maintenance`}
            </p>
          </div>

          <dl className="grid grid-cols-2 gap-x-6 gap-y-3">
            <Stat label="BMR (at rest)" value={`${formatNumber(result.bmr)} cal`} />
            <Stat
              label="Maintenance"
              value={`${formatNumber(result.maintenance)} cal`}
            />
          </dl>

          <div>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-medium text-foreground">
                Macronutrient targets
              </p>
              <div className="w-48">
                <SegmentedControl<MacroSplit>
                  ariaLabel="Macro split"
                  value={inputs.macroSplit}
                  onChange={update("macroSplit")}
                  options={(
                    Object.keys(MACRO_SPLITS) as MacroSplit[]
                  ).map((k) => ({ value: k, label: MACRO_SPLITS[k].label }))}
                />
              </div>
            </div>
            <DonutChart
              centerLabel="per day"
              centerValue={`${formatNumber(result.target)} cal`}
              segments={[
                {
                  label: `Protein (${MACRO_SPLITS[inputs.macroSplit].protein}%)`,
                  value: result.calories.protein,
                  color: "var(--primary)",
                  display: `${formatNumber(result.grams.protein)} g`,
                },
                {
                  label: `Carbs (${MACRO_SPLITS[inputs.macroSplit].carbs}%)`,
                  value: result.calories.carbs,
                  color: "#f59e0b",
                  display: `${formatNumber(result.grams.carbs)} g`,
                },
                {
                  label: `Fat (${MACRO_SPLITS[inputs.macroSplit].fat}%)`,
                  value: result.calories.fat,
                  color: "#38bdf8",
                  display: `${formatNumber(result.grams.fat)} g`,
                },
              ]}
            />
          </div>

          <p className="mt-auto text-xs leading-6 text-faint">
            Estimates use the Mifflin-St Jeor equation. Individual needs vary —
            for medical or performance nutrition, consult a professional.
          </p>
        </div>
      </div>
    </div>
  );
}
