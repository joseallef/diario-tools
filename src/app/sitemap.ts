import { routing } from "@/i18n/routing";
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://diario.tools";

  return routing.locales.map((locale) => ({
    url: locale === routing.defaultLocale ? baseUrl : `${baseUrl}/${locale}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 1,
  }));
}
