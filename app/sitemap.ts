import type { MetadataRoute } from "next";
import { calculatorHref, calculators, categories } from "@/content/calculators";
import { SITE_URL } from "@/lib/seo";

/**
 * Dynamic XML sitemap. Generated from the calculator catalog so new tools and
 * categories appear automatically. (When programmatic SEO pushes us past
 * ~50k URLs, split this into sitemap index files per the SOP.)
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const top: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/browse`, lastModified, changeFrequency: "weekly", priority: 0.9 },
  ];

  const categoryPages: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${SITE_URL}/${c.slug}`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const calculatorPages: MetadataRoute.Sitemap = calculators.map((c) => ({
    url: `${SITE_URL}${calculatorHref(c)}`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const staticPages: MetadataRoute.Sitemap = [
    "/about",
    "/contact",
    "/privacy-policy",
    "/terms-of-service",
    "/cookie-policy",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.4,
  }));

  return [...top, ...categoryPages, ...calculatorPages, ...staticPages];
}
