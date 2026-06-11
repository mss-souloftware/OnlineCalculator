"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { GlobalSearch } from "@/components/search/GlobalSearch";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Icon } from "@/components/ui/icon";
import { buttonVariants } from "@/components/ui/button";
import { categories } from "@/content/calculators";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/calculators", label: "All Calculators" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
      <nav
        className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8"
        aria-label="Primary"
      >
        <Logo />

        {/* Desktop nav */}
        <div className="ml-2 hidden items-center gap-1 lg:flex">
          <div className="group relative">
            <button className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:text-foreground">
              Categories
              <Icon
                name="fa-chevron-down"
                className="text-[10px] transition-transform group-hover:rotate-180"
              />
            </button>
            {/* Hover dropdown of categories */}
            <div className="invisible absolute left-0 top-full w-60 translate-y-1 pt-2 opacity-0 transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
              <ul className="overflow-hidden rounded-xl border border-border bg-card p-1.5 shadow-2xl shadow-black/50">
                {categories.map((cat) => (
                  <li key={cat.slug}>
                    <Link
                      href={`/calculators/${cat.slug}`}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:bg-card-hover hover:text-foreground"
                    >
                      <Icon
                        name={cat.icon}
                        className="w-4 text-primary"
                        fixedWidth
                      />
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right cluster */}
        <div className="ml-auto hidden items-center gap-3 md:flex">
          <GlobalSearch size="navbar" className="w-56 lg:w-64" />
          <ThemeToggle />
          <Link
            href="/calculators"
            className={buttonVariants({ variant: "primary", size: "sm" })}
          >
            Browse All
          </Link>
        </div>

        {/* Mobile controls */}
        <div className="ml-auto flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border text-foreground"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label="Toggle menu"
          >
            <Icon name={open ? "fa-xmark" : "fa-bars"} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div
          id="mobile-menu"
          className="border-t border-border bg-background px-4 py-4 md:hidden"
        >
          <GlobalSearch size="navbar" className="mb-4" />
          <ul className="space-y-1">
            {categories.map((cat) => (
              <li key={cat.slug}>
                <Link
                  href={`/calculators/${cat.slug}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted hover:bg-card hover:text-foreground"
                >
                  <Icon name={cat.icon} className="w-4 text-primary" fixedWidth />
                  {cat.name}
                </Link>
              </li>
            ))}
            <li className="my-2 border-t border-border" />
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm text-muted hover:bg-card hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/calculators"
            onClick={() => setOpen(false)}
            className={cn(
              buttonVariants({ variant: "primary", size: "md" }),
              "mt-4 w-full",
            )}
          >
            Browse All Calculators
          </Link>
        </div>
      )}
    </header>
  );
}
