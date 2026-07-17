"use client";

import { BrandLogo } from "@/components/brand/BrandLogo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";

const ThemeToggle = dynamic(
  () => import("@/components/ThemeToggle").then((mod) => mod.ThemeToggle),
  { ssr: false }
);

export function Header() {
  const t = useTranslations("Header");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
            <BrandLogo className="h-8 w-8 shrink-0 drop-shadow-sm" />
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-foreground leading-none">
                {t("appName")}
              </span>
              <span className="text-[10px] text-muted-foreground font-medium leading-none">
                {t("description")}
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
