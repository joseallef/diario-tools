import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Link } from "@/i18n/routing";
import { FileSignature } from "lucide-react";
import { useTranslations } from "next-intl";

export function Header() {
  const t = useTranslations("Header");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <FileSignature className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-slate-900 leading-none">
                {t("appName")}
              </span>
              <span className="text-[10px] text-slate-500 font-medium leading-none">
                {t("description")}
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
