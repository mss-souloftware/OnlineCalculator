import { Breadcrumb, type Crumb } from "@/components/layout/Breadcrumb";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  /** Font Awesome icon shown in a tile beside the title. */
  icon?: string;
  eyebrow?: string;
  breadcrumb?: Crumb[];
  align?: "left" | "center";
  children?: React.ReactNode;
}

/** Shared banner for inner pages: breadcrumb + title + description. */
export function PageHeader({
  title,
  description,
  icon,
  eyebrow,
  breadcrumb,
  align = "left",
  children,
}: PageHeaderProps) {
  const centered = align === "center";

  return (
    <section className="relative overflow-hidden border-b border-border bg-surface">
      <div
        aria-hidden
        className="grid-texture pointer-events-none absolute inset-0 opacity-60"
      />
      <div
        aria-hidden
        className="hero-glow pointer-events-none absolute inset-x-0 top-0 h-40"
      />
      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
        {breadcrumb && <Breadcrumb items={breadcrumb} className="mb-6" />}

        <div
          className={cn(
            "flex items-start gap-5",
            centered && "flex-col items-center text-center",
          )}
        >
          {icon && (
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-t from-primary to-primary-to text-primary-foreground shadow-[0_0_0_1px_rgba(16,185,129,0.4)]">
              <Icon name={icon} className="text-2xl" />
            </span>
          )}
          <div className={cn("max-w-3xl", centered && "mx-auto")}>
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
            <h1
              className={cn(
                "font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl",
                eyebrow && "mt-3",
              )}
            >
              {title}
            </h1>
            {description && (
              <p className="mt-3 text-pretty leading-7 text-muted">
                {description}
              </p>
            )}
            {children && <div className="mt-6">{children}</div>}
          </div>
        </div>
      </div>
    </section>
  );
}
