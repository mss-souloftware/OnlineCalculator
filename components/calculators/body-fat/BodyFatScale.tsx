import type { Gender } from "@/lib/calculatorEngine/body-fat";

const LABELS = ["Essential", "Athletes", "Fitness", "Average", "Obese"];
const COLORS = ["#38bdf8", "#10b981", "#84cc16", "#f59e0b", "#ef4444"];
const MAX = 45;

/** Body-fat gauge with sex-specific ACE category bands + a marker. */
export function BodyFatScale({
  bodyFat,
  gender,
}: {
  bodyFat: number;
  gender: Gender;
}) {
  const boundaries = gender === "male" ? [6, 14, 18, 25] : [14, 21, 25, 32];
  const edges = [0, ...boundaries, MAX];
  const bands = LABELS.map((label, i) => ({
    label,
    color: COLORS[i],
    width: ((edges[i + 1] - edges[i]) / MAX) * 100,
  }));

  const clamped = Math.min(MAX, Math.max(0, Number.isFinite(bodyFat) ? bodyFat : 0));
  const pos = (clamped / MAX) * 100;

  return (
    <div className="w-full">
      <div className="relative">
        <div className="flex h-3 w-full overflow-hidden rounded-full">
          {bands.map((b) => (
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
        {bands.map((b) => (
          <div key={b.label} style={{ width: `${b.width}%` }} className="text-center">
            {b.label}
          </div>
        ))}
      </div>
    </div>
  );
}
