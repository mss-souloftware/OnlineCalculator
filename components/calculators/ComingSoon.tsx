import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { buttonVariants } from "@/components/ui/button";
import type { Calculator } from "@/content/calculators";

/** Placeholder shown for calculators that have a page (and SEO) but no tool yet. */
export function ComingSoon({ calculator }: { calculator: Calculator }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center sm:p-14">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Icon name={calculator.icon} className="text-2xl" />
      </span>
      <p className="mt-5 font-mono text-xs uppercase tracking-[0.22em] text-primary">
        In the workshop
      </p>
      <h2 className="mt-2 font-display text-2xl font-bold text-foreground">
        The {calculator.name} is coming soon
      </h2>
      <p className="mx-auto mt-3 max-w-md leading-7 text-muted">
        {calculator.description} We&apos;re building this tool right now — check
        back shortly, or try one of the calculators that&apos;s ready today.
      </p>
      <div className="mt-6 flex justify-center">
        <Link
          href="/browse"
          className={buttonVariants({ variant: "primary", size: "md" })}
        >
          <Icon name="fa-calculator" />
          Browse calculators
        </Link>
      </div>
    </div>
  );
}
