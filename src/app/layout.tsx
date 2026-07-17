import { siteConfig } from "@/config/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Assinar PDF Online Grátis | AssinarPDF",
    template: `%s | ${siteConfig.name}`,
  },
  description:
    "Assine PDF online grátis no navegador. Sem cadastro, sem upload para servidores. Privacidade total.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon", sizes: "48x48", type: "image/png" },
      { url: "/icon1", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon", sizes: "180x180", type: "image/png" }],
  },
};

/** Root shell — html/body live in `[locale]/layout` for i18n. */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
