"use client";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { usePathname, useRouter } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { Check, Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

const languages = [
  { code: "pt", label: "Português", flag: "🇧🇷" },
  { code: "en", label: "English", flag: "🇺🇸" },
] as const;

export function LanguageSwitcher() {
  const t = useTranslations("LanguageSwitcher");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const handleLanguageChange = (newLocale: string) => {
    // @ts-expect-error -- We know the locale is valid from the list
    router.replace(pathname, { locale: newLocale });
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-slate-600 hover:text-slate-900 cursor-pointer"
          aria-label={t("label")}
        >
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline-block">
            {languages.find((l) => l.code === locale)?.label}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[150px] p-1">
        <div className="flex flex-col gap-1">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={cn(
                "flex items-center justify-between w-full px-3 py-2 text-sm rounded-md transition-colors cursor-pointer",
                locale === lang.code
                  ? "bg-slate-100 text-slate-900 font-medium"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <span className="flex items-center gap-2">
                <span className="text-base leading-none">{lang.flag}</span>
                {lang.label}
              </span>
              {locale === lang.code && <Check className="h-3.5 w-3.5 text-primary" />}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
