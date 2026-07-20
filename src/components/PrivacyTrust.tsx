"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { HardDrive, ShieldCheck, WifiOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

const POINT_ICONS = [WifiOff, HardDrive, ShieldCheck] as const;

/** Clear, layperson-friendly privacy promise near the upload area. */
export function PrivacyTrust() {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const t = useTranslations("PrivacyTrust");
  const points = t.raw("points") as string[];

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  const handleMouseEnter = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setOpen(true);
  };

  const handleMouseLeave = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    // Keep open long enough to move into the portaled popover (same UX as before).
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  return (
    <div className="flex w-full max-w-xl flex-col items-center gap-5">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="flex cursor-pointer items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-xs font-medium text-emerald-800 select-none transition-colors hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 active:scale-95 touch-manipulation dark:border-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-100 dark:hover:bg-emerald-900/60 dark:focus:ring-emerald-400 dark:focus:ring-offset-0"
          >
            <ShieldCheck className="h-3.5 w-3.5 shrink-0" aria-hidden />
            <span>{t("badge")}</span>
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-80 p-4 text-left"
          sideOffset={5}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <p className="mb-1 text-sm font-semibold text-foreground">{t("popoverTitle")}</p>
          <p className="text-xs leading-relaxed text-muted-foreground">{t("popoverBody")}</p>
          <ul className="mt-3 space-y-2">
            {points.map((point) => (
              <li
                key={point}
                className="flex gap-2 text-xs leading-snug text-muted-foreground"
              >
                <span
                  className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-200"
                  aria-hidden
                >
                  <ShieldCheck className="h-2.5 w-2.5" />
                </span>
                {point}
              </li>
            ))}
          </ul>
        </PopoverContent>
      </Popover>

      <ul className="grid w-full gap-3 sm:grid-cols-3">
        {points.map((point, index) => {
          const Icon = POINT_ICONS[index] ?? ShieldCheck;
          return (
            <li
              key={point}
              className="flex items-start gap-2.5 rounded-lg border border-border/80 bg-muted/40 px-3 py-2.5 text-left sm:flex-col sm:items-center sm:gap-2 sm:px-2.5 sm:py-3 sm:text-center"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Icon className="h-4 w-4" aria-hidden />
              </span>
              <span className="text-xs leading-snug text-muted-foreground sm:text-[11px]">
                {point}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
