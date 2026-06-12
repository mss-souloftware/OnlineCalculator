import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { CalculatorCard } from "@/components/home/CalculatorCard";
import { Icon } from "@/components/ui/icon";
import { JsonLd } from "@/components/seo/JsonLd";
import { calculatorComponents } from "@/components/calculators/registry";
import { ComingSoon } from "@/components/calculators/ComingSoon";
import {
  calculatorHref,
  calculators,
  calculatorsByCategory,
  getCalculator,
  getCalculatorMeta,
  getCategory,
  type CategorySlug,
} from "@/content/calculators";
import { absoluteUrl, breadcrumbJsonLd } from "@/lib/seo";

type Params = { params: Promise<{ category: string; slug: string }> };

// Pre-render every calculator page; reject anything else.
export const dynamicParams = false;

export function generateStaticParams() {
  return calculators.map((c) => ({ category: c.category, slug: c.slug }));
}

const APP_CATEGORY: Record<CategorySlug, string> = {
  financial: "FinanceApplication",
  health: "HealthApplication",
  math: "UtilitiesApplication",
  "date-time": "UtilitiesApplication",
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { category, slug } = await params;
  const calc = getCalculator(category, slug);
  if (!calc) return { title: "Calculator not found" };

  const meta = getCalculatorMeta(calc);
  const url = absoluteUrl(calculatorHref(calc));
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: calculatorHref(calc) },
    openGraph: { title: meta.title, description: meta.description, url },
  };
}

export default async function CalculatorPage({ params }: Params) {
  const { category, slug } = await params;
  const calc = getCalculator(category, slug);
  if (!calc) notFound();

  const cat = getCategory(calc.category)!;
  const Component = calculatorComponents[calc.slug];
  const related = calculatorsByCategory(cat.slug)
    .filter((c) => c.slug !== calc.slug)
    .slice(0, 3);
  const href = calculatorHref(calc);

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: calc.name,
    description: calc.metaDescription,
    url: absoluteUrl(href),
    applicationCategory: APP_CATEGORY[calc.category],
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  const faqSchema = calc.faqs && {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: calc.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: `${cat.name} Calculators`, path: `/${cat.slug}` },
          { name: calc.name, path: href },
        ])}
      />
      <JsonLd data={webAppSchema} />
      {faqSchema && <JsonLd data={faqSchema} />}

      <PageHeader
        eyebrow={cat.name}
        title={calc.name}
        description={calc.description}
        icon={calc.icon}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: cat.name, href: `/${cat.slug}` },
          { label: calc.name },
        ]}
      />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {Component ? <Component /> : <ComingSoon calculator={calc} />}

        {/* SEO body content */}
        {calc.longDescription && (
          <section className="mx-auto mt-16 max-w-3xl">
            <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
              About the {calc.name}
            </h2>
            <div className="mt-4 space-y-4">
              {calc.longDescription.split("\n\n").map((p, i) => (
                <p key={i} className="leading-7 text-muted">
                  {p}
                </p>
              ))}
            </div>
          </section>
        )}

        {/* FAQ */}
        {calc.faqs && calc.faqs.length > 0 && (
          <section className="mx-auto mt-14 max-w-3xl">
            <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
              Frequently asked questions
            </h2>
            <div className="mt-6 space-y-3">
              {calc.faqs.map((item) => (
                <details
                  key={item.q}
                  className="group rounded-xl border border-border bg-card px-5 [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="flex cursor-pointer items-center justify-between gap-4 py-4 text-left font-medium text-foreground">
                    {item.q}
                    <Icon
                      name="fa-plus"
                      className="shrink-0 text-sm text-primary transition-transform duration-200 group-open:rotate-45"
                    />
                  </summary>
                  <p className="pb-5 text-sm leading-7 text-muted">{item.a}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-16 border-t border-border pt-10">
            <h2 className="font-display text-xl font-bold tracking-tight text-foreground">
              Related {cat.name.toLowerCase()} calculators
            </h2>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((c) => (
                <CalculatorCard key={c.slug} calculator={c} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
