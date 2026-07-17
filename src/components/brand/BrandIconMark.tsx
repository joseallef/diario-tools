/** Shared AssinarPDF mark — circular teal badge with signed document. */
export const BRAND_TEAL = "#0f766e";
export const BRAND_TEAL_MID = "#14b8a6";
export const BRAND_TEAL_LIGHT = "#2dd4bf";

type BrandIconMarkProps = {
  size: number;
};

/**
 * Circular favicon mark for ImageResponse (Satori).
 * Document + signature stay inside a safe inset so nothing clips the circle.
 */
export function BrandIconMark({ size }: BrandIconMarkProps) {
  const pad = Math.round(size * 0.04);
  const circle = size - pad * 2;

  return (
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={circle}
        height={circle}
        viewBox="0 0 64 64"
        fill="none"
      >
        <defs>
          <linearGradient id="badge" x1="10" y1="6" x2="54" y2="58" gradientUnits="userSpaceOnUse">
            <stop stopColor={BRAND_TEAL_LIGHT} />
            <stop offset="0.48" stopColor={BRAND_TEAL_MID} />
            <stop offset="1" stopColor={BRAND_TEAL} />
          </linearGradient>
          <linearGradient id="sheet" x1="32" y1="14" x2="32" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ffffff" />
            <stop offset="1" stopColor="#f0fdfa" />
          </linearGradient>
        </defs>

        <circle cx="32" cy="32" r="30" fill="url(#badge)" />
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

        <rect x="20.5" y="14.5" width="23" height="31" rx="2.75" fill="url(#sheet)" />
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
          stroke={BRAND_TEAL}
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M42.2 37.6 45.4 34.8a1.15 1.15 0 0 1 1.6 1.6l-2.8 3.2-2.35-.65Z"
          fill={BRAND_TEAL}
        />
      </svg>
    </div>
  );
}
