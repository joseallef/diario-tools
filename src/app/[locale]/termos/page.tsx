import { LegalPageView } from "@/components/seo/LegalPageView";
import { buildPageMetadata } from "@/lib/seo-metadata";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

const PATH = "/termos";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Legal.terms.seo" });

  return buildPageMetadata({
    locale,
    path: PATH,
    title: t("title"),
    description: t("description"),
    ogTitle: t("ogTitle"),
    ogDescription: t("ogDescription"),
    ogType: "website",
  });
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return <LegalPageView locale={locale} pageKey="terms" path={PATH} />;
}
