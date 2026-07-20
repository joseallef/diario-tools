import { ConsentAnalytics } from "@/components/consent/ConsentAnalytics";
import { ConsentProvider } from "@/components/consent/ConsentProvider";
import { CookieBanner } from "@/components/consent/CookieBanner";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Toaster } from "@/components/ui/sonner";
import {
  getLanguageAlternates,
  getLocaleUrl,
  getOgLocale,
  siteConfig,
} from "@/config/site";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "HomePage.seo" });
  const canonical = getLocaleUrl(locale);
  const keywords =
    locale === "en" ? [...siteConfig.keywords.en] : [...siteConfig.keywords.pt];

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: t("title"),
      template: `%s | ${siteConfig.name}`,
    },
    description: t("description"),
    keywords,
    applicationName: siteConfig.name,
    authors: [{ name: siteConfig.org, url: siteConfig.url }],
    creator: siteConfig.org,
    publisher: siteConfig.org,
    category: "productivity",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    alternates: {
      canonical,
      languages: getLanguageAlternates(),
    },
    openGraph: {
      type: "website",
      locale: getOgLocale(locale),
      url: canonical,
      siteName: siteConfig.name,
      title: t("ogTitle"),
      description: t("ogDescription"),
      images: [
        {
          url: new URL("/opengraph-image", siteConfig.url).toString(),
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} — ${t("ogTitle")}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("ogTitle"),
      description: t("ogDescription"),
      images: [new URL("/opengraph-image", siteConfig.url).toString()],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    other: {
      "theme-color": "#0f766e",
    },
    icons: {
      icon: [
        { url: "/favicon.svg", type: "image/svg+xml" },
        { url: "/icon", sizes: "48x48", type: "image/png" },
        { url: "/icon1", sizes: "192x192", type: "image/png" },
      ],
      apple: [{ url: "/apple-icon", sizes: "180x180", type: "image/png" }],
      shortcut: ["/favicon.svg"],
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${inter.className} antialiased min-h-screen flex flex-col`}>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
            <ConsentProvider>
              <Header />
              <div className="flex-1">{children}</div>
              <Footer />
              <Toaster />
              <CookieBanner />
              <ConsentAnalytics />
            </ConsentProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
