"use client";

import { BrandLogo } from "@/components/brand/BrandLogo";
import { siteConfig } from "@/config/site";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("Footer");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-md space-y-3">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <BrandLogo className="h-8 w-8 shrink-0 drop-shadow-sm" />
              <span className="text-base font-bold text-foreground">{siteConfig.name}</span>
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground">{t("tagline")}</p>
            <p className="text-xs text-muted-foreground">{t("privacy")}</p>
          </div>

          <nav
            aria-label={t("navLabel")}
            className="grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-10"
          >
            <div className="flex flex-col gap-2 text-sm">
              <p className="font-medium text-foreground">{siteConfig.name}</p>
              <Link
                href="/#como-assinar"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {t("links.howTo")}
              </Link>
              <Link
                href="/#recursos"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {t("links.features")}
              </Link>
              <Link
                href="/#faq"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {t("links.faq")}
              </Link>
            </div>

            <div className="flex flex-col gap-2 text-sm">
              <p className="font-medium text-foreground">{t("guidesLabel")}</p>
              <Link
                href="/guia/como-assinar-pdf-online"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {t("links.guideOnline")}
              </Link>
              <Link
                href="/guia/assinar-pdf-no-celular"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {t("links.guideMobile")}
              </Link>
              <Link
                href="/guia/assinatura-eletronica-vs-digital"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {t("links.guideVs")}
              </Link>
            </div>

            <div className="flex flex-col gap-2 text-sm">
              <p className="font-medium text-foreground">{t("legalLabel")}</p>
              <Link
                href="/privacidade"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {t("links.privacyPolicy")}
              </Link>
              <Link
                href="/termos"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {t("links.terms")}
              </Link>
            </div>
          </nav>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.name} · {siteConfig.org}
          </p>
          <p>{t("rights")}</p>
        </div>
      </div>
    </footer>
  );
}
