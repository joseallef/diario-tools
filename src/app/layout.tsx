import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Assinar PDF Grátis - Rápido, Seguro e Sem Login",
  description: "Assine documentos PDF online gratuitamente. Sem cadastro, sem upload para servidor. Processamento 100% seguro no seu navegador.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${inter.className} antialiased min-h-screen bg-slate-50`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
