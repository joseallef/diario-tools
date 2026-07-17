import { getLocaleUrl, siteConfig } from "@/config/site";
import { routing } from "@/i18n/routing";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  // Stable timestamp (date-only) avoids noisy diffs and helps crawlers
  const lastModified = new Date();
  lastModified.setUTCHours(0, 0, 0, 0);

  const languages: Record<string, string> = {
    pt: getLocaleUrl("pt"),
    en: getLocaleUrl("en"),
    "x-default": getLocaleUrl(routing.defaultLocale),
  };

  return routing.locales.map((locale) => ({
    url: getLocaleUrl(locale),
    lastModified,
    changeFrequency: "weekly" as const,
    priority: locale === routing.defaultLocale ? 1 : 0.8,
    alternates: {
      languages,
    },
  }));
}

/** Used by robots.txt — keep in sync with the public sitemap path. */
export const SITEMAP_PATH = `${siteConfig.url}/sitemap.xml`;
