import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { CalculatorBrowser } from "@/components/calculators/CalculatorBrowser";
import { JsonLd } from "@/components/seo/JsonLd";
import { calculators, calculatorHref } from "@/content/calculators";
import { absoluteUrl, breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "All Calculators — Browse Every Free Tool",
  description:
    "Browse the full collection of free online calculators for finance, health, math and dates. Filter by category or search to find the exact tool you need.",
  alternates: { canonical: "/browse" },
};

const breadcrumb = [
  { name: "Home", path: "/" },
  { name: "All Calculators", path: "/browse" },
];

const collectionSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "All Calculators",
  url: absoluteUrl("/browse"),
  mainEntity: {
    "@type": "ItemList",
    itemListElement: calculators.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      url: absoluteUrl(calculatorHref(c)),
    })),
  },
};

export default function BrowsePage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(breadcrumb)} />
      <JsonLd data={collectionSchema} />

      <PageHeader
        eyebrow="The full catalog"
        title="All Calculators"
        description="Every tool in one place. Filter by category or search to jump straight to the calculator you need — all free, all instant."
        icon="fa-calculator"
        breadcrumb={[{ label: "Home", href: "/" }, { label: "All Calculators" }]}
      />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <CalculatorBrowser />
      </div>
    </>
  );
}
