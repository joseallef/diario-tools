import { getLocaleUrl } from "@/config/site";
import { routing } from "@/i18n/routing";
import type { MetadataRoute } from "next";

/**
 * Simple sitemap (no xhtml:link alternates).
 * Multi-namespace sitemaps often render as flattened text in Chrome and
 * confuse Search Console. Hreflang already ships via HTML Link / metadata.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  lastModified.setUTCHours(0, 0, 0, 0);

  return routing.locales.map((locale) => ({
    url: getLocaleUrl(locale),
    lastModified,
    changeFrequency: "weekly" as const,
    priority: locale === routing.defaultLocale ? 1 : 0.8,
  }));
}
