"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * Wraps the app in next-themes. Dark is the default; the choice persists in
 * localStorage and the `light`/`dark` class on <html> drives the CSS tokens.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
