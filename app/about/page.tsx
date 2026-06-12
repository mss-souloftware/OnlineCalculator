import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { SectionHeading } from "@/components/home/SectionHeading";
import { Icon } from "@/components/ui/icon";
import { buttonVariants } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/JsonLd";
import { calculators, categories } from "@/content/calculators";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About Us — Our Mission & Methodology",
  description:
    "Learn about Online Calculator.tools: our mission to make trustworthy calculators fast and free, the methodology behind our results, and our privacy-first approach.",
  alternates: { canonical: "/about" },
};

const principles = [
  {
    icon: "fa-bullseye",
    title: "Accuracy first",
    body: "Every result comes from the standard, published formula for its field. We write and test the math in code — never approximate, never guess.",
  },
  {
    icon: "fa-gauge-high",
    title: "Speed as a feature",
    body: "Built on a modern Next.js stack with instant, real-time updates. No spinners, no reloads — answers the moment you change an input.",
  },
  {
    icon: "fa-lock",
    title: "Privacy by default",
    body: "Calculations run in your browser. We don't require accounts and we don't need the financial or health figures you enter to leave your device.",
  },
  {
    icon: "fa-universal-access",
    title: "Built for everyone",
    body: "Semantic markup, keyboard support and careful contrast — in both light and dark themes — so the tools work for every visitor.",
  },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />

      <PageHeader
        eyebrow="Who we are"
        title="Calculators you can actually trust"
        description="Online Calculator.tools exists to answer one question well: what's the number? We pair the exhaustive utility of legacy calculator sites with a fast, modern, privacy-first experience."
        icon="fa-circle-info"
        breadcrumb={[{ label: "Home", href: "/" }, { label: "About" }]}
      />

      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
        {/* Mission */}
        <SectionHeading eyebrow="Our mission" title="Make good math effortless" />
        <div className="mt-5 space-y-4 leading-7 text-muted">
          <p>
            Most calculator websites are slow, cluttered with ads, and visually
            stuck a decade in the past. We thought the everyday tools people rely
            on for mortgages, fitness goals and quick math deserved better.
          </p>
          <p>
            So we rebuilt the experience from the ground up: a clean interface,
            instant interactive results, charts that respond as you type, and a
            structure that makes the right calculator easy to find. Today the
            platform spans{" "}
            <span className="font-semibold text-foreground">
              {calculators.length} calculators
            </span>{" "}
            across{" "}
            <span className="font-semibold text-foreground">
              {categories.length} categories
            </span>{" "}
            — and it keeps growing.
          </p>
        </div>

        {/* Methodology */}
        <div className="mt-14">
          <SectionHeading
            eyebrow="Our methodology"
            title="How we calculate"
          />
          <div className="mt-5 space-y-4 leading-7 text-muted">
            <p>
              Every calculator is powered by a pure, tested function that
              implements the recognised formula for its domain — amortization
              schedules for mortgages, true period compounding for interest, the
              U.S. Navy method for body fat, and so on. The logic lives in code,
              separate from the interface, so it can be verified independently.
            </p>
            <p>
              Where helpful, results are paired with a clear breakdown or chart
              so you understand not just the answer, but how it was reached. Our
              tools are designed for everyday guidance and education — for
              regulated financial or medical decisions, please consult a
              qualified professional.
            </p>
          </div>
        </div>

        {/* Principles */}
        <div className="mt-14">
          <SectionHeading
            eyebrow="What we value"
            title="The principles behind every tool"
          />
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {principles.map((p) => (
              <div
                key={p.title}
                className="rounded-xl border border-border bg-card p-6"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon name={p.icon} className="text-lg" />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold text-foreground">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted">{p.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-14 rounded-2xl border border-border bg-surface p-8 text-center">
          <h2 className="font-display text-2xl font-bold text-foreground">
            Have an idea for a calculator?
          </h2>
          <p className="mx-auto mt-2 max-w-md text-muted">
            We're always adding tools. Tell us what would make your life easier.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/contact"
              className={buttonVariants({ variant: "primary", size: "md" })}
            >
              <Icon name="fa-paper-plane" />
              Request a calculator
            </Link>
            <Link
              href="/browse"
              className={buttonVariants({ variant: "secondary", size: "md" })}
            >
              Browse all calculators
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
