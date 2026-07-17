"use client";

import { IconAction } from "@/components/ui/icon-action";
import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const t = useTranslations("ThemeToggle");
  const isDark = theme === "dark";

  return (
    <IconAction
      label={isDark ? t("toLight") : t("toDark")}
      hint={isDark ? t("toLightHint") : t("toDarkHint")}
      variant="muted"
      side="bottom"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </IconAction>
  );
}
