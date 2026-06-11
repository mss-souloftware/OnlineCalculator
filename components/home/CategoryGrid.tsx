import Link from "next/link";
import {
  calculatorHref,
  calculators,
  categories,
  countByCategory,
} from "@/content/calculators";
import { Icon } from "@/components/ui/icon";
import { SectionHeading } from "@/components/home/SectionHeading";
import { cn } from "@/lib/utils";

export function CategoryGrid() {
  return (
    <section className="border-y border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading
          align="center"
          eyebrow="Collections"
          title="Browse by category"
          description="Every calculator, neatly organized. Pick a category to see the full collection."
        />

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
          {categories.map((cat) => {
            const items = calculators.filter((c) => c.category === cat.slug);
            return (
              <div
                key={cat.slug}
                className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition-colors hover:border-border-strong"
              >
                <div className="flex items-center gap-4">
                  <span
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-b text-primary",
                      cat.accent,
                    )}
                  >
                    <Icon name={cat.icon} className="text-xl" />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      {cat.name}
                    </h3>
                    <p className="text-sm text-faint">
                      {countByCategory(cat.slug)} calculators · {cat.tagline}
                    </p>
                  </div>
                </div>

                <ul className="mt-5 grid flex-1 grid-cols-1 gap-1 sm:grid-cols-2">
                  {items.map((c) => (
                    <li key={c.slug}>
                      <Link
                        href={calculatorHref(c)}
                        className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-muted transition-colors hover:bg-card-hover hover:text-foreground"
                      >
                        <Icon
                          name={c.icon}
                          className="w-4 text-faint transition-colors group-hover:text-primary"
                          fixedWidth
                        />
                        <span className="truncate">
                          {c.name.replace(" Calculator", "")}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/calculators/${cat.slug}`}
                  className="mt-5 inline-flex items-center gap-2 border-t border-border pt-4 text-sm font-medium text-primary transition-colors hover:text-primary-to"
                >
                  Browse {cat.name}
                  <Icon
                    name="fa-arrow-right"
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
