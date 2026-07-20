import {
  getLanguageAlternates,
  getLocaleUrl,
  getOgLocale,
  siteConfig,
} from "@/config/site";
import type { Metadata } from "next";

type BuildPageMetadataInput = {
  locale: string;
  path: string;
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  ogType?: "article" | "website";
};

/** Shared Metadata for content / legal pages (canonical, hreflang, OG, Twitter). */
export function buildPageMetadata({
  locale,
  path,
  title,
  description,
  ogTitle,
  ogDescription,
  ogType = "article",
}: BuildPageMetadataInput): Metadata {
  const canonical = getLocaleUrl(locale, path);
  const ogT = ogTitle ?? title;
  const ogD = ogDescription ?? description;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: getLanguageAlternates(path),
    },
    openGraph: {
      type: ogType,
      locale: getOgLocale(locale),
      url: canonical,
      siteName: siteConfig.name,
      title: ogT,
      description: ogD,
      images: [
        {
          url: new URL("/opengraph-image", siteConfig.url).toString(),
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} — ${ogT}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: ogT,
      description: ogD,
      images: [new URL("/opengraph-image", siteConfig.url).toString()],
    },
  };
}
