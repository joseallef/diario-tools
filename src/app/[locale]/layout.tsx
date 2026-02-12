import { Header } from "@/components/Header";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Assinar PDF Grátis | Ferramenta Segura e Sem Login",
    template: "%s | Assinador PDF Seguro",
  },
  description:
    "Assine documentos PDF online gratuitamente e com segurança total. Seus arquivos são processados no navegador e nunca enviados para servidores. Sem cadastro.",
  keywords: [
    "assinar pdf",
    "assinatura digital grátis",
    "assinar pdf online",
    "assinatura eletrônica",
    "editar pdf",
    "pdf signer",
    "ferramenta pdf segura",
  ],
  authors: [{ name: "Diário Tools" }],
  creator: "Diário Tools",
  publisher: "Diário Tools",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://diario.tools",
    siteName: "Assinador PDF Seguro",
    title: "Assinar PDF Grátis - Rápido, Seguro e Sem Login",
    description:
      "Assine documentos PDF online gratuitamente. Sem cadastro, sem upload para servidor. Processamento 100% seguro no seu navegador.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Assinador PDF Seguro Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Assinar PDF Grátis - Rápido e Seguro",
    description: "Assine PDFs direto no navegador. Privacidade total, sem upload de arquivos.",
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
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  // Providing all messages to the client
  // side is the easiest way to get started
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${inter.className} antialiased min-h-screen bg-slate-50 flex flex-col`}>
        <NextIntlClientProvider messages={messages}>
          <Header />
          <div className="flex-1">{children}</div>
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
