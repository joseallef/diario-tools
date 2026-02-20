import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

export function PrivacyBadge() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("PrivacyBadge");

  const handleMouseEnter = () => setOpen(true);
  const handleMouseLeave = () => setOpen(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer select-none transition-colors active:scale-95 touch-manipulation focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 border bg-green-50 text-green-700 border-green-200 hover:bg-green-100 dark:bg-emerald-900/40 dark:text-emerald-100 dark:border-emerald-700 dark:hover:bg-emerald-900 dark:focus:ring-emerald-400 dark:focus:ring-offset-0"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{t("trigger")}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="max-w-xs text-center p-4"
        sideOffset={5}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <p className="font-semibold mb-1 text-sm text-foreground">{t("title")}</p>
        <p className="text-xs text-muted-foreground leading-relaxed">{t("description")}</p>
      </PopoverContent>
    </Popover>
  );
}
