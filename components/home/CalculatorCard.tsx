import Link from "next/link";
import {
  calculatorHref,
  categories,
  type Calculator,
} from "@/content/calculators";
import { Icon } from "@/components/ui/icon";
import { Badge } from "@/components/ui/badge";

const categoryName = Object.fromEntries(
  categories.map((c) => [c.slug, c.name]),
) as Record<Calculator["category"], string>;

/** Card linking to a single calculator. Border illuminates emerald on hover. */
export function CalculatorCard({ calculator }: { calculator: Calculator }) {
  const { name, description, icon, badge, category } = calculator;

  return (
    <Link
      href={calculatorHref(calculator)}
      className="group relative flex flex-col rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:bg-card-hover"
    >
      <div className="mb-4 flex items-start justify-between">
        <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
          <Icon name={icon} className="text-lg" />
        </span>
        {badge && (
          <Badge variant={badge === "New" ? "new" : "primary"}>{badge}</Badge>
        )}
      </div>

      <h3 className="font-display text-base font-semibold text-foreground">
        {name}
      </h3>
      <p className="mt-1.5 flex-1 text-sm leading-6 text-muted">{description}</p>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
        <span className="text-xs font-medium text-faint">
          {categoryName[category]}
        </span>
        <span className="flex items-center gap-1.5 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
          Open
          <Icon
            name="fa-arrow-right"
            className="transition-transform group-hover:translate-x-0.5"
          />
        </span>
      </div>
    </Link>
  );
}
