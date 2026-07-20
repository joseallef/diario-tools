import { siteConfig } from "@/config/site";
import type { Metadata } from "next";
import Script from "next/script";

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

/** Google Consent Mode v2 — default denied before any analytics tag. */
const CONSENT_DEFAULT_SCRIPT = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  wait_for_update: 500
});
`;

/** Root shell — html/body live in `[locale]/layout` for i18n. */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Script id="ga-consent-default" strategy="beforeInteractive">
        {CONSENT_DEFAULT_SCRIPT}
      </Script>
      {children}
    </>
  );
}
