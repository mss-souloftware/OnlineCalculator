import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { LegalContent } from "@/components/legal/LegalContent";
import { JsonLd } from "@/components/seo/JsonLd";
import { cookiePolicy as doc } from "@/content/legal";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: doc.title,
  description: doc.description,
  alternates: { canonical: "/cookie-policy" },
};

export default function CookiePolicyPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: doc.title, path: "/cookie-policy" },
        ])}
      />
      <PageHeader
        eyebrow="Legal"
        title={doc.title}
        icon="fa-cookie-bite"
        breadcrumb={[{ label: "Home", href: "/" }, { label: doc.title }]}
      >
        <p className="font-mono text-xs uppercase tracking-wider text-faint">
          Last updated: {doc.updated}
        </p>
      </PageHeader>
      <LegalContent doc={doc} />
    </>
  );
}
