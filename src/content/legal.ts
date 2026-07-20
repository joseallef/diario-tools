export const LEGAL_PAGES = [
  {
    key: "privacy" as const,
    path: "/privacidade",
    priority: 0.5,
    changeFrequency: "yearly" as const,
  },
  {
    key: "terms" as const,
    path: "/termos",
    priority: 0.5,
    changeFrequency: "yearly" as const,
  },
];

export type LegalPageKey = (typeof LEGAL_PAGES)[number]["key"];
