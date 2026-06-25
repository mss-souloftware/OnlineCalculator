"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { SITE_URL } from "@/lib/seo";

type Theme = "light" | "dark";

/**
 * "Embed this tool" button + a code-generator modal. Shown under built
 * calculators on the main site so people can drop the widget into their own
 * pages. The snippet points at the static, framable `/embed/...` route; the
 * attribution link is baked into that route, so the snippet stays clean.
 */
export function EmbedTool({
  category,
  slug,
  name,
}: {
  category: string;
  slug: string;
  name: string;
}) {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>("light");
  const [transparent, setTransparent] = useState(false);
  const [autoResize, setAutoResize] = useState(true);
  const [height, setHeight] = useState(560);
  const [manualHeight, setManualHeight] = useState(false);
  const [copied, setCopied] = useState(false);

  const query = `?theme=${theme}${transparent ? "&bg=transparent" : ""}`;
  // Relative for the in-app preview (works in any environment); absolute in the
  // copyable snippet so it resolves on the embedder's site.
  const previewSrc = `/embed/${category}/${slug}${query}`;

  const iframeTag = [
    `<iframe`,
    `  src="${SITE_URL}/embed/${category}/${slug}${query}"`,
    `  width="100%"`,
    `  height="${height}"`,
    `  style="border:1px solid #27272a;border-radius:12px;"`,
    `  loading="lazy"`,
    `  scrolling="no"`,
    `  title="${name}">`,
    `</iframe>`,
  ].join("\n");
  // Opt-in host listener that resizes the iframe to the widget's content height.
  // Matches the sender by contentWindow so multiple embeds on a page each fit.
  const resizeScript = `<script>(function(){window.addEventListener("message",function(e){if(e.origin!=="${SITE_URL}"||!e.data||e.data.type!=="oc-embed-resize")return;var f=document.getElementsByTagName("iframe");for(var i=0;i<f.length;i++){if(f[i].contentWindow===e.source)f[i].style.height=e.data.height+"px"}})})();</script>`;
  const snippet = autoResize ? `${iframeTag}\n${resizeScript}` : iframeTag;

  async function copy() {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — no-op */
    }
  }

  // Auto-fit the preview height to the widget's natural content (until the user
  // overrides it). Measures #oc-embed-root, the natural-height content wrapper.
  function measure(e: React.SyntheticEvent<HTMLIFrameElement>) {
    if (manualHeight) return;
    try {
      const root = e.currentTarget.contentDocument?.getElementById("oc-embed-root");
      const h = root?.getBoundingClientRect().height;
      if (h) setHeight(Math.ceil(h));
    } catch {
      /* cross-origin (prod domain) — keep the current height */
    }
  }

  return (
    <>
      <div className="mt-10 flex justify-center">
        <Button variant="outline" size="md" onClick={() => setOpen(true)}>
          <Icon name="fa-code" />
          Embed this tool
        </Button>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Embed this calculator">
        <p className="text-sm leading-6 text-muted">
          Add the {name} to your own website. Choose a theme, then copy the HTML
          snippet and paste it where you want the widget to appear.
        </p>

        <div className="mt-5 flex flex-wrap items-end gap-4">
          <div className="min-w-[10rem] flex-1">
            <label className="text-xs font-medium uppercase tracking-wide text-faint">
              Theme
            </label>
            <SegmentedControl
              className="mt-1.5"
              ariaLabel="Embed theme"
              options={[
                { value: "light", label: "Light" },
                { value: "dark", label: "Dark" },
              ]}
              value={theme}
              onChange={(t) => setTheme(t)}
            />
          </div>
          <div className="min-w-[10rem] flex-1">
            <label className="text-xs font-medium uppercase tracking-wide text-faint">
              Background
            </label>
            <SegmentedControl
              className="mt-1.5"
              ariaLabel="Embed background"
              options={[
                { value: "solid", label: "Solid" },
                { value: "transparent", label: "Transparent" },
              ]}
              value={transparent ? "transparent" : "solid"}
              onChange={(v) => setTransparent(v === "transparent")}
            />
          </div>
          <div>
            <label
              htmlFor="embed-height"
              className="text-xs font-medium uppercase tracking-wide text-faint"
            >
              {autoResize ? "Initial height" : "Height (px)"}
            </label>
            <input
              id="embed-height"
              type="number"
              inputMode="numeric"
              value={Number.isNaN(height) ? "" : height}
              onChange={(e) => {
                setManualHeight(true);
                setHeight(Math.max(200, Math.trunc(Number(e.target.value) || 0)));
              }}
              className="mt-1.5 w-28 rounded-lg border border-border bg-background px-3 py-2 text-center font-mono text-sm text-foreground transition-colors hover:border-border-strong focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </div>
        </div>

        <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-background p-3.5">
          <input
            type="checkbox"
            checked={autoResize}
            onChange={(e) => setAutoResize(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--primary)]"
          />
          <span className="text-sm leading-5 text-foreground">
            Auto-resize height{" "}
            <span className="font-normal text-muted">(recommended)</span>
            <span className="mt-0.5 block text-xs font-normal text-faint">
              Adds a tiny script so the widget grows to fit its content — no
              clipping when fields stack in narrow columns.
            </span>
          </span>
        </label>

        <div className="mt-5">
          <p className="text-xs font-medium uppercase tracking-wide text-faint">
            Live preview
          </p>
          <div className="mt-1.5 overflow-hidden rounded-xl border border-border">
            <iframe
              key={`${theme}-${transparent}`}
              src={previewSrc}
              title={`${name} preview`}
              scrolling="no"
              onLoad={measure}
              style={{ height }}
              className="block w-full"
            />
          </div>
          <p className="mt-1.5 text-xs text-faint">
            Height is fitted to this preview. In very narrow columns the widget
            gets taller as fields stack — nudge the height up if it clips.
          </p>
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs font-medium uppercase tracking-wide text-faint">
              Embed code
            </p>
            <button
              onClick={copy}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary-to"
            >
              <Icon name={copied ? "fa-check" : "fa-copy"} className="text-xs" />
              {copied ? "Copied" : "Copy to clipboard"}
            </button>
          </div>
          <pre className="mt-1.5 overflow-x-auto rounded-xl border border-border bg-background p-3.5 text-xs leading-5 text-muted">
            <code className="font-mono">{snippet}</code>
          </pre>
        </div>
      </Modal>
    </>
  );
}
