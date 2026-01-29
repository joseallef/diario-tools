import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://diario.tools";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    // Se tivermos outras páginas no futuro (ex: /sobre, /termos), adicionamos aqui
  ];
}
