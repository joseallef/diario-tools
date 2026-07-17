import { routing } from "@/i18n/routing";

export const siteConfig = {
  name: "AssinarPDF",
  org: "Lugar Certo",
  url: (
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://assinarpdf.lugarcerto.tec.br"
  ).replace(/\/$/, ""),
  localeDefault: "pt_BR" as const,
  locales: {
    pt: "pt_BR",
    en: "en_US",
  },
  keywords: {
    pt: [
      "assinar pdf",
      "assinar pdf online",
      "assinar pdf grátis",
      "assinatura digital pdf",
      "assinatura eletrônica",
      "assinar documento pdf",
      "pdf signer",
      "assinar pdf sem cadastro",
      "assinar pdf no navegador",
      "ferramenta assinar pdf",
      "assinatura pdf gratuita",
      "colocar assinatura em pdf",
    ],
    en: [
      "sign pdf",
      "sign pdf online",
      "free pdf signature",
      "electronic signature pdf",
      "pdf signer",
      "sign pdf no login",
      "sign pdf in browser",
      "add signature to pdf",
      "online pdf signer",
    ],
  },
} as const;

export type AppLocale = (typeof routing.locales)[number];

/** Absolute URL for a locale (default locale has no prefix). */
export function getLocaleUrl(locale: string, path = ""): string {
  const normalized = path.startsWith("/") ? path : path ? `/${path}` : "";

  // Match Next.js / Search Console canonicals: homepage uses a trailing slash.
  if (locale === routing.defaultLocale) {
    if (!normalized || normalized === "/") {
      return `${siteConfig.url}/`;
    }
    return `${siteConfig.url}${normalized}`;
  }

  return `${siteConfig.url}/${locale}${normalized}`;
}

/** hreflang map for alternates.languages */
export function getLanguageAlternates(path = ""): Record<string, string> {
  const languages: Record<string, string> = {
    "x-default": getLocaleUrl(routing.defaultLocale, path),
  };

  for (const locale of routing.locales) {
    languages[locale] = getLocaleUrl(locale, path);
  }

  return languages;
}

export function getOgLocale(locale: string): string {
  return siteConfig.locales[locale as AppLocale] ?? siteConfig.localeDefault;
}
