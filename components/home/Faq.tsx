import { faqs } from "@/content/calculators";
import { Icon } from "@/components/ui/icon";
import { SectionHeading } from "@/components/home/SectionHeading";

/**
 * FAQ accordion built on native <details>/<summary> so it works without
 * JavaScript and stays keyboard accessible. Content also powers FAQPage
 * JSON-LD on the homepage for rich search results.
 */
export function Faq() {
  return (
    <section className="border-t border-border bg-surface">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading
          align="center"
          title="Frequently asked questions"
          description="Everything worth knowing before you run your first calculation."
        />

        <div className="mt-12 space-y-3">
          {faqs.map((item) => (
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
      </div>
    </section>
  );
}
