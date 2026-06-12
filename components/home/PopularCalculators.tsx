import { popularCalculators } from "@/content/calculators";
import { CalculatorCard } from "@/components/home/CalculatorCard";
import { SectionHeading } from "@/components/home/SectionHeading";

export function PopularCalculators() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Most used"
        title="Popular calculators"
        description="The tools people reach for every day — tuned for speed and accuracy."
        action={{ href: "/browse", label: "View all calculators" }}
      />

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {popularCalculators.slice(0, 8).map((calculator) => (
          <CalculatorCard key={calculator.slug} calculator={calculator} />
        ))}
      </div>
    </section>
  );
}
