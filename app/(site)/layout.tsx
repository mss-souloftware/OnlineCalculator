import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Clarity } from "@/components/analytics/Clarity";

/**
 * Layout for the public website: theme switching, global navigation, footer and
 * analytics. Lives in the `(site)` route group so the `/embed/*` routes (which
 * inherit only the root layout) render the calculator alone — no chrome — and
 * stay theme-deterministic via their own `?theme` param rather than the
 * visitor's saved site theme.
 */
export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ThemeProvider>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <Clarity />
    </ThemeProvider>
  );
}
