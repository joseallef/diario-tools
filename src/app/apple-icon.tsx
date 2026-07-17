import { BrandIconMark } from "@/components/brand/BrandIconMark";
import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

/** Apple touch icon — circular mark on transparent canvas. */
export default function AppleIcon() {
  return new ImageResponse(<BrandIconMark size={180} />, {
    ...size,
  });
}
