import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

/**
 * Brand lockup: "ONLINE CALCULATOR.tools".
 * Per the guidelines, "ONLINE" is off-white, "CALCULATOR" is zinc, and the
 * ".tools" badge carries the Emerald→Mint gradient.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="ONLINE CALCULATOR.tools — home"
      className={cn("group inline-flex items-center gap-2.5", className)}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-t from-primary to-primary-to text-primary-foreground shadow-[0_0_0_1px_rgba(16,185,129,0.4)] transition-transform group-hover:scale-105">
        <Icon name="fa-calculator" className="text-base" />
      </span>
      <span className="flex items-baseline gap-1 font-display text-[15px] font-bold leading-none tracking-tight">
        <span className="text-foreground">ONLINE</span>
        <span className="text-muted">CALCULATOR</span>
        <span className="text-gradient">.tools</span>
      </span>
    </Link>
  );
}
