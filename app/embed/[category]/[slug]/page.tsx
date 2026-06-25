import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { calculatorComponents } from "@/components/calculators/registry";
import { EmbedAutoResize } from "@/components/calculators/EmbedAutoResize";
import { calculators, getCalculator } from "@/content/calculators";
import { SITE_URL } from "@/lib/seo";

type Params = { category: string; slug: string };
type Props = { params: Promise<Params> };

// Pre-render an embed page for every *built* calculator (a registered
// component); reject anything else. Unbuilt "coming soon" tools get no embed.
// The page reads no `searchParams`, so it stays fully static and CDN-cacheable
// (one cached artifact serves every theme — see THEME_SCRIPT below).
export const dynamicParams = false;

export function generateStaticParams() {
  return calculators
    .filter((c) => calculatorComponents[c.slug])
    .map((c) => ({ category: c.category, slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params;
  const calc = getCalculator(category, slug);
  return {
    title: calc ? `${calc.name} — Embedded` : "Calculator",
    // The embed page duplicates the canonical calculator page, so keep it out of
    // the index — the SEO value is the attribution backlink on the host site.
    robots: { index: false, follow: true },
  };
}

/**
 * Theme + background are applied client-side from the query string so the page
 * stays static (one cached artifact serves every variant). This blocking inline
 * script runs before first paint (flash-free, the technique theme libraries
 * use): `?theme=dark` keeps the `:root` dark default, otherwise `light` is added
 * to <html>; `?bg=transparent` clears the document background so the widget
 * blends into the host page (the calculator cards stay opaque). Calculators need
 * JS to run anyway, so a client-driven theme has no downside here.
 */
const THEME_SCRIPT = `(function(){try{var p=new URLSearchParams(location.search);if(p.get("theme")!=="dark")document.documentElement.classList.add("light");if(p.get("bg")==="transparent"){document.documentElement.style.background="transparent";if(document.body)document.body.style.background="transparent"}}catch(e){document.documentElement.classList.add("light")}})()`;

export default async function EmbedCalculatorPage({ params }: Props) {
  const { category, slug } = await params;
  const calc = getCalculator(category, slug);
  if (!calc) notFound();
  const Component = calculatorComponents[calc.slug];
  if (!Component) notFound();

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      {/* Natural-height root (no min-h fill) so auto-resize measures it exactly.
          The document body supplies the themed/transparent background. */}
      <div id="oc-embed-root" className="w-full text-foreground">
        <div className="p-3 sm:p-4">
          <Component />
        </div>

        {/* Permanent attribution — server-rendered inside the iframe, dofollow. */}
        <a
          href={SITE_URL}
          target="_blank"
          className="flex items-center justify-center gap-1.5 border-t border-border px-4 py-2.5 text-xs text-muted transition-colors hover:text-foreground"
        >
          Powered by
          <span className="font-semibold text-primary">OnlineCalculator.tools</span>
        </a>
      </div>
      <EmbedAutoResize />
    </>
  );
}
