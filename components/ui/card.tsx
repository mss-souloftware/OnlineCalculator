import { cn } from "@/lib/utils";

/**
 * Elevated surface card. In dark mode the brand relies on a 1px border that
 * "illuminates" to emerald on hover instead of using drop shadows.
 */
export function Card({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-5 transition-colors duration-200",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
