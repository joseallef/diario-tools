import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Only locale routes — never touch /sitemap.xml, /robots.txt, icons, etc.
  matcher: ["/", "/(pt|en)/:path*"],
};
