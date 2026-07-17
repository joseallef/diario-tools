import { siteConfig } from "@/config/site";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const sitemapUrl = `${siteConfig.url}/sitemap.xml`;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/private/"],
    },
    sitemap: sitemapUrl,
    // Hostname only (no protocol) — Yandex extension; Google ignores this field
    host: new URL(siteConfig.url).host,
  };
}
