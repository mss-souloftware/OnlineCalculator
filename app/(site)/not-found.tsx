import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { buttonVariants } from "@/components/ui/button";
import { categories } from "@/content/calculators";

export default function NotFound() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="hero-glow pointer-events-none absolute inset-x-0 top-0 h-64"
      />
      <div className="relative mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center sm:px-6 sm:py-32">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-card text-primary">
          <Icon name="fa-compass" className="text-3xl" />
        </span>
        <p className="mt-6 font-mono text-sm uppercase tracking-[0.22em] text-primary">
          Error 404
        </p>
        <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          This page doesn&apos;t add up
        </h1>
        <p className="mt-4 max-w-md text-pretty leading-7 text-muted">
          The page you&apos;re looking for can&apos;t be found. It may have moved,
          or the link might be incorrect. Let&apos;s get you back to the numbers.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/" className={buttonVariants({ variant: "primary", size: "md" })}>
            <Icon name="fa-house" />
            Back to home
          </Link>
          <Link
            href="/browse"
            className={buttonVariants({ variant: "secondary", size: "md" })}
          >
            Browse all calculators
          </Link>
        </div>

        <div className="mt-12 w-full border-t border-border pt-8">
          <p className="font-mono text-xs uppercase tracking-wider text-faint">
            Or jump to a category
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2.5">
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
        </div>
      </div>
    </section>
  );
}
