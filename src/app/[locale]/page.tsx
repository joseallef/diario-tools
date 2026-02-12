import { PdfEditorPage } from "@/features/pdf-editor/components/PdfEditorPage";
import { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "HomePage.seo" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: "https://diario.tools",
      languages: {
        pt: "https://diario.tools/pt",
        en: "https://diario.tools/en",
      },
    },
  };
}

export default function Home() {
  const t = useTranslations("HomePage");

  // JSON-LD could also be localized if needed, but schema.org is language agnostic mostly.
  // We can inject localized description though.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Assinador PDF Seguro",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "BRL",
    },
    description: t("seo.description"),
    featureList: "Assinatura digital, Edição de PDF, Processamento Local, Sem Login, Zero Upload",
    inLanguage: "pt-BR, en-US",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PdfEditorPage />

      {/* Conteúdo SEO - Visível para usuários e crawlers, posicionado abaixo da dobra */}
      <section className="bg-white py-16 px-4 border-t border-slate-200">
        <div className="max-w-4xl mx-auto space-y-12 text-slate-700">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">{t("howTo.title")}</h2>
            <p>{t("howTo.description")}</p>
            <ol className="list-decimal pl-5 space-y-2 marker:font-bold">
              <li>
                <strong>{t("howTo.steps.step1.title")}</strong> {t("howTo.steps.step1.description")}
              </li>
              <li>
                <strong>{t("howTo.steps.step2.title")}</strong> {t("howTo.steps.step2.description")}
              </li>
              <li>
                <strong>{t("howTo.steps.step3.title")}</strong> {t("howTo.steps.step3.description")}
              </li>
              <li>
                <strong>{t("howTo.steps.step4.title")}</strong> {t("howTo.steps.step4.description")}
              </li>
            </ol>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">{t("features.title")}</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 bg-slate-50 rounded-lg">
                <h3 className="font-semibold text-slate-900 mb-2">
                  {t("features.items.privacy.title")}
                </h3>
                <p className="text-sm">{t("features.items.privacy.description")}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <h3 className="font-semibold text-slate-900 mb-2">
                  {t("features.items.noSignup.title")}
                </h3>
                <p className="text-sm">{t("features.items.noSignup.description")}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <h3 className="font-semibold text-slate-900 mb-2">
                  {t("features.items.fast.title")}
                </h3>
                <p className="text-sm">{t("features.items.fast.description")}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <h3 className="font-semibold text-slate-900 mb-2">
                  {t("features.items.compatibility.title")}
                </h3>
                <p className="text-sm">{t("features.items.compatibility.description")}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">{t("faq.title")}</h2>
            <div className="space-y-4">
              <details className="group border border-slate-200 rounded-lg p-4 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between gap-1.5 font-medium text-slate-900">
                  <span>{t("faq.items.free.question")}</span>
                  <span className="group-open:-rotate-180 transition-transform duration-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                      />
                    </svg>
                  </span>
                </summary>
                <p className="mt-4 leading-relaxed text-slate-600">{t("faq.items.free.answer")}</p>
              </details>

              <details className="group border border-slate-200 rounded-lg p-4 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between gap-1.5 font-medium text-slate-900">
                  <span>{t("faq.items.saved.question")}</span>
                  <span className="group-open:-rotate-180 transition-transform duration-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                      />
                    </svg>
                  </span>
                </summary>
                <p className="mt-4 leading-relaxed text-slate-600">{t("faq.items.saved.answer")}</p>
              </details>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
