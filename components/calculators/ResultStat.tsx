/** A label/value row used in calculator result panels. */
export function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border/60 pb-3 last:border-0 last:pb-0">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="font-mono text-sm font-medium text-foreground">{value}</dd>
    </div>
  );
}
