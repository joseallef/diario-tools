"use client";

import { Signature } from "@/features/pdf-editor/store/editorStore";
import { PDFDocument, degrees } from "pdf-lib";

function dataUrlToUint8Array(dataUrl: string): Uint8Array {
  const base64 = dataUrl.includes(",") ? dataUrl.split(",")[1] : dataUrl;
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Draw image rotated around its center.
 * `rotationDeg` uses CSS convention (positive = clockwise).
 * `x`,`y` are the unrotated bottom-left in PDF coordinates.
 */
function drawImageCenteredRotation(
  page: ReturnType<PDFDocument["getPages"]>[number],
  image: Awaited<ReturnType<PDFDocument["embedPng"]>>,
  opts: { x: number; y: number; width: number; height: number; rotationDeg: number }
) {
  const { x, y, width, height, rotationDeg } = opts;

  if (!rotationDeg) {
    page.drawImage(image, { x, y, width, height, opacity: 1 });
    return;
  }

  // PDF angles are counterclockwise; CSS is clockwise → negate
  const pdfAngleDeg = -rotationDeg;
  const θ = (pdfAngleDeg * Math.PI) / 180;
  const cos = Math.cos(θ);
  const sin = Math.sin(θ);

  const cx = x + width / 2;
  const cy = y + height / 2;

  // Unrotated bottom-left relative to center: (-w/2, -h/2)
  // Rotate that vector by pdfAngle (CCW) to get draw origin for pdf-lib's corner-based rotate
  const blx = (-width / 2) * cos - (-height / 2) * sin;
  const bly = (-width / 2) * sin + (-height / 2) * cos;

  page.drawImage(image, {
    x: cx + blx,
    y: cy + bly,
    width,
    height,
    rotate: degrees(pdfAngleDeg),
    opacity: 1,
  });
}

/**
 * Burns signatures into the PDF using normalized (0–1) page coordinates.
 * Supports per-signature rotation matching the editor preview.
 */
export async function burnSignaturesIntoPdf(
  fileBuffer: ArrayBuffer,
  signatures: Signature[]
): Promise<Uint8Array> {
  const bufferClone = fileBuffer.slice(0);
  const pdfDoc = await PDFDocument.load(bufferClone);
  const pages = pdfDoc.getPages();

  const embedCache = new Map<string, Awaited<ReturnType<PDFDocument["embedPng"]>>>();

  for (const sig of signatures) {
    const pageIndex = sig.page - 1;
    if (pageIndex < 0 || pageIndex >= pages.length) continue;

    const page = pages[pageIndex];
    const { width: pageWidth, height: pageHeight } = page.getSize();

    let signatureImage = embedCache.get(sig.content);
    if (!signatureImage) {
      signatureImage = await pdfDoc.embedPng(dataUrlToUint8Array(sig.content));
      embedCache.set(sig.content, signatureImage);
    }

    const pdfWidth = clamp(sig.width, 0.02, 1) * pageWidth;
    const pdfHeight = clamp(sig.height, 0.02, 1) * pageHeight;
    const pdfX = clamp(sig.x, 0, 1) * pageWidth;
    const pdfY = pageHeight - clamp(sig.y, 0, 1) * pageHeight - pdfHeight;

    drawImageCenteredRotation(page, signatureImage, {
      x: pdfX,
      y: pdfY,
      width: pdfWidth,
      height: pdfHeight,
      rotationDeg: sig.rotation ?? 0,
    });
  }

  return pdfDoc.save();
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function downloadPdf(data: Uint8Array, filename: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const blob = new Blob([data as any], { type: "application/pdf" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
