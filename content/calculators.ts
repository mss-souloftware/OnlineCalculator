/**
 * Static content source-of-truth for the platform.
 *
 * Per the implementation plan, calculator *formulas* live in code
 * (`lib/calculatorEngine/`). This file holds only *metadata* — names, slugs,
 * categories, SEO copy and the Font Awesome icon used in the UI. It powers the
 * homepage category grid, the popular list and the client-side instant search.
 *
 * SEO SOP: every calculator carries explicit `metaTitle` + `metaDescription`
 * (consumed by `generateMetadata`) — titles/descriptions are never hardcoded
 * in page components.
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
  /** SEO <title> for the calculator page. */
  metaTitle: string;
  /** SEO <meta name="description"> for the calculator page. */
  metaDescription: string;
  /** Font Awesome 6 icon class, e.g. "fa-house". */
  icon: string;
  /** Search keywords beyond the visible name/description. */
  keywords: string[];
  /** Optional marketing badge shown on the card. */
  badge?: Badge;
  /** Whether the calculator is featured in the "Popular" section. */
  popular?: boolean;
  /** Long-form SEO body content shown beneath the tool (paragraphs split on \n\n). */
  longDescription?: string;
  /** Page-specific FAQs (also power FAQPage structured data). */
  faqs?: { q: string; a: string }[];
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
    metaTitle: "Mortgage Calculator – Monthly Payment & Amortization",
    metaDescription:
      "Free mortgage calculator. Estimate your monthly payment, total interest and full amortization schedule — adjust home price, down payment, rate and term in real time.",
    icon: "fa-house",
    keywords: ["home loan", "amortization", "emi", "property"],
    badge: "Popular",
    popular: true,
    longDescription:
      "A mortgage is a loan used to buy a home, repaid in fixed monthly instalments over a set term — most commonly 15 or 30 years. Each payment covers two things: interest on the outstanding balance and a portion of the principal (the amount you borrowed). This calculator works out your monthly principal-and-interest payment, the total interest you'll pay over the life of the loan, and a full year-by-year amortization schedule.\n\nThree levers move your payment the most: the loan amount (home price minus your down payment), the interest rate, and the term. A larger down payment lowers both your monthly payment and your total interest. A longer term reduces the monthly payment but increases the total interest you pay. Adjust the inputs and every figure and chart updates instantly.\n\nNote: this estimate covers principal and interest only. Your actual monthly housing cost may also include property taxes, homeowners insurance, HOA dues and private mortgage insurance (PMI).",
    faqs: [
      {
        q: "How is my monthly mortgage payment calculated?",
        a: "We use the standard amortization formula. Your payment is fixed so that, at the given interest rate, the loan is fully paid off by the end of the term. Early payments are mostly interest; over time more of each payment goes toward the principal.",
      },
      {
        q: "Does this include property taxes and insurance?",
        a: "No. The figure shown is principal and interest only. Property taxes, homeowners insurance, HOA fees and PMI are not included and will increase your total monthly housing cost.",
      },
      {
        q: "How much should my down payment be?",
        a: "A 20% down payment is a common benchmark because it usually avoids private mortgage insurance (PMI). A larger down payment lowers your monthly payment and total interest, but the right amount depends on your savings and goals.",
      },
      {
        q: "Should I choose a 15- or 30-year term?",
        a: "A 15-year term has higher monthly payments but far less total interest. A 30-year term keeps payments lower and more flexible but costs more interest overall. Try both in the term field to compare.",
      },
    ],
  },
  {
    slug: "loan-calculator",
    name: "Loan Calculator",
    category: "financial",
    description:
      "Work out repayments and total payable for personal, auto or business loans.",
    metaTitle: "Loan Calculator – Monthly Payments & Total Interest",
    metaDescription:
      "Calculate monthly payments and total payable on personal, auto or business loans. Free loan calculator with an instant interest breakdown.",
    icon: "fa-hand-holding-dollar",
    keywords: ["personal loan", "auto loan", "repayment"],
    popular: true,
    longDescription:
      "A loan calculator helps you understand the real cost of borrowing before you commit. Whether it's a personal loan, car loan, student loan or business loan, the math is the same: you borrow a principal amount and repay it in fixed monthly instalments over a set term, with the lender charging interest on the balance you still owe.\n\nThis calculator shows your monthly payment, the total interest you'll pay, and the total amount repaid over the life of the loan, plus a year-by-year breakdown. Two factors drive the cost most: the interest rate (APR) and the term. A longer term lowers your monthly payment but increases the total interest. A shorter term costs more each month but far less overall.\n\nUse the loan-type presets to start from typical figures, then fine-tune the amount, rate and term to match a specific offer. Comparing two quotes? Copy the share link for each and put them side by side.",
    faqs: [
      {
        q: "How is my monthly loan payment calculated?",
        a: "We use the standard amortizing-loan formula. Your payment is fixed so the loan is fully repaid by the end of the term at the stated interest rate. Each payment covers the interest due that month plus a portion of the principal.",
      },
      {
        q: "What's the difference between interest rate and APR?",
        a: "The interest rate is the cost of borrowing the principal. APR (annual percentage rate) also folds in certain fees, so it reflects the true yearly cost. To compare offers fairly, compare APRs.",
      },
      {
        q: "Should I choose a longer or shorter loan term?",
        a: "A longer term lowers your monthly payment but increases the total interest you pay. A shorter term raises the monthly payment but costs far less overall. Pick the shortest term whose payment fits comfortably in your budget.",
      },
      {
        q: "Does paying off a loan early save money?",
        a: "Usually yes — extra payments reduce the principal, so less interest accrues over time. Check whether your lender charges a prepayment penalty first, as a few do.",
      },
    ],
  },
  {
    slug: "emi-calculator",
    name: "EMI Calculator",
    category: "financial",
    description:
      "Calculate your equated monthly instalment and interest breakdown instantly.",
    metaTitle: "EMI Calculator – Equated Monthly Instalment",
    metaDescription:
      "Work out your loan EMI in seconds. Enter principal, interest rate and tenure to see your monthly instalment and total interest — free and instant.",
    icon: "fa-file-invoice-dollar",
    keywords: ["instalment", "tenure", "interest"],
  },
  {
    slug: "compound-interest-calculator",
    name: "Compound Interest Calculator",
    category: "financial",
    description:
      "See how your money grows with compounding across any frequency and term.",
    metaTitle: "Compound Interest Calculator – Growth Over Time",
    metaDescription:
      "See how your money grows with compound interest across any frequency and term. Free calculator with an instant growth chart and interest earned.",
    icon: "fa-chart-line",
    keywords: ["growth", "interest", "principal", "frequency"],
    badge: "Popular",
    popular: true,
    longDescription:
      "Compound interest is interest earned on both your original money and the interest it has already earned. That snowball effect is why Albert Einstein reportedly called it the most powerful force in finance — and why starting early matters so much. This calculator shows exactly how an initial deposit, plus optional regular contributions, grows over time at a given rate and compounding frequency.\n\nTwo settings make compounding more powerful: a higher frequency and a longer time horizon. Interest that compounds daily grows slightly faster than interest compounded annually, because earnings start earning sooner. And because growth is exponential, the final years contribute far more than the first — a balance can double in its last decade alone.\n\nUse the monthly contribution field to model regular investing (like a SIP or 401(k)), and the frequency selector to match how your account actually compounds. The chart and table break down how much of your future value comes from contributions versus interest earned.",
    faqs: [
      {
        q: "What is compound interest?",
        a: "Compound interest is interest calculated on your initial principal and on the accumulated interest from previous periods. Unlike simple interest (which is only ever calculated on the principal), compounding causes your balance to grow at an accelerating rate.",
      },
      {
        q: "How does compounding frequency affect growth?",
        a: "The more often interest compounds, the faster your balance grows, because earned interest starts earning interest sooner. Daily compounding edges out monthly, which beats annual — though at typical rates the difference is modest compared with the rate itself and the time invested.",
      },
      {
        q: "What's the difference between this and a simple interest calculator?",
        a: "Simple interest pays a flat amount each period based only on the principal. Compound interest reinvests each period's interest so future interest is calculated on a larger balance — which is how most savings and investment accounts actually work.",
      },
      {
        q: "Does adding monthly contributions make a big difference?",
        a: "A large one. Regular contributions are themselves compounded over time, so steady monthly investing often ends up contributing more to your final balance than the starting deposit — especially over long horizons.",
      },
    ],
  },
  {
    slug: "savings-calculator",
    name: "Savings Calculator",
    category: "financial",
    description:
      "Project the future value of regular deposits toward your savings goal.",
    metaTitle: "Savings Calculator – Future Value of Deposits",
    metaDescription:
      "Project the future value of your savings with regular deposits and interest. Free savings goal calculator with instant, real-time results.",
    icon: "fa-piggy-bank",
    keywords: ["deposit", "future value", "goal"],
    longDescription:
      "A savings calculator shows how regular deposits and interest combine to build a balance over time, and whether you're on track to hit a specific target. Enter a starting balance, a monthly deposit, your account's interest rate (APY) and a time frame, and optionally a savings goal to track your progress.\n\nUnlike investing, savings growth is steadier and more predictable, because the interest rate is usually fixed or close to it. The two levers you control most are how much you deposit each month and how long you keep saving. Small, consistent deposits add up surprisingly fast once interest starts compounding on the growing balance.\n\nSet a goal to see exactly when you'd reach it — or how much you'd fall short — so you can adjust your deposit or timeline before you start. Everything updates instantly as you change the numbers.",
    faqs: [
      {
        q: "How is my savings balance calculated?",
        a: "We compound interest monthly on the running balance and add your monthly deposit each month. The result is your projected balance, the total you deposited, and the interest you earned over the period.",
      },
      {
        q: "What's the difference between APR and APY?",
        a: "APY (annual percentage yield) reflects interest compounded over a year, so it's the right figure for savings growth, and the one most savings accounts quote. APR doesn't include the effect of compounding.",
      },
      {
        q: "How can I reach my savings goal faster?",
        a: "Increase your monthly deposit, extend your timeline, start with a larger balance, or find an account with a higher rate. The goal tracker shows how each change moves your finish line.",
      },
      {
        q: "Does this account for taxes or inflation?",
        a: "No. The projection shows nominal growth before any tax on interest and without adjusting for inflation, so your real (inflation-adjusted) purchasing power will be somewhat lower.",
      },
    ],
  },
  {
    slug: "credit-card-payoff-calculator",
    name: "Credit Card Payoff Calculator",
    category: "financial",
    description:
      "Find your payoff date and total interest based on your monthly payment.",
    metaTitle: "Credit Card Payoff Calculator – Payoff Date & Interest",
    metaDescription:
      "Find out how long to clear your credit card and the total interest you'll pay. Free payoff calculator based on balance, APR and monthly payment.",
    icon: "fa-credit-card",
    keywords: ["debt", "apr", "balance", "payoff"],
  },
  {
    slug: "investment-calculator",
    name: "Investment Calculator",
    category: "financial",
    description:
      "Model portfolio growth from an initial amount plus monthly contributions.",
    metaTitle: "Investment Calculator – Portfolio Growth Projection",
    metaDescription:
      "Model your portfolio growth from an initial amount plus monthly contributions and expected return. Free investment calculator with an instant chart.",
    icon: "fa-arrow-trend-up",
    keywords: ["portfolio", "returns", "sip", "growth"],
    popular: true,
    longDescription:
      "An investment calculator projects how a portfolio could grow over time when you combine an initial lump sum with regular monthly contributions and let compounding do the work. It's the tool to answer questions like “what could my retirement account be worth?” or “is investing $500 a month enough?”.\n\nThe single biggest driver is time, followed by your contribution amount and expected return. Because returns compound, money invested early has decades to grow — which is why starting sooner usually beats investing more later. The annual contribution increase lets you model raising your investments each year as your income grows, which can dramatically lift the final balance.\n\nReturns are not guaranteed: markets rise and fall, and the “expected return” you enter is an assumption, not a promise. Use conservative figures and treat the result as a projection for planning, not a forecast.",
    faqs: [
      {
        q: "What return rate should I use?",
        a: "Use a realistic long-term average for your asset mix. Historically a diversified, stock-heavy portfolio has averaged roughly 7–10% before inflation, but past performance doesn't guarantee future results. More conservative assumptions give you a safer plan.",
      },
      {
        q: "What does the annual contribution increase do?",
        a: "It raises your monthly contribution by the percentage you choose at the start of each year — handy for modelling contributions that grow with your salary. Even a small annual increase compounds into a noticeably larger final balance.",
      },
      {
        q: "Is this suitable for retirement planning?",
        a: "It's a great starting point for projecting a pot from regular investing. For a complete plan you should also factor in inflation, taxes and withdrawals — see our retirement calculator and consider a qualified adviser.",
      },
      {
        q: "Why is most of my balance 'returns' over long periods?",
        a: "Compounding is exponential, so over long horizons the growth on your money — and the growth on that growth — can far exceed what you actually contributed. That's the core reason to invest early and stay invested.",
      },
    ],
  },
  {
    slug: "retirement-calculator",
    name: "Retirement Calculator",
    category: "financial",
    description:
      "Project your retirement corpus and the monthly income it could provide.",
    metaTitle: "Retirement Calculator – Corpus & Monthly Income",
    metaDescription:
      "Project your retirement savings and the monthly income it could provide. Free retirement calculator with instant, real-time projections.",
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
    metaTitle: "BMI Calculator – Body Mass Index & Healthy Range",
    metaDescription:
      "Calculate your Body Mass Index (BMI) and see your healthy weight range instantly. Free BMI calculator for metric and imperial units.",
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
    metaTitle: "BMR Calculator – Basal Metabolic Rate",
    metaDescription:
      "Calculate your Basal Metabolic Rate (BMR) — the calories you burn at rest. Free, instant BMR calculator using weight, height, age and gender.",
    icon: "fa-fire",
    keywords: ["metabolism", "calories", "rest"],
  },
  {
    slug: "calorie-calculator",
    name: "Calorie Calculator",
    category: "health",
    description:
      "Get a daily calorie target for your goal with a macronutrient breakdown.",
    metaTitle: "Calorie Calculator – Daily Calorie & Macro Needs",
    metaDescription:
      "Get your daily calorie target and macronutrient breakdown for your goal. Free calorie (TDEE) calculator with instant results.",
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
    metaTitle: "Body Fat Calculator – U.S. Navy Method",
    metaDescription:
      "Estimate your body fat percentage using the trusted U.S. Navy method. Free body fat calculator with instant results and your category.",
    icon: "fa-person",
    keywords: ["navy method", "waist", "neck", "composition"],
  },
  {
    slug: "ideal-weight-calculator",
    name: "Ideal Weight Calculator",
    category: "health",
    description:
      "See your ideal weight range across four established medical formulas.",
    metaTitle: "Ideal Weight Calculator – Healthy Weight Range",
    metaDescription:
      "See your ideal weight range across four established medical formulas. Free ideal weight calculator based on height, gender and frame.",
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
    metaTitle: "Scientific Calculator – Trig, Logs & Powers",
    metaDescription:
      "A free online scientific calculator with trigonometry, logarithms, powers, roots and constants. Fast, accurate and instant.",
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
    metaTitle: "Fraction Calculator – Add, Subtract, Multiply, Divide",
    metaDescription:
      "Add, subtract, multiply and divide fractions with simplified, step-by-step results. Free online fraction calculator with instant answers.",
    icon: "fa-divide",
    keywords: ["numerator", "denominator", "simplify"],
  },
  {
    slug: "percentage-calculator",
    name: "Percentage Calculator",
    category: "math",
    description:
      "Solve every common percentage problem — increase, decrease and of.",
    metaTitle: "Percentage Calculator – Increase, Decrease & Of",
    metaDescription:
      "Solve every common percentage problem instantly — percentage of, increase, decrease and change. Free, easy online percentage calculator.",
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
    metaTitle: "Unit Converter – Length, Weight, Temperature & More",
    metaDescription:
      "Convert length, weight, temperature, area, volume and more between metric and imperial. Free, instant online unit converter.",
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
    metaTitle: "Age Calculator – Exact Age in Years, Months, Days",
    metaDescription:
      "Find your exact age in years, months and days from your date of birth, plus key milestones. Free, instant age calculator.",
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
    metaTitle: "Date Calculator – Days Between & Add/Subtract Dates",
    metaDescription:
      "Add or subtract days from a date, or find the exact duration between two dates. Free, instant online date calculator.",
    icon: "fa-calendar-day",
    keywords: ["duration", "days between", "deadline"],
  },
  {
    slug: "time-calculator",
    name: "Time Calculator",
    category: "date-time",
    description:
      "Add and subtract hours, minutes and seconds, or build a countdown.",
    metaTitle: "Time Calculator – Add & Subtract Hours and Minutes",
    metaDescription:
      "Add and subtract hours, minutes and seconds, or build a countdown. Free, instant online time calculator.",
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

/** Look up a calculator by category + slug. */
export function getCalculator(
  category: string,
  slug: string,
): Calculator | undefined {
  return calculators.find((c) => c.category === category && c.slug === slug);
}

/**
 * Canonical path to a calculator page.
 * SOP: `/[category]/[slug]` — no redundant `/calculators/` folder.
 */
export function calculatorHref(
  c: Pick<Calculator, "category" | "slug">,
): string {
  return `/${c.category}/${c.slug}`;
}

/** SEO title/description for a calculator (single accessor for generateMetadata). */
export function getCalculatorMeta(c: Calculator): {
  title: string;
  description: string;
} {
  return { title: c.metaTitle, description: c.metaDescription };
}

/** Lightweight, dependency-free instant search over the calculator catalog. */
export function searchCalculators(query: string, limit = 6): Calculator[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/);
  return calculators
    .map((c) => {
      const haystack = [c.name, c.description, c.category, ...c.keywords]
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
