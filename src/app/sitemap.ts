import { getLocaleUrl } from "@/config/site";
import { guides } from "@/content/guides";
import { LEGAL_PAGES } from "@/content/legal";
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

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    entries.push({
      url: getLocaleUrl(locale),
      lastModified,
      changeFrequency: "weekly",
      priority: locale === routing.defaultLocale ? 1 : 0.8,
    });

    for (const guide of guides) {
      entries.push({
        url: getLocaleUrl(locale, guide.path),
        lastModified,
        changeFrequency: guide.changeFrequency,
        priority: guide.priority,
      });
    }

    for (const page of LEGAL_PAGES) {
      entries.push({
        url: getLocaleUrl(locale, page.path),
        lastModified,
        changeFrequency: page.changeFrequency,
        priority: page.priority,
      });
    }
  }

  return entries;
}
