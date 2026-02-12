import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ["pt", "en"],

  // Used when no locale matches
  defaultLocale: "pt",

  // Prefix for default locale (optional, but good for explicit SEO)
  // 'as-needed' hides prefix for default locale (e.g. / for pt, /en for en)
  localePrefix: "as-needed",
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
