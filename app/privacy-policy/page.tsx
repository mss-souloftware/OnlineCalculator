import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { LegalContent } from "@/components/legal/LegalContent";
import { JsonLd } from "@/components/seo/JsonLd";
import { privacyPolicy as doc } from "@/content/legal";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: doc.title,
  description: doc.description,
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: doc.title, path: "/privacy-policy" },
        ])}
      />
      <PageHeader
        eyebrow="Legal"
        title={doc.title}
        icon="fa-shield-halved"
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
