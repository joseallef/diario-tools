import { siteConfig } from "@/config/site";
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name} — Assinar PDF Online`,
    short_name: siteConfig.name,
    description:
      "Assine PDF online grátis no navegador. Sem cadastro, sem upload. Privacidade total.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0f766e",
    lang: "pt-BR",
    categories: ["productivity", "utilities", "business"],
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icon",
        sizes: "48x48",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon1",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
