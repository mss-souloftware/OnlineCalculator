import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { ContactForm } from "@/components/contact/ContactForm";
import { Icon } from "@/components/ui/icon";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact Us — Feedback, Requests & Bug Reports",
  description:
    "Get in touch with the Online Calculator.tools team. Send feedback, request a new calculator, or report a bug using our secure contact form.",
  alternates: { canonical: "/contact" },
};

const details = [
  {
    icon: "fa-lightbulb",
    title: "Request a calculator",
    body: "Tell us which tool you'd like to see next — popular requests get built first.",
  },
  {
    icon: "fa-bug",
    title: "Report a bug",
    body: "Spotted a wrong result or a layout issue? Send the calculator name and what you expected.",
  },
  {
    icon: "fa-clock",
    title: "Response time",
    body: "We read every message. We typically reply within two business days when a response is needed.",
  },
];

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />

      <PageHeader
        eyebrow="Get in touch"
        title="Contact us"
        description="Questions, feedback, feature requests or bug reports — we'd love to hear from you."
        icon="fa-envelope"
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-5">
          {/* Form */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
              <ContactForm />
            </div>
            <p className="mt-4 flex items-center gap-2 text-xs text-faint">
              <Icon name="fa-shield-halved" className="text-primary" />
              We never share your email. See our{" "}
              <Link href="/privacy-policy" className="underline hover:text-primary">
                Privacy Policy
              </Link>
              .
            </p>
          </div>

          {/* Aside */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {details.map((d) => (
                <div
                  key={d.title}
                  className="flex gap-4 rounded-xl border border-border bg-card p-5"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon name={d.icon} />
                  </span>
                  <div>
                    <h2 className="font-medium text-foreground">{d.title}</h2>
                    <p className="mt-1 text-sm leading-6 text-muted">{d.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
