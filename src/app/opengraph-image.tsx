import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const runtime = "edge";
export const alt = "AssinarPDF — Assine PDF online grátis e com privacidade total";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "linear-gradient(135deg, #0f172a 0%, #134e4a 48%, #0f766e 100%)",
          color: "#f8fafc",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "linear-gradient(145deg, #14b8a6 0%, #0f766e 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
            </svg>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontSize: 28, fontWeight: 700, letterSpacing: -0.5 }}>
              {siteConfig.name}
            </span>
            <span style={{ fontSize: 16, color: "#99f6e4", fontWeight: 500 }}>
              {siteConfig.org}
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 900 }}>
          <div
            style={{
              fontSize: 58,
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: -1.5,
            }}
          >
            Assine PDF online grátis
          </div>
          <div style={{ fontSize: 26, color: "#ccfbf1", lineHeight: 1.35, maxWidth: 820 }}>
            Sem cadastro · Sem upload · 100% no seu navegador
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 20,
            color: "#99f6e4",
          }}
        >
          <span>Rápido · Seguro · Privado</span>
          <span style={{ fontWeight: 600 }}>
            {siteConfig.url.replace("https://", "")}
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
