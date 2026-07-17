/** Shared AssinarPDF mark — circular teal badge with pen stroke. */
export const BRAND_TEAL = "#0f766e";
export const BRAND_TEAL_LIGHT = "#14b8a6";

type BrandIconMarkProps = {
  size: number;
};

/**
 * Circular favicon mark for ImageResponse (Satori).
 * Transparent canvas + full circle so Google/browser circle-crops look intentional.
 */
export function BrandIconMark({ size }: BrandIconMarkProps) {
  const pad = Math.round(size * 0.06);
  const circle = size - pad * 2;
  const icon = Math.round(circle * 0.48);

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
      <div
        style={{
          width: circle,
          height: circle,
          borderRadius: "50%",
          background: `linear-gradient(145deg, ${BRAND_TEAL_LIGHT} 0%, ${BRAND_TEAL} 100%)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#ffffff",
          boxShadow: `inset 0 ${Math.max(1, Math.round(size * 0.02))}px ${Math.max(2, Math.round(size * 0.04))}px rgba(255,255,255,0.25)`,
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={icon}
          height={icon}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
        </svg>
      </div>
    </div>
  );
}
