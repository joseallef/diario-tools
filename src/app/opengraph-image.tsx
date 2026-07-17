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
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="56"
              height="56"
              viewBox="0 0 64 64"
              fill="none"
            >
              <defs>
                <linearGradient
                  id="ogBadge"
                  x1="10"
                  y1="6"
                  x2="54"
                  y2="58"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#2dd4bf" />
                  <stop offset="0.48" stopColor="#14b8a6" />
                  <stop offset="1" stopColor="#0f766e" />
                </linearGradient>
                <linearGradient
                  id="ogSheet"
                  x1="32"
                  y1="14"
                  x2="32"
                  y2="48"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#ffffff" />
                  <stop offset="1" stopColor="#f0fdfa" />
                </linearGradient>
              </defs>
              <circle cx="32" cy="32" r="30" fill="url(#ogBadge)" />
              <ellipse cx="23" cy="20" rx="13" ry="9" fill="#ffffff" opacity="0.16" />
              <circle
                cx="32"
                cy="32"
                r="28.25"
                fill="none"
                stroke="#ffffff"
                strokeOpacity="0.22"
                strokeWidth="1.25"
              />
              <rect x="20.5" y="14.5" width="23" height="31" rx="2.75" fill="url(#ogSheet)" />
              <path d="M36.5 14.5v7.25h7.25Z" fill="#ccfbf1" />
              <path
                d="M36.5 14.5v7.25h7.25"
                fill="none"
                stroke="#5eead4"
                strokeWidth="0.9"
                strokeLinejoin="round"
              />
              <g stroke="#99f6e4" strokeWidth="1.75" strokeLinecap="round">
                <path d="M25.5 24.5h11.5" />
                <path d="M25.5 29h13" />
                <path d="M25.5 33.5h8.5" />
              </g>
              <path
                d="M24.5 41c3.6-4.6 7.4-4.8 10.4 0 2.2 3.4 5.8 2.8 8-1.6"
                fill="none"
                stroke="#0f766e"
                strokeWidth="2.1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M42.2 37.6 45.4 34.8a1.15 1.15 0 0 1 1.6 1.6l-2.8 3.2-2.35-.65Z"
                fill="#0f766e"
              />
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
