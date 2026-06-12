import { ImageResponse } from "next/og";

export const alt =
  "Online Calculator.tools — Fast, Free Calculators for Everything";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Default branded Open Graph image, generated at build time. Per-calculator
 * pages can add their own opengraph-image later; this is the site-wide
 * fallback for social sharing (SOP: auto-generate OG images).
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          background: "#09090b",
          padding: "80px",
          justifyContent: "space-between",
          fontFamily: "sans-serif",
        }}
      >
        {/* Logo lockup */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "linear-gradient(to top, #10b981, #34d399)",
            }}
          />
          <div
            style={{ display: "flex", alignItems: "baseline", gap: 12, fontSize: 34, fontWeight: 700 }}
          >
            <span style={{ color: "#fafafa" }}>ONLINE</span>
            <span style={{ color: "#a1a1aa" }}>CALCULATOR</span>
            <span style={{ color: "#10b981" }}>.tools</span>
          </div>
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{ display: "flex", fontSize: 78, fontWeight: 800, color: "#fafafa", lineHeight: 1.05 }}
          >
            Every Calculation.
          </div>
          <div
            style={{ display: "flex", fontSize: 78, fontWeight: 800, color: "#10b981", lineHeight: 1.05 }}
          >
            Solved Instantly.
          </div>
        </div>

        {/* Footer row */}
        <div
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
        >
          <div style={{ display: "flex", fontSize: 27, color: "#a1a1aa" }}>
            Finance · Health · Math · Date &amp; Time
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 26,
              fontWeight: 700,
              color: "#09090b",
              background: "#10b981",
              padding: "10px 22px",
              borderRadius: 9999,
            }}
          >
            100% Free
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
