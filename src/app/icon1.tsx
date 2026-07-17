import { BrandIconMark } from "@/components/brand/BrandIconMark";
import { ImageResponse } from "next/og";

export const size = {
  width: 192,
  height: 192,
};
export const contentType = "image/png";

/** High-DPI / PWA circular icon. */
export default function Icon() {
  return new ImageResponse(<BrandIconMark size={192} />, {
    ...size,
  });
}
