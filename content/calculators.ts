/**
 * Static content source-of-truth for the platform.
 *
 * Per the implementation plan, calculator *formulas* live in code
 * (`lib/calculatorEngine/`). This file holds only *metadata* — names, slugs,
 * categories, SEO copy and the Font Awesome icon used in the UI. It powers the
 * homepage category grid, the popular list and the client-side instant search.
 */

export type CategorySlug = "financial" | "health" | "math" | "date-time";

export type Badge = "Popular" | "New" | "Updated";

export interface Calculator {
  /** URL-safe identifier, e.g. "mortgage-calculator". */
  slug: string;
  /** Display name. */
  name: string;
  /** Owning category. */
  category: CategorySlug;
  /** One-line description used on cards and in search results. */
  description: string;
  /** Font Awesome 6 icon class, e.g. "fa-house". */
  icon: string;
  /** Search keywords beyond the visible name/description. */
  keywords: string[];
  /** Optional marketing badge shown on the card. */
  badge?: Badge;
  /** Whether the calculator is featured in the "Popular" section. */
  popular?: boolean;
}

export interface Category {
  slug: CategorySlug;
  name: string;
  /** Short tagline for the category hub card. */
  tagline: string;
  /** Font Awesome 6 icon class for the category. */
  icon: string;
  /** Accent gradient used on the category card icon. */
  accent: string;
}

export const categories: Category[] = [
  {
    slug: "financial",
    name: "Financial",
    tagline: "Mortgages, loans, savings and investments.",
    icon: "fa-sack-dollar",
    accent: "from-emerald-500/20 to-emerald-500/5",
  },
  {
    slug: "health",
    name: "Health & Fitness",
    tagline: "BMI, calories, body fat and more.",
    icon: "fa-heart-pulse",
    accent: "from-rose-500/20 to-rose-500/5",
  },
  {
    slug: "math",
    name: "Math & Algebra",
    tagline: "Scientific, fractions, percentages, units.",
    icon: "fa-square-root-variable",
    accent: "from-sky-500/20 to-sky-500/5",
  },
  {
    slug: "date-time",
    name: "Date & Time",
    tagline: "Age, durations and date differences.",
    icon: "fa-calendar-days",
    accent: "from-amber-500/20 to-amber-500/5",
  },
];

