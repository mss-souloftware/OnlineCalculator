"use client";

import { useMemo, useState } from "react";
import {
  calculators,
  categories,
  type CategorySlug,
} from "@/content/calculators";
import { CalculatorCard } from "@/components/home/CalculatorCard";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

type Filter = "all" | CategorySlug;

const tabs: { value: Filter; label: string; icon: string }[] = [
  { value: "all", label: "All", icon: "fa-border-all" },
  ...categories.map((c) => ({
    value: c.slug as Filter,
    label: c.name,
    icon: c.icon,
  })),
];

/**
 * Client-side browser for the full catalog: filter by category + free-text
 * search. All cards are present in the initial render (good for SEO); the UI
 * just narrows what's shown.
 */
export function CalculatorBrowser() {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const terms = q ? q.split(/\s+/) : [];
    return calculators.filter((c) => {
      if (filter !== "all" && c.category !== filter) return false;
      if (!terms.length) return true;
      const haystack = [c.name, c.description, ...c.keywords]
        .join(" ")
        .toLowerCase();
      return terms.every((t) => haystack.includes(t));
    });
  }, [filter, query]);

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div
          role="tablist"
          aria-label="Filter by category"
          className="flex flex-wrap gap-2"
        >
          {tabs.map((tab) => {
            const active = filter === tab.value;
            return (
              <button
                key={tab.value}
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(tab.value)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors",
                  active
                    ? "border-primary/50 bg-primary/10 text-primary"
                    : "border-border bg-card text-muted hover:border-border-strong hover:text-foreground",
                )}
              >
                <Icon name={tab.icon} className="text-xs" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="relative lg:w-72">
          <Icon
            name="fa-magnifying-glass"
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-faint"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search within results"
            placeholder="Filter calculators…"
            className="h-11 w-full rounded-xl border border-border bg-card pl-11 pr-4 text-sm text-foreground placeholder:text-faint transition-colors focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </div>

      {/* Result count */}
      <p className="mt-6 font-mono text-xs uppercase tracking-wider text-faint">
        {results.length} {results.length === 1 ? "calculator" : "calculators"}
      </p>

      {/* Grid */}
      {results.length > 0 ? (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {results.map((c) => (
            <CalculatorCard key={c.slug} calculator={c} />
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center">
          <Icon
            name="fa-magnifying-glass"
            className="text-2xl text-faint"
          />
          <p className="mt-3 font-medium text-foreground">
            No calculators match your search.
          </p>
          <button
            onClick={() => {
              setQuery("");
              setFilter("all");
            }}
            className="mt-3 text-sm font-medium text-primary hover:text-primary-to"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
