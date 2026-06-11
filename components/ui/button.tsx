import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ghost" | "secondary";
type Size = "sm" | "md" | "lg" | "icon";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium " +
  "transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 " +
  "focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background " +
  "disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  // Emerald→Mint gradient with dark text, per brand button rules.
  primary:
    "bg-gradient-to-t from-primary to-primary-to text-primary-foreground font-semibold " +
    "shadow-[0_0_0_1px_rgba(16,185,129,0.4)] hover:shadow-[0_8px_30px_-8px_rgba(16,185,129,0.6)] hover:brightness-110",
  secondary:
    "bg-card text-foreground border border-border hover:bg-card-hover hover:border-border-strong",
  outline:
    "border border-border text-foreground hover:border-primary/60 hover:text-primary hover:bg-primary/5",
  ghost: "text-muted hover:text-foreground hover:bg-card",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-7 text-base",
  icon: "h-10 w-10",
};

/** Class string for the button, exported so it can style `<Link>` elements. */
export function buttonVariants({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: Variant;
  size?: Size;
  className?: string;
} = {}) {
  return cn(base, variants[variant], sizes[size], className);
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={buttonVariants({ variant, size, className })}
      {...props}
    />
  ),
);
Button.displayName = "Button";