export const calculators: Calculator[] = [
  // ── Financial ──────────────────────────────────────────────────────────
  {
    slug: "mortgage-calculator",
    name: "Mortgage Calculator",
    category: "financial",
    description:
      "Estimate monthly payments, total interest and a full amortization schedule.",
    icon: "fa-house",
    keywords: ["home loan", "amortization", "emi", "property"],
    badge: "Popular",
    popular: true,
  },
  {
    slug: "loan-calculator",
    name: "Loan Calculator",
    category: "financial",
    description:
      "Work out repayments and total payable for personal, auto or business loans.",
    icon: "fa-hand-holding-dollar",
    keywords: ["personal loan", "auto loan", "repayment"],
    popular: true,
  },
  {
    slug: "emi-calculator",
    name: "EMI Calculator",
    category: "financial",
    description:
      "Calculate your equated monthly instalment and interest breakdown instantly.",
    icon: "fa-file-invoice-dollar",
    keywords: ["instalment", "tenure", "interest"],
  },
  {
    slug: "compound-interest-calculator",
    name: "Compound Interest Calculator",
    category: "financial",
    description:
      "See how your money grows with compounding across any frequency and term.",
    icon: "fa-chart-line",
    keywords: ["growth", "interest", "principal", "frequency"],
    badge: "Popular",
    popular: true,
  },
  {
    slug: "savings-calculator",
    name: "Savings Calculator",
    category: "financial",
    description:
      "Project the future value of regular deposits toward your savings goal.",
    icon: "fa-piggy-bank",
    keywords: ["deposit", "future value", "goal"],
  },
  {
    slug: "credit-card-payoff-calculator",
    name: "Credit Card Payoff Calculator",
    category: "financial",
    description:
      "Find your payoff date and total interest based on your monthly payment.",
    icon: "fa-credit-card",
    keywords: ["debt", "apr", "balance", "payoff"],
  },
  {
    slug: "investment-calculator",
    name: "Investment Calculator",
    category: "financial",
    description:
      "Model portfolio growth from an initial amount plus monthly contributions.",
    icon: "fa-arrow-trend-up",
    keywords: ["portfolio", "returns", "sip", "growth"],
    popular: true,
  },
  {
    slug: "retirement-calculator",
    name: "Retirement Calculator",
    category: "financial",
    description:
      "Project your retirement corpus and the monthly income it could provide.",
    icon: "fa-umbrella-beach",
    keywords: ["pension", "corpus", "401k", "nest egg"],
  },

  // ── Health & Fitness ───────────────────────────────────────────────────
  {
    slug: "bmi-calculator",
    name: "BMI Calculator",
    category: "health",
    description:
      "Check your Body Mass Index and see where you fall on the healthy range.",
    icon: "fa-weight-scale",
    keywords: ["body mass index", "weight", "height"],
    badge: "Popular",
    popular: true,
  },
  {
    slug: "bmr-calculator",
    name: "BMR Calculator",
    category: "health",
    description:
      "Calculate your Basal Metabolic Rate — the calories you burn at rest.",
    icon: "fa-fire",
    keywords: ["metabolism", "calories", "rest"],
  },
  {
    slug: "calorie-calculator",
    name: "Calorie Calculator",
    category: "health",
    description:
      "Get a daily calorie target for your goal with a macronutrient breakdown.",
    icon: "fa-utensils",
    keywords: ["diet", "macros", "tdee", "nutrition"],
    popular: true,
  },
  {
    slug: "body-fat-calculator",
    name: "Body Fat Calculator",
    category: "health",
    description:
      "Estimate body fat percentage using the trusted U.S. Navy method.",
    icon: "fa-person",
    keywords: ["navy method", "waist", "neck", "composition"],
  },
  {
    slug: "ideal-weight-calculator",
    name: "Ideal Weight Calculator",
    category: "health",
    description:
      "See your ideal weight range across four established medical formulas.",
    icon: "fa-scale-balanced",
    keywords: ["healthy weight", "frame", "robinson", "devine"],
  },

  // ── Math & Algebra ─────────────────────────────────────────────────────
  {
    slug: "scientific-calculator",
    name: "Scientific Calculator",
    category: "math",
    description:
      "A full scientific calculator with trig, logs, powers and constants.",
    icon: "fa-calculator",
    keywords: ["trigonometry", "logarithm", "expression"],
    badge: "Popular",
    popular: true,
  },
  {
    slug: "fraction-calculator",
    name: "Fraction Calculator",
    category: "math",
    description:
      "Add, subtract, multiply and divide fractions with step-by-step results.",
    icon: "fa-divide",
    keywords: ["numerator", "denominator", "simplify"],
  },
  {
    slug: "percentage-calculator",
    name: "Percentage Calculator",
    category: "math",
    description:
      "Solve every common percentage problem — increase, decrease and of.",
    icon: "fa-percent",
    keywords: ["percent", "discount", "change"],
    popular: true,
  },
  {
    slug: "unit-converter",
    name: "Unit Converter",
    category: "math",
    description:
      "Convert length, weight, temperature, area, volume and more in a tap.",
    icon: "fa-ruler-combined",
    keywords: ["metric", "imperial", "conversion"],
  },

  // ── Date & Time ────────────────────────────────────────────────────────
  {
    slug: "age-calculator",
    name: "Age Calculator",
    category: "date-time",
    description:
      "Find your exact age in years, months and days, plus key milestones.",
    icon: "fa-cake-candles",
    keywords: ["birthday", "date of birth", "milestones"],
    badge: "Popular",
    popular: true,
  },
  {
    slug: "date-calculator",
    name: "Date Calculator",
    category: "date-time",
    description:
      "Add or subtract days, or find the exact duration between two dates.",
    icon: "fa-calendar-day",
    keywords: ["duration", "days between", "deadline"],
  },
  {
    slug: "time-calculator",
    name: "Time Calculator",
    category: "date-time",
    description:
      "Add and subtract hours, minutes and seconds, or build a countdown.",
    icon: "fa-clock",
    keywords: ["hours", "minutes", "countdown", "stopwatch"],
    badge: "New",
  },
];

