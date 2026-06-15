"use client";

import { RangeField } from "@/components/ui/RangeField";
import { kgToLb, lbToKg, type UnitSystem } from "@/lib/calculatorEngine/units";

/** Unit-aware weight slider. State is canonical kilograms. */
export function WeightField({
  id = "weight",
  label = "Weight",
  unit,
  kg,
  onChange,
}: {
  id?: string;
  label?: string;
  unit: UnitSystem;
  kg: number;
  onChange: (kg: number) => void;
}) {
  if (unit === "metric") {
    return (
      <RangeField
        id={id}
        label={label}
        value={Math.round(kg)}
        onChange={onChange}
        min={30}
        max={200}
        step={1}
        suffix="kg"
      />
    );
  }
  return (
    <RangeField
      id={id}
      label={label}
      value={Math.round(kgToLb(kg))}
      onChange={(lb) => onChange(lbToKg(lb))}
      min={66}
      max={440}
      step={1}
      suffix="lb"
    />
  );
}
