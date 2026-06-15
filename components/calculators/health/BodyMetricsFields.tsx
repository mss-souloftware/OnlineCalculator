"use client";

import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { WeightField } from "@/components/calculators/health/WeightField";
import { LengthField } from "@/components/calculators/health/LengthField";
import { formatFtIn, type UnitSystem } from "@/lib/calculatorEngine/units";

/**
 * Unit toggle + weight + height inputs, shared across health calculators.
 * State is canonical metric (kg, cm); the fields render in the selected system.
 */
export function BodyMetricsFields({
  unit,
  onUnitChange,
  weightKg,
  onWeightKgChange,
  heightCm,
  onHeightCmChange,
}: {
  unit: UnitSystem;
  onUnitChange: (u: UnitSystem) => void;
  weightKg: number;
  onWeightKgChange: (kg: number) => void;
  heightCm: number;
  onHeightCmChange: (cm: number) => void;
}) {
  return (
    <>
      <SegmentedControl<UnitSystem>
        ariaLabel="Unit system"
        value={unit}
        onChange={onUnitChange}
        options={[
          { value: "metric", label: "Metric" },
          { value: "imperial", label: "Imperial" },
        ]}
      />
      <WeightField unit={unit} kg={weightKg} onChange={onWeightKgChange} />
      <LengthField
        id="height"
        label="Height"
        unit={unit}
        cm={heightCm}
        onChange={onHeightCmChange}
        minCm={120}
        maxCm={220}
        hint={unit === "imperial" ? formatFtIn(heightCm) : undefined}
      />
    </>
  );
}