/** Calculators flagged for the homepage "Popular" section. */
export const popularCalculators = calculators.filter((c) => c.popular);

/** Count of calculators in a given category. */
export function countByCategory(slug: CategorySlug): number {
  return calculators.filter((c) => c.category === slug).length;
}

/** Look up a category by its slug (returns undefined for unknown slugs). */
export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

/** All calculators belonging to a category. */
export function calculatorsByCategory(slug: CategorySlug): Calculator[] {
  return calculators.filter((c) => c.category === slug);
}

/** Build the canonical path to a calculator page. */
export function calculatorHref(c: Pick<Calculator, "category" | "slug">): string {
  return `/calculators/${c.category}/${c.slug}`;
}

/** Lightweight, dependency-free instant search over the calculator catalog. */
export function searchCalculators(query: string, limit = 6): Calculator[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/);
  return calculators
    .map((c) => {
      const haystack = [
        c.name,
        c.description,
        c.category,
        ...c.keywords,
      ]
        .join(" ")
        .toLowerCase();
      // Score: every term must appear; name matches rank highest.
      const matchesAll = terms.every((t) => haystack.includes(t));
      if (!matchesAll) return { c, score: -1 };
      const nameHit = c.name.toLowerCase().includes(q) ? 2 : 0;
      const startHit = c.name.toLowerCase().startsWith(q) ? 1 : 0;
      return { c, score: nameHit + startHit };
    })
    .filter((r) => r.score >= 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.c);
}

/** Headline platform metrics shown in the hero stat bar. */
export const siteStats = [
  { label: "Calculators", value: calculators.length, suffix: "+", icon: "fa-calculator" },
  { label: "Categories", value: categories.length, suffix: "", icon: "fa-layer-group" },
  { label: "Sign-up required", value: 0, suffix: "", icon: "fa-user-slash" },
  { label: "Cost to use", value: 0, suffix: "", prefix: "$", icon: "fa-tag" },
] as const;

/** Homepage FAQ — also feeds FAQPage JSON-LD for rich results. */
export const faqs = [
  {
    q: "Are these calculators really free to use?",
    a: "Yes. Every calculator on the platform is completely free, with no account, subscription or hidden limits. Open a tool, enter your numbers and get results instantly.",
  },
  {
    q: "Do I need to create an account?",
    a: "No sign-up is required. You can use any calculator immediately. Optional features like saving a calculation work through shareable links, so your data never has to leave your browser.",
  },
  {
    q: "How accurate are the results?",
    a: "Each calculator uses the standard, published formula for its domain — for example amortization for mortgages and the U.S. Navy method for body fat. Calculation logic is written and tested in code, never guessed.",
  },
  {
    q: "Can I share or save a calculation?",
    a: "Yes. Your inputs are encoded into the page URL, so you can bookmark a result or send the link to someone and they will see your exact numbers when it loads.",
  },
  {
    q: "Do the calculators work on mobile?",
    a: "Absolutely. The platform is built mobile-first, with large touch targets, responsive layouts and sliders designed to stay usable on phones and tablets.",
  },
  {
    q: "Is my data private?",
    a: "Your inputs are processed in your browser for instant results. We do not require personal information to use a calculator, and financial or health figures you enter are not stored on our servers.",
  },
];
