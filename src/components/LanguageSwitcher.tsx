"use client";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { usePathname, useRouter } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { Check, Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

const FlagBR = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 72 50"
    width="20"
    height="14"
    className="rounded-sm shadow-sm"
  >
    <rect width="72" height="50" fill="#009c3b" />
    <path d="M36 4.2L67.8 25 36 45.8 4.2 25z" fill="#ffdf00" />
    <circle cx="36" cy="25" r="10.5" fill="#002776" />
    <path d="M26.5 28c1.5 2.5 5 4 9.5 4s8-1.5 9.5-4" stroke="#fff" strokeWidth="1.5" fill="none" />
  </svg>
);

const FlagUS = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 72 50"
    width="20"
    height="14"
    className="rounded-sm shadow-sm"
  >
    <rect width="72" height="50" fill="#b22234" />
    <path d="M0 7.7h72M0 23.1h72M0 38.5h72" stroke="#fff" strokeWidth="3.8" />
    <rect width="30" height="27" fill="#3c3b6e" />
    <path
      d="M2 5h1m2 0h1m2 0h1m2 0h1m2 0h1m-9 4h1m2 0h1m2 0h1m2 0h1m2 0h1m-9 4h1m2 0h1m2 0h1m2 0h1m2 0h1m-9 4h1m2 0h1m2 0h1m2 0h1m2 0h1"
      stroke="#fff"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const languages = [
  { code: "pt", label: "Português", Icon: FlagBR },
  { code: "en", label: "English", Icon: FlagUS },
] as const;

export function LanguageSwitcher() {
  const t = useTranslations("LanguageSwitcher");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const handleLanguageChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
    setOpen(false);
  };

  const currentLang = languages.find((l) => l.code === locale);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-slate-600 hover:text-slate-900 cursor-pointer"
          aria-label={t("label")}
        >
          {currentLang ? <currentLang.Icon /> : <Globe className="h-4 w-4" />}
          <span className="hidden sm:inline-block">{currentLang?.label}</span>
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
                <lang.Icon />
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
