/** Horizontal BMI gauge (15–40) with proportional category bands + a marker. */
const BANDS = [
  { label: "Under", width: 14, color: "#38bdf8" }, // 15–18.5
  { label: "Normal", width: 26, color: "var(--primary)" }, // 18.5–25
  { label: "Over", width: 20, color: "#f59e0b" }, // 25–30
  { label: "Obese", width: 40, color: "#ef4444" }, // 30–40
];

export function BmiScale({ bmi }: { bmi: number }) {
  const clamped = Math.min(40, Math.max(15, Number.isFinite(bmi) ? bmi : 15));
  const pos = ((clamped - 15) / 25) * 100;

  return (
    <div className="w-full">
      <div className="relative">
        <div className="flex h-3 w-full overflow-hidden rounded-full">
          {BANDS.map((b) => (
            <div
              key={b.label}
              style={{ width: `${b.width}%`, background: b.color }}
            />
          ))}
        </div>
        <div
          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${pos}%` }}
          aria-hidden
        >
          <div className="h-5 w-1.5 rounded-full bg-foreground ring-2 ring-card" />
        </div>
      </div>
      <div className="mt-2 flex text-[10px] font-medium text-faint">
        {BANDS.map((b) => (
          <div key={b.label} style={{ width: `${b.width}%` }} className="text-center">
            {b.label}
          </div>
        ))}
      </div>
    </div>
  );
}
