import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

export function Cta() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-b from-card to-surface px-6 py-16 text-center sm:py-20">
        {/* Distinct from the hero: a single emerald hairline + soft top bloom. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 left-1/2 h-48 w-[40rem] max-w-full -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
        />

        <div className="relative">
          <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold tracking-tight text-foreground sm:text-[2.5rem] sm:leading-[1.1]">
            Ready to crunch the numbers?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty leading-7 text-muted">
            Pick a calculator and get an answer in seconds. Free forever, no
            account, no catch.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/calculators"
              className={buttonVariants({ variant: "primary", size: "lg" })}
            >
              <Icon name="fa-calculator" />
              Browse all calculators
            </Link>
            <Link
              href="/calculators/financial"
              className={cn(buttonVariants({ variant: "secondary", size: "lg" }))}
            >
              Explore financial tools
              <Icon name="fa-arrow-right" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
