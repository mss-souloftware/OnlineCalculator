import { cn } from "@/lib/utils";

type Variant = "default" | "primary" | "new" | "outline";

const variants: Record<Variant, string> = {
  default: "bg-card border border-border text-muted",
  primary:
    "bg-gradient-to-t from-primary to-primary-to text-primary-foreground font-semibold",
  new: "bg-primary/10 text-primary border border-primary/30",
  outline: "border border-border text-faint",
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
