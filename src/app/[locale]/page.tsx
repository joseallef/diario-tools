import { JsonLd } from "@/components/seo/JsonLd";
import { getLanguageAlternates, getLocaleUrl, siteConfig } from "@/config/site";
import { guides } from "@/content/guides";
import { PdfEditorPage } from "@/features/pdf-editor/components/PdfEditorPage";
import { Link } from "@/i18n/routing";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

const FAQ_KEYS = ["free", "saved", "install", "mobile", "legal", "size"] as const;
const STEP_KEYS = ["step1", "step2", "step3", "step4"] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "HomePage.seo" });
  const canonical = getLocaleUrl(locale);

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical,
      languages: getLanguageAlternates(),
    },
    openGraph: {
      title: t("ogTitle"),
      description: t("ogDescription"),
      url: canonical,
    },
  };
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "HomePage" });
  const tGuides = await getTranslations({ locale, namespace: "Guides" });
  const pageUrl = getLocaleUrl(locale);

  const faqEntities = FAQ_KEYS.map((key) => ({
    "@type": "Question" as const,
    name: t(`faq.items.${key}.question`),
    acceptedAnswer: {
      "@type": "Answer" as const,
      text: t(`faq.items.${key}.answer`),
    },
  }));

  const howToSteps = STEP_KEYS.map((key, index) => ({
    "@type": "HowToStep" as const,
    position: index + 1,
    name: t(`howTo.steps.${key}.title`).replace(/:$/, ""),
    text: `${t(`howTo.steps.${key}.title`)} ${t(`howTo.steps.${key}.description`)}`,
  }));

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
      inLanguage: locale === "en" ? "en-US" : "pt-BR",
      publisher: {
        "@type": "Organization",
        name: siteConfig.org,
        url: siteConfig.url,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: siteConfig.name,
      applicationCategory: "BusinessApplication",
      applicationSubCategory: "PDF Signer",
      operatingSystem: "Web Browser",
      url: pageUrl,
      image: `${siteConfig.url}/opengraph-image`,
      description: t("seo.description"),
      inLanguage: locale === "en" ? "en-US" : "pt-BR",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "BRL",
        availability: "https://schema.org/InStock",
      },
      featureList: [
        locale === "en" ? "Electronic PDF signature" : "Assinatura eletrônica de PDF",
        locale === "en"
          ? "Signing happens on your device — file not sent to our servers"
          : "Assinatura no seu aparelho — arquivo não enviado aos nossos servidores",
        locale === "en" ? "No signup required" : "Sem cadastro",
        locale === "en" ? "Free to use" : "Grátis para usar",
        locale === "en" ? "Draw or type signature" : "Desenhar ou digitar assinatura",
      ],
      publisher: {
        "@type": "Organization",
        name: siteConfig.org,
        url: siteConfig.url,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: t("howTo.title"),
      description: t("howTo.description"),
      totalTime: "PT2M",
      supply: [
        {
          "@type": "HowToSupply",
          name: locale === "en" ? "PDF document" : "Documento PDF",
        },
      ],
      tool: [
        {
          "@type": "HowToTool",
          name: siteConfig.name,
        },
      ],
      step: howToSteps,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqEntities,
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: siteConfig.org,
      url: siteConfig.url,
      brand: {
        "@type": "Brand",
        name: siteConfig.name,
      },
    },
  ];

  return (
    <>
      <JsonLd data={jsonLd} />

      <main>
        <PdfEditorPage />

        <section className="border-t border-border bg-background px-4 py-16">
          <div className="mx-auto max-w-4xl space-y-12 text-muted-foreground">
            <div id="como-assinar" className="scroll-mt-24 space-y-4">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                {t("howTo.title")}
              </h2>
              <p className="text-base leading-relaxed">{t("howTo.description")}</p>
              <ol className="list-decimal space-y-2 pl-5 marker:font-bold">
                {STEP_KEYS.map((key) => (
                  <li key={key}>
                    <strong>{t(`howTo.steps.${key}.title`)}</strong>{" "}
                    {t(`howTo.steps.${key}.description`)}
                  </li>
                ))}
              </ol>
            </div>

            <div id="recursos" className="scroll-mt-24 space-y-4">
              <h2 className="text-2xl font-bold text-foreground">{t("features.title")}</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {(["privacy", "noSignup", "fast", "compatibility"] as const).map((key) => (
                  <article
                    key={key}
                    className={`rounded-lg border p-5 ${
                      key === "privacy"
                        ? "border-emerald-200 bg-emerald-50/60 dark:border-emerald-800 dark:bg-emerald-950/30"
                        : "border-border bg-card"
                    }`}
                  >
                    <h3 className="mb-2 font-semibold text-foreground">
                      {t(`features.items.${key}.title`)}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {t(`features.items.${key}.description`)}
                    </p>
                  </article>
                ))}
              </div>
            </div>

            <div id="faq" className="scroll-mt-24 space-y-4">
              <h2 className="text-2xl font-bold text-foreground">{t("faq.title")}</h2>
              <div className="space-y-4">
                {FAQ_KEYS.map((key) => (
                  <details
                    key={key}
                    className="group rounded-lg border border-border bg-card p-4 [&_summary::-webkit-details-marker]:hidden"
                  >
                    <summary className="flex cursor-pointer items-center justify-between gap-1.5 font-medium text-foreground">
                      <span>{t(`faq.items.${key}.question`)}</span>
                      <span className="transition-transform duration-300 group-open:-rotate-180">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="h-5 w-5"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                          />
                        </svg>
                      </span>
                    </summary>
                    <p className="mt-4 leading-relaxed text-muted-foreground">
                      {t(`faq.items.${key}.answer`)}
                    </p>
                  </details>
                ))}
              </div>
            </div>

            <div id="guias" className="scroll-mt-24 space-y-4">
              <h2 className="text-2xl font-bold text-foreground">{t("guides.title")}</h2>
              <p className="text-base leading-relaxed">{t("guides.description")}</p>
              <ul className="grid gap-3 sm:grid-cols-3">
                {guides.map((guide) => (
                  <li key={guide.slug}>
                    <Link
                      href={guide.path}
                      className="flex h-full flex-col rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-primary/5"
                    >
                      <span className="font-semibold text-foreground">
                        {tGuides(`items.${guide.slug}.title`)}
                      </span>
                      <span className="mt-2 text-sm text-muted-foreground">
                        {tGuides(`items.${guide.slug}.description`)}
                      </span>
                      <span className="mt-3 text-sm font-medium text-primary">
                        {t("guides.readGuide")}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
