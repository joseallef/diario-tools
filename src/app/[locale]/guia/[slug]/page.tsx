import { ContentPage, type ContentSection } from "@/components/seo/ContentPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { getLocaleUrl, siteConfig } from "@/config/site";
import {
  GUIDE_SLUGS,
  getGuide,
  guides,
  isGuideSlug,
  type GuideSlug,
} from "@/content/guides";
import { routing } from "@/i18n/routing";
import { buildPageMetadata } from "@/lib/seo-metadata";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

const SECTION_KEYS: Record<GuideSlug, readonly string[]> = {
  "como-assinar-pdf-online": ["what", "steps", "tips", "privacy"],
  "assinar-pdf-no-celular": ["why", "steps", "tips", "privacy"],
  "assinatura-eletronica-vs-digital": ["electronic", "digital", "when", "privacy"],
};

const FAQ_KEYS: Record<GuideSlug, readonly string[]> = {
  "como-assinar-pdf-online": ["free", "offline", "legal"],
  "assinar-pdf-no-celular": ["android", "iphone", "app"],
  "assinatura-eletronica-vs-digital": ["valid", "certificate", "choose"],
};

type PageParams = Promise<{ locale: string; slug: string }>;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    GUIDE_SLUGS.map((slug) => ({ locale, slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: PageParams;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isGuideSlug(slug)) {
    return {};
  }

  const t = await getTranslations({
    locale,
    namespace: `Guides.items.${slug}.seo`,
  });

  return buildPageMetadata({
    locale,
    path: `/guia/${slug}`,
    title: t("title"),
    description: t("description"),
    ogTitle: t("ogTitle"),
    ogDescription: t("ogDescription"),
  });
}

export default async function GuidePage({ params }: { params: PageParams }) {
  const { locale, slug } = await params;
  if (!isGuideSlug(slug)) {
    notFound();
  }

  const guide = getGuide(slug);
  if (!guide) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "Guides" });
  const tItem = await getTranslations({
    locale,
    namespace: `Guides.items.${slug}`,
  });
  const pageUrl = getLocaleUrl(locale, guide.path);
  const inLanguage = locale === "en" ? "en-US" : "pt-BR";

  const sections: ContentSection[] = SECTION_KEYS[slug].map((key) => {
    const paragraphs = tItem.raw(`sections.${key}.paragraphs`) as string[];
    const listKey = `sections.${key}.list`;
    const list = tItem.has(listKey) ? (tItem.raw(listKey) as string[]) : undefined;

    return {
      title: tItem(`sections.${key}.title`),
      paragraphs,
      list: Array.isArray(list) ? list : undefined,
    };
  });

  const faqItems = FAQ_KEYS[slug].map((key) => ({
    question: tItem(`faq.${key}.question`),
    answer: tItem(`faq.${key}.answer`),
  }));

  const relatedLinks = guides
    .filter((g) => g.slug !== slug)
    .map((g) => ({
      title: t(`items.${g.slug}.title`),
      href: g.path,
      description: t(`items.${g.slug}.description`),
    }));

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: tItem("title"),
      description: tItem("seo.description"),
      inLanguage,
      author: {
        "@type": "Organization",
        name: siteConfig.org,
        url: siteConfig.url,
      },
      publisher: {
        "@type": "Organization",
        name: siteConfig.org,
        url: siteConfig.url,
      },
      mainEntityOfPage: pageUrl,
      url: pageUrl,
      image: `${siteConfig.url}/opengraph-image`,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: t("breadcrumbHome"),
          item: getLocaleUrl(locale),
        },
        {
          "@type": "ListItem",
          position: 2,
          name: tItem("title"),
          item: pageUrl,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    },
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <ContentPage
        breadcrumb={[
          { label: t("breadcrumbHome"), href: "/" },
          { label: tItem("title") },
        ]}
        title={tItem("title")}
        intro={tItem("intro")}
        sections={sections}
        faq={{
          title: t("faqTitle"),
          items: faqItems,
        }}
        ctaLabel={t("cta")}
        related={{
          title: t("relatedTitle"),
          links: relatedLinks,
        }}
      />
    </>
  );
}
