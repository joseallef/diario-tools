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
          className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-medium border border-green-200 cursor-pointer select-none hover:bg-green-100 transition-colors active:scale-95 touch-manipulation focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
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
        <p className="font-semibold mb-1 text-sm text-slate-900">{t("title")}</p>
        <p className="text-xs text-slate-500 leading-relaxed">{t("description")}</p>
      </PopoverContent>
    </Popover>
  );
}
