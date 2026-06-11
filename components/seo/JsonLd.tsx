/**
 * Renders a JSON-LD <script> for structured data / rich results.
 * Server component — the script is part of the prerendered HTML so crawlers
 * see it immediately.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Escape `<` to its unicode form to prevent XSS via stringified data,
      // per the Next.js JSON-LD guide.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
