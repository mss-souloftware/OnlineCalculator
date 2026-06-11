"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import {
  calculatorHref,
  categories,
  searchCalculators,
  type Calculator,
} from "@/content/calculators";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

const categoryName = Object.fromEntries(
  categories.map((c) => [c.slug, c.name]),
) as Record<Calculator["category"], string>;

interface GlobalSearchProps {
  /** "navbar" is compact; "hero" is the large landing search. */
  size?: "navbar" | "hero";
  className?: string;
}

/**
 * Predictive, client-side instant search over the calculator catalog.
 * Zero network calls — matching the brief's "Global Instant Search" feature.
 */
export function GlobalSearch({ size = "navbar", className }: GlobalSearchProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const results = open ? searchCalculators(query) : [];
  const isHero = size === "hero";

  // Close the results panel when clicking outside of it.
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => setActive(0), [query]);

  function onKeyDown(e: React.KeyboardEvent) {
    if (!results.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      const target = results[active];
      if (target) window.location.href = calculatorHref(target);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <div className="relative">
        <Icon
          name="fa-magnifying-glass"
          className={cn(
            "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-faint",
            isHero ? "text-base" : "text-sm",
          )}
        />
        <input
          type="search"
          role="combobox"
          aria-expanded={open && results.length > 0}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-label="Search calculators"
          placeholder={
            isHero ? "Search 20+ calculators…" : "Search calculators…"
          }
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          className={cn(
            "w-full rounded-xl border border-border bg-card pl-11 pr-4 text-foreground",
            "placeholder:text-faint transition-colors",
            "focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/30",
            isHero ? "h-14 text-base shadow-lg shadow-black/30" : "h-10 text-sm",
          )}
        />
        {isHero && (
          <kbd className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md border border-border bg-background px-2 py-1 font-mono text-xs text-faint sm:block">
            Enter
          </kbd>
        )}
      </div>

      {open && results.length > 0 && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-border bg-card shadow-2xl shadow-black/50"
        >
          {results.map((c, i) => (
            <li key={c.slug} role="option" aria-selected={i === active}>
              <Link
                href={calculatorHref(c)}
                onMouseEnter={() => setActive(i)}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 transition-colors",
                  i === active ? "bg-card-hover" : "hover:bg-card-hover",
                )}
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon name={c.icon} className="text-sm" fixedWidth />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-foreground">
                    {c.name}
                  </span>
                  <span className="block truncate text-xs text-faint">
                    {categoryName[c.category]}
                  </span>
                </span>
                <Icon
                  name="fa-arrow-right"
                  className="ml-auto text-xs text-faint"
                />
              </Link>
            </li>
          ))}
        </ul>
      )}

      {open && query.trim() && results.length === 0 && (
        <div className="absolute z-50 mt-2 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-faint shadow-2xl shadow-black/50">
          No calculators match “{query.trim()}”.
        </div>
      )}
    </div>
  );
}
