import {
  Alex_Brush,
  Allura,
  Arimo,
  Caveat,
  Dancing_Script,
  EB_Garamond,
  Great_Vibes,
  Kalam,
  Pacifico,
  Parisienne,
  Roboto_Mono,
  Satisfy,
  Tinos,
} from "next/font/google";

/**
 * Use `variable` (not `className`) so loading fonts never overrides
 * the modal title, description, tabs and field labels.
 */
const elegant = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sig-elegant",
});

const allura = Allura({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sig-allura",
});

const brush = Alex_Brush({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sig-brush",
});

const script = Dancing_Script({
  weight: ["500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sig-script",
});

const classic = Parisienne({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sig-classic",
});

const smooth = Satisfy({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sig-smooth",
});

const pacific = Pacifico({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sig-pacific",
});

const casual = Caveat({
  weight: ["500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sig-casual",
});

const print = Kalam({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sig-print",
});

/** Times New Roman–compatible serif (PDF24 Serif / document). */
const documentFont = Tinos({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sig-document",
});

/** Classic book serif used in formal contracts. */
const garamond = EB_Garamond({
  weight: ["400", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sig-garamond",
});

/** Arial-compatible sans (PDF24 Sans-serif / modern). */
const sans = Arimo({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sig-sans",
});

/** PDF24-style monospace typed name. */
const mono = Roboto_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sig-mono",
});

export type SignatureFontId =
  | "sansSerif"
  | "serif"
  | "monospace"
  | "elegant"
  | "allura"
  | "brush"
  | "script"
  | "classic"
  | "smooth"
  | "pacific"
  | "casual"
  | "print"
  | "document"
  | "garamond"
  | "sans";

export type SignatureFontOption = {
  id: SignatureFontId;
  /** CSS font-family for canvas + preview samples only */
  family: string;
  cssVar: string;
  previewScale: number;
  renderScale: number;
  /** CSS font-style for preview + canvas export */
  fontStyle?: "normal" | "italic";
};

export const SIGNATURE_FONTS: SignatureFontOption[] = [
  // PDF24-style typed faces first
  {
    id: "sansSerif",
    family: sans.style.fontFamily,
    cssVar: "var(--font-sig-sans)",
    previewScale: 0.88,
    renderScale: 0.85,
  },
  {
    id: "serif",
    family: documentFont.style.fontFamily,
    cssVar: "var(--font-sig-document)",
    previewScale: 0.9,
    renderScale: 0.86,
  },
  {
    id: "monospace",
    family: mono.style.fontFamily,
    cssVar: "var(--font-sig-mono)",
    previewScale: 0.82,
    renderScale: 0.8,
  },
  // Cursivas — ordem aproximada de uso em e-signature
  {
    id: "script",
    family: script.style.fontFamily,
    cssVar: "var(--font-sig-script)",
    previewScale: 1.05,
    renderScale: 1,
  },
  {
    id: "elegant",
    family: elegant.style.fontFamily,
    cssVar: "var(--font-sig-elegant)",
    previewScale: 1.15,
    renderScale: 1.1,
  },
  {
    id: "allura",
    family: allura.style.fontFamily,
    cssVar: "var(--font-sig-allura)",
    previewScale: 1.2,
    renderScale: 1.15,
  },
  {
    id: "smooth",
    family: smooth.style.fontFamily,
    cssVar: "var(--font-sig-smooth)",
    previewScale: 1.05,
    renderScale: 1,
  },
  {
    id: "brush",
    family: brush.style.fontFamily,
    cssVar: "var(--font-sig-brush)",
    previewScale: 1.25,
    renderScale: 1.2,
  },
  {
    id: "pacific",
    family: pacific.style.fontFamily,
    cssVar: "var(--font-sig-pacific)",
    previewScale: 1,
    renderScale: 0.95,
  },
  {
    id: "classic",
    family: classic.style.fontFamily,
    cssVar: "var(--font-sig-classic)",
    previewScale: 1.12,
    renderScale: 1.08,
  },
  {
    id: "casual",
    family: casual.style.fontFamily,
    cssVar: "var(--font-sig-casual)",
    previewScale: 1.1,
    renderScale: 1.05,
  },
  {
    id: "print",
    family: print.style.fontFamily,
    cssVar: "var(--font-sig-print)",
    previewScale: 0.95,
    renderScale: 0.95,
  },
  // Digitadas / documento (itálico)
  {
    id: "document",
    family: documentFont.style.fontFamily,
    cssVar: "var(--font-sig-document)",
    previewScale: 0.92,
    renderScale: 0.88,
    fontStyle: "italic",
  },
  {
    id: "garamond",
    family: garamond.style.fontFamily,
    cssVar: "var(--font-sig-garamond)",
    previewScale: 0.95,
    renderScale: 0.9,
    fontStyle: "italic",
  },
  {
    id: "sans",
    family: sans.style.fontFamily,
    cssVar: "var(--font-sig-sans)",
    previewScale: 0.9,
    renderScale: 0.85,
    fontStyle: "italic",
  },
];

/** Dancing Script — a cursiva mais usada em assinaturas digitais. */
export const DEFAULT_SIGNATURE_FONT: SignatureFontId = "script";

export function getSignatureFont(id: SignatureFontId): SignatureFontOption {
  return SIGNATURE_FONTS.find((f) => f.id === id) ?? SIGNATURE_FONTS.find((f) => f.id === "script")!;
}

/** Only CSS variables — does not change the element's font-family. */
export const signatureFontVariablesClassName = [
  sans.variable,
  documentFont.variable,
  mono.variable,
  script.variable,
  elegant.variable,
  allura.variable,
  smooth.variable,
  brush.variable,
  pacific.variable,
  classic.variable,
  casual.variable,
  print.variable,
  garamond.variable,
].join(" ");
