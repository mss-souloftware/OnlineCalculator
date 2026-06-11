import { Hero } from "@/components/home/Hero";
import { PopularCalculators } from "@/components/home/PopularCalculators";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { Features } from "@/components/home/Features";
import { Faq } from "@/components/home/Faq";
import { Cta } from "@/components/home/Cta";
import { JsonLd } from "@/components/seo/JsonLd";
import { calculatorHref, calculators, faqs } from "@/content/calculators";

const SITE_URL = "https://onlinecalculator.tools";

// WebSite schema with a SearchAction enables a sitelinks search box in Google.
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Online Calculator.tools",
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/calculators?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

// ItemList of the catalog helps search engines understand the tool collection.
const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Online Calculators",
  itemListElement: calculators.map((c, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: c.name,
    url: `${SITE_URL}${calculatorHref(c)}`,
  })),
};

// FAQPage schema makes the homepage eligible for FAQ rich results.
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function Home() {
  return (
    <>
      <JsonLd data={websiteSchema} />
      <JsonLd data={itemListSchema} />
      <JsonLd data={faqSchema} />

      <Hero />
      <PopularCalculators />
      <CategoryGrid />
      <Features />
      <Faq />
      <Cta />
    </>
  );
}
