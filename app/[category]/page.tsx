import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { CalculatorCard } from "@/components/home/CalculatorCard";
import { Icon } from "@/components/ui/icon";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  calculatorHref,
  calculatorsByCategory,
  categories,
  getCategory,
} from "@/content/calculators";
import { absoluteUrl, breadcrumbJsonLd } from "@/lib/seo";

type Params = { params: Promise<{ category: string }> };

// Pre-render every category at build time; reject any other top-level slug.
export const dynamicParams = false;

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) return { title: "Category not found" };

  const title = `${cat.name} Calculators`;
  const description = `Free ${cat.name.toLowerCase()} calculators — ${cat.tagline} Instant results, no sign-up.`;
  return {
    title,
    description,
    alternates: { canonical: `/${cat.slug}` },
    openGraph: { title, description, url: absoluteUrl(`/${cat.slug}`) },
  };
}

export default async function CategoryPage({ params }: Params) {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) notFound();

  const items = calculatorsByCategory(cat.slug);
  const others = categories.filter((c) => c.slug !== cat.slug);

  const breadcrumb = [
    { name: "Home", path: "/" },
    { name: "All Calculators", path: "/browse" },
    { name: `${cat.name} Calculators`, path: `/${cat.slug}` },
  ];

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${cat.name} Calculators`,
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      url: absoluteUrl(calculatorHref(c)),
    })),
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(breadcrumb)} />
      <JsonLd data={itemListSchema} />

      <PageHeader
        eyebrow={`${items.length} calculators`}
        title={`${cat.name} Calculators`}
        description={cat.tagline}
        icon={cat.icon}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "All Calculators", href: "/browse" },
          { label: cat.name },
        ]}
      />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((c) => (
            <CalculatorCard key={c.slug} calculator={c} />
          ))}
        </div>

        {/* Other categories */}
        <div className="mt-16 border-t border-border pt-10">
          <h2 className="font-display text-xl font-bold tracking-tight text-foreground">
            Explore other categories
          </h2>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {others.map((o) => (
              <Link
                key={o.slug}
                href={`/${o.slug}`}
                className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/50"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon name={o.icon} className="text-lg" />
                </span>
                <span className="min-w-0">
                  <span className="block font-medium text-foreground">
                    {o.name}
                  </span>
                  <span className="block truncate text-sm text-faint">
                    {o.tagline}
                  </span>
                </span>
                <Icon
                  name="fa-arrow-right"
                  className="ml-auto text-sm text-faint transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
