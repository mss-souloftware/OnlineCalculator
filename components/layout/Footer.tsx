import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { Icon } from "@/components/ui/icon";
import {
  calculatorHref,
  categories,
  popularCalculators,
} from "@/content/calculators";

const legalLinks = [
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-of-service", label: "Terms of Service" },
  { href: "/cookie-policy", label: "Cookie Policy" },
];

const socials = [
  { href: "#", icon: "fa-x-twitter", label: "X (Twitter)" },
  { href: "#", icon: "fa-github", label: "GitHub" },
  { href: "#", icon: "fa-linkedin-in", label: "LinkedIn" },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-2">
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-6 text-muted">
              Fast, free and beautifully simple calculators for finance, health,
              math and dates. No sign-up, no clutter — just answers.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted transition-colors hover:border-primary/60 hover:text-primary"
                >
                  <Icon name={s.icon} variant="brands" />
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h2 className="text-sm font-semibold text-foreground">Categories</h2>
            <ul className="mt-4 space-y-2.5">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/calculators/${cat.slug}`}
                    className="text-sm text-muted transition-colors hover:text-primary"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular calculators */}
          <div>
            <h2 className="text-sm font-semibold text-foreground">Popular</h2>
            <ul className="mt-4 space-y-2.5">
              {popularCalculators.slice(0, 6).map((c) => (
                <li key={c.slug}>
                  <Link
                    href={calculatorHref(c)}
                    className="text-sm text-muted transition-colors hover:text-primary"
                  >
                    {c.name.replace(" Calculator", "")}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company / legal */}
          <div>
            <h2 className="text-sm font-semibold text-foreground">Company</h2>
            <ul className="mt-4 space-y-2.5">
              {legalLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-muted transition-colors hover:text-primary"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="text-sm text-faint">
            © {new Date().getFullYear()} ONLINE CALCULATOR.tools. All rights
            reserved.
          </p>
          <p className="flex items-center gap-2 text-sm text-faint">
            <Icon name="fa-shield-halved" className="text-primary" />
            Runs in your browser — your numbers stay private.
          </p>
        </div>
      </div>
    </footer>
  );
}
