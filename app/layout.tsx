import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Clarity } from "@/components/analytics/Clarity";

// Brand typography — Plus Jakarta Sans (display), Inter (UI), Roboto Mono (data).
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});
const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = "https://onlinecalculator.tools";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Online Calculator.tools — Fast, Free Calculators for Everything",
    template: "%s | Online Calculator.tools",
  },
  description:
    "A lightning-fast collection of free online calculators for finance, health, math and dates. Mortgage, loan, BMI, percentage, age and more — no sign-up, instant results.",
  keywords: [
    "online calculator",
    "free calculator",
    "mortgage calculator",
    "loan calculator",
    "BMI calculator",
    "percentage calculator",
    "compound interest calculator",
    "age calculator",
    "financial calculators",
    "health calculators",
  ],
  applicationName: "Online Calculator.tools",
  authors: [{ name: "Online Calculator.tools" }],
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Online Calculator.tools",
    title: "Online Calculator.tools — Fast, Free Calculators for Everything",
    description:
      "Free online calculators for finance, health, math and dates. Instant results, no sign-up, mobile-friendly.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Online Calculator.tools — Fast, Free Calculators for Everything",
    description:
      "Free online calculators for finance, health, math and dates. Instant results, no sign-up.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${jakarta.variable} ${inter.variable} ${robotoMono.variable} h-full`}
    >
      <head>
        {/* Font Awesome 6 (icon-only UI — no images, no emoji). */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
          integrity="sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className="flex min-h-full flex-col">
        <ThemeProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
        <Clarity />
      </body>
    </html>
  );
}
