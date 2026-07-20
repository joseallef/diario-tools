export const GUIDE_SLUGS = [
  "como-assinar-pdf-online",
  "assinar-pdf-no-celular",
  "assinatura-eletronica-vs-digital",
] as const;

export type GuideSlug = (typeof GUIDE_SLUGS)[number];

export type GuideDef = {
  slug: GuideSlug;
  /** Relative path starting with / */
  path: string;
  /** Sitemap priority (0–1) */
  priority: number;
  changeFrequency: "weekly" | "monthly";
};

export const guides: GuideDef[] = [
  {
    slug: "como-assinar-pdf-online",
    path: "/guia/como-assinar-pdf-online",
    priority: 0.9,
    changeFrequency: "monthly",
  },
  {
    slug: "assinar-pdf-no-celular",
    path: "/guia/assinar-pdf-no-celular",
    priority: 0.85,
    changeFrequency: "monthly",
  },
  {
    slug: "assinatura-eletronica-vs-digital",
    path: "/guia/assinatura-eletronica-vs-digital",
    priority: 0.85,
    changeFrequency: "monthly",
  },
];

export function isGuideSlug(value: string): value is GuideSlug {
  return (GUIDE_SLUGS as readonly string[]).includes(value);
}

export function getGuide(slug: string): GuideDef | undefined {
  return guides.find((g) => g.slug === slug);
}

export function guidePath(slug: GuideSlug): string {
  return `/guia/${slug}`;
}
