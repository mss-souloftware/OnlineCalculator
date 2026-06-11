import { cn } from "@/lib/utils";

type IconStyle = "solid" | "regular" | "brands";

const styleClass: Record<IconStyle, string> = {
  solid: "fa-solid",
  regular: "fa-regular",
  brands: "fa-brands",
};

interface IconProps {
  /** Font Awesome icon name, e.g. "fa-house". */
  name: string;
  /** Font Awesome style family. Defaults to solid. */
  variant?: IconStyle;
  className?: string;
  /**
   * When the icon conveys meaning on its own, pass a label so screen readers
   * announce it. Decorative icons (the default) are hidden from assistive tech.
   */
  label?: string;
  /** Fixed-width rendering for aligned lists. */
  fixedWidth?: boolean;
}

/**
 * Thin wrapper over Font Awesome 6 (loaded via CDN in the root layout).
 * Keeps every icon usage consistent and accessible — no emoji anywhere.
 */
export function Icon({
  name,
  variant = "solid",
  className,
  label,
  fixedWidth,
}: IconProps) {
  return (
    <i
      className={cn(styleClass[variant], name, fixedWidth && "fa-fw", className)}
      aria-hidden={label ? undefined : true}
      role={label ? "img" : undefined}
      aria-label={label}
    />
  );
}
