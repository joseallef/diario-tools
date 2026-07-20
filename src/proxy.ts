import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // All pathnames except API, Next internals, and files with extensions
  // (sitemap.xml, robots.txt, icons, opengraph-image, etc.).
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
