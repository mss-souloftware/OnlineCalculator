"use client";

import { RangeField } from "@/components/ui/RangeField";
import { cmToIn, inToCm, type UnitSystem } from "@/lib/calculatorEngine/units";

/** Unit-aware length slider (height/neck/waist/hip). State is canonical centimetres. */
export function LengthField({
  id,
  label,
  unit,
  cm,
  onChange,
  minCm,
  maxCm,
  hint,
}: {
  id: string;
  label: string;
  unit: UnitSystem;
  cm: number;
  onChange: (cm: number) => void;
  minCm: number;
  maxCm: number;
  hint?: string;
}) {
  if (unit === "metric") {
    return (
      <RangeField
        id={id}
        label={label}
        value={Math.round(cm)}
        onChange={onChange}
        min={minCm}
        max={maxCm}
        step={1}
        suffix="cm"
        hint={hint}
      />
    );
  }
  return (
    <RangeField
      id={id}
      label={label}
      value={Math.round(cmToIn(cm))}
      onChange={(inch) => onChange(inToCm(inch))}
      min={Math.round(cmToIn(minCm))}
      max={Math.round(cmToIn(maxCm))}
      step={1}
      suffix="in"
      hint={hint}
    />
  );
}
