import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  /** Short mono label rendered above the title with an emerald rule. */
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  /** Optional trailing call-to-action (left-aligned headings only). */
  action?: { href: string; label: string };
  className?: string;
}

/**
 * Shared section header. Uses Roboto Mono for the eyebrow + a short emerald
 * rule — a single deliberate motif reused across sections rather than a
 * different coloured label per section.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  action,
  className,
}: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        !centered &&
          action &&
          "sm:flex-row sm:items-end sm:justify-between sm:gap-8",
        className,
      )}
    >
      <div className={cn("max-w-2xl", centered && "mx-auto text-center")}>
        {eyebrow && (
          <span
            className={cn(
              "inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.22em] text-muted",
              centered && "justify-center",
            )}
          >
            <span aria-hidden className="h-px w-7 bg-primary" />
            {eyebrow}
          </span>
        )}
        <h2
          className={cn(
            "font-display text-3xl font-bold tracking-tight text-foreground sm:text-[2.5rem] sm:leading-[1.1]",
            eyebrow && "mt-4",
          )}
        >
          {title}
        </h2>
        {description && (
          <p className="mt-4 text-pretty leading-7 text-muted">{description}</p>
        )}
      </div>

      {action && !centered && (
        <Link
          href={action.href}
          className="group inline-flex shrink-0 items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary-to"
        >
          {action.label}
          <Icon
            name="fa-arrow-right"
            className="transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      )}
    </div>
  );
}
