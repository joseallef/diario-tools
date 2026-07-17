"use client";

import { Link } from "@/i18n/routing";
import { siteConfig } from "@/config/site";
import { FileSignature } from "lucide-react";
import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("Footer");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-md space-y-3">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <FileSignature className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-base font-bold text-foreground">{siteConfig.name}</span>
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground">{t("tagline")}</p>
            <p className="text-xs text-muted-foreground">{t("privacy")}</p>
          </div>

          <nav aria-label={t("navLabel")} className="flex flex-col gap-2 text-sm">
            <a href="#como-assinar" className="text-muted-foreground transition-colors hover:text-foreground">
              {t("links.howTo")}
            </a>
            <a href="#recursos" className="text-muted-foreground transition-colors hover:text-foreground">
              {t("links.features")}
            </a>
            <a href="#faq" className="text-muted-foreground transition-colors hover:text-foreground">
              {t("links.faq")}
            </a>
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
