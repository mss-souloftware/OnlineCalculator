import { Icon } from "@/components/ui/icon";
import type { LegalDoc } from "@/content/legal";

/** Renders a LegalDoc as readable prose with a sticky-free table of contents. */
export function LegalContent({ doc }: { doc: LegalDoc }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
      <p className="leading-7 text-muted">{doc.intro}</p>

      {/* On this page */}
      <nav
        aria-label="On this page"
        className="mt-8 rounded-xl border border-border bg-card p-5"
      >
        <p className="font-mono text-xs uppercase tracking-wider text-faint">
          On this page
        </p>
        <ol className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
          {doc.sections.map((s, i) => (
            <li key={s.heading}>
              <a
                href={`#section-${i}`}
                className="flex items-center gap-2 text-sm text-muted transition-colors hover:text-primary"
              >
                <span className="font-mono text-xs text-faint">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {s.heading}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="mt-10 space-y-10">
        {doc.sections.map((s, i) => (
          <section key={s.heading} id={`section-${i}`} className="scroll-mt-24">
            <h2 className="font-display text-xl font-bold tracking-tight text-foreground">
              <span className="mr-2 font-mono text-sm text-primary">
                {String(i + 1).padStart(2, "0")}
              </span>
              {s.heading}
            </h2>
            {s.body?.map((p, j) => (
              <p key={j} className="mt-4 leading-7 text-muted">
                {p}
              </p>
            ))}
            {s.list && (
              <ul className="mt-4 space-y-2.5">
                {s.list.map((item, j) => (
                  <li key={j} className="flex gap-3 leading-7 text-muted">
                    <Icon
                      name="fa-check"
                      className="mt-2 shrink-0 text-xs text-primary"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
