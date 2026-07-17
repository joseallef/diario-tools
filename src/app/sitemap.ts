import { getLocaleUrl } from "@/config/site";
import { routing } from "@/i18n/routing";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const languages = Object.fromEntries(
    routing.locales.map((locale) => [locale, getLocaleUrl(locale)])
  ) as Record<string, string>;

  languages["x-default"] = getLocaleUrl(routing.defaultLocale);

  return routing.locales.map((locale) => ({
    url: getLocaleUrl(locale),
    lastModified,
    changeFrequency: "weekly" as const,
    priority: locale === routing.defaultLocale ? 1 : 0.9,
    alternates: {
      languages,
    },
  }));
}
