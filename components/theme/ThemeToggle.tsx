"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

/**
 * Sun/moon button that flips between the light and dark brand themes.
 * Renders a neutral placeholder until mounted to avoid a hydration mismatch
 * (the server can't know the persisted theme).
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={
        mounted
          ? `Switch to ${isDark ? "light" : "dark"} theme`
          : "Toggle theme"
      }
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border text-muted transition-colors hover:border-primary/60 hover:text-primary",
        className,
      )}
    >
      {mounted ? (
        <Icon name={isDark ? "fa-sun" : "fa-moon"} className="text-sm" />
      ) : (
        <span className="h-4 w-4" aria-hidden />
      )}
    </button>
  );
}
