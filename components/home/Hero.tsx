import Link from "next/link";
import { GlobalSearch } from "@/components/search/GlobalSearch";
import { Icon } from "@/components/ui/icon";
import { categories, siteStats } from "@/content/calculators";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      {/* Ambient emerald glow + dotted grid texture */}
      <div className="hero-glow pointer-events-none absolute inset-0" />
      <div className="grid-texture pointer-events-none absolute inset-0 opacity-60" />

      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-24 text-center sm:px-6 sm:pt-28 lg:px-8">
        <h1 className="mx-auto max-w-4xl text-balance text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Every Calculation.{" "}
          <span className="text-gradient">Solved Instantly.</span>
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-7 text-muted sm:text-lg">
          Fast, free and beautifully simple calculators for finance, health,
          math and dates. Enter your numbers and watch results update in real
          time — no clutter, no account, just answers.
        </p>

        {/* Hero instant search */}
        <div className="mx-auto mt-9 max-w-xl">
          <GlobalSearch size="hero" />
        </div>

        {/* Quick category chips */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
          <span className="font-mono text-xs uppercase tracking-wider text-faint">
            Jump to
          </span>
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-sm text-muted transition-colors hover:border-primary/50 hover:text-foreground"
            >
              <Icon name={cat.icon} className="text-xs text-primary" />
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Stat bar */}
        <dl className="mx-auto mt-14 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-4">
          {siteStats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center bg-card px-4 py-6"
            >
              <dd className="font-mono text-[2rem] font-bold leading-none tracking-tight text-foreground">
                {"prefix" in stat && stat.prefix}
                {stat.value}
                {stat.suffix}
              </dd>
              <dt className="mt-2.5 text-xs font-medium uppercase tracking-wide text-faint">
                {stat.label}
              </dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
