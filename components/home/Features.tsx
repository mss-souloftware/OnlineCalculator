import { Icon } from "@/components/ui/icon";
import { SectionHeading } from "@/components/home/SectionHeading";

const features = [
  {
    icon: "fa-bolt",
    title: "Real-time results",
    body: "Move a slider or change a field and the answer updates instantly — no submit button, no page reloads, no waiting.",
  },
  {
    icon: "fa-shield-halved",
    title: "Private by design",
    body: "Calculations run in your browser. The financial and health figures you enter are never required to leave your device.",
  },
  {
    icon: "fa-link",
    title: "Share any result",
    body: "Your inputs are encoded into the page URL, so you can bookmark a calculation or send the exact numbers to anyone.",
  },
  {
    icon: "fa-mobile-screen",
    title: "Built mobile-first",
    body: "Large touch targets and responsive layouts keep every input and slider comfortable on phones and tablets.",
  },
  {
    icon: "fa-square-root-variable",
    title: "Accurate formulas",
    body: "Each tool uses the standard published method — amortization, the Navy body-fat formula, true compounding and more.",
  },
  {
    icon: "fa-universal-access",
    title: "Accessible to all",
    body: "Semantic markup, keyboard navigation and WCAG-minded contrast mean the tools work for everyone.",
  },
];

export function Features() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="The difference"
        title="Calculators that feel effortless"
        description="Traditional calculator sites are slow, cluttered and dated. Online Calculator.tools is rebuilt from the ground up for speed, clarity and trust — so you get the right answer the moment you need it."
      />

      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <div
            key={f.title}
            className="rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/40"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon name={f.icon} className="text-lg" />
            </span>
            <h3 className="mt-4 font-display text-lg font-semibold text-foreground">
              {f.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-muted">{f.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
