import { ContentPage, type ContentSection } from "@/components/seo/ContentPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { getLocaleUrl, siteConfig } from "@/config/site";
import type { LegalPageKey } from "@/content/legal";
import { getTranslations } from "next-intl/server";

const SECTION_KEYS: Record<LegalPageKey, readonly string[]> = {
  privacy: [
    "controller",
    "local",
    "data",
    "legalBases",
    "cookies",
    "international",
    "rights",
    "contact",
    "security",
    "changes",
  ],
  terms: ["service", "acceptable", "disclaimer", "limits", "liability", "changes"],
};

type LegalPageViewProps = {
  locale: string;
  pageKey: LegalPageKey;
  path: string;
};

export async function LegalPageView({ locale, pageKey, path }: LegalPageViewProps) {
  const tNav = await getTranslations({ locale, namespace: "Guides" });
  const t = await getTranslations({ locale, namespace: `Legal.${pageKey}` });
  const pageUrl = getLocaleUrl(locale, path);
  const inLanguage = locale === "en" ? "en-US" : "pt-BR";

  const interpolate = (value: string) =>
    value
      .replaceAll("{privacyEmail}", siteConfig.privacyEmail)
      .replaceAll("{org}", siteConfig.org)
      .replaceAll("{siteUrl}", siteConfig.url);

  const sections: ContentSection[] = SECTION_KEYS[pageKey].map((key) => {
    const paragraphs = (t.raw(`sections.${key}.paragraphs`) as string[]).map(interpolate);
    const listRaw = t.has(`sections.${key}.list`)
      ? (t.raw(`sections.${key}.list`) as string[])
      : undefined;
    const list = Array.isArray(listRaw) ? listRaw.map(interpolate) : undefined;
    const afterRaw = t.has(`sections.${key}.paragraphsAfter`)
      ? (t.raw(`sections.${key}.paragraphsAfter`) as string[])
      : undefined;
    const paragraphsAfter = Array.isArray(afterRaw) ? afterRaw.map(interpolate) : undefined;

    return {
      title: t(`sections.${key}.title`),
      paragraphs,
      list,
      paragraphsAfter,
    };
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: t("title"),
    description: t("seo.description"),
    url: pageUrl,
    inLanguage,
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.org,
      url: siteConfig.url,
    },
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <ContentPage
        breadcrumb={[
          { label: tNav("breadcrumbHome"), href: "/" },
          { label: t("title") },
        ]}
        title={t("title")}
        intro={interpolate(t("intro"))}
        meta={t("updated")}
        sections={sections}
        ctaLabel={tNav("cta")}
      />
    </>
  );
}
