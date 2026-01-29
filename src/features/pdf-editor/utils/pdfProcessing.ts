"use client";

import { Signature } from "@/features/pdf-editor/store/editorStore";
import { PDFDocument } from "pdf-lib";

export async function burnSignaturesIntoPdf(
  fileBuffer: ArrayBuffer,
  signatures: Signature[],
  scaleFactor: number // Fator para converter pixels da tela em points do PDF
): Promise<Uint8Array> {
  // Clonar o buffer para evitar erro "detached ArrayBuffer" se o original for modificado
  const bufferClone = fileBuffer.slice(0);

  // Carregar o PDF original
  const pdfDoc = await PDFDocument.load(bufferClone);
  const pages = pdfDoc.getPages();

  for (const sig of signatures) {
    // A página no array é 0-based, mas no store é 1-based
    const pageIndex = sig.page - 1;
    if (pageIndex < 0 || pageIndex >= pages.length) continue;

    const page = pages[pageIndex];
    const { height: pageHeight } = page.getSize();

    // Embedar a imagem da assinatura (PNG)
    const signatureImage = await pdfDoc.embedPng(sig.content);

    // Calcular dimensões no PDF (Points)
    // Assumimos que scaleFactor converte pixels CSS -> PDF Points
    // Geralmente scaleFactor = pdfPageWidth / cssContainerWidth

    // ATENÇÃO: Se o scaleFactor não for passado corretamente,
    // precisamos deduzir baseando-se no tamanho da página.
    // Vamos simplificar assumindo que o caller passa as coordenadas já normalizadas
    // ou fazemos a conversão aqui se recebermos as dimensões do container.

    // Vamos assumir que x, y, width, height vêm em PIXELS da tela
    // Precisamos converter para PDF Points.
    // O PDF usa 72 DPI por padrão. O browser usa 96 DPI (geralmente).
    // Mas o mais seguro é usar a proporção relativa.

    // Para simplificar a implementação inicial, vamos assumir que o scaleFactor
    // passado é: pdfPageWidth / canvasRenderedWidth

    const pdfWidth = sig.width * scaleFactor;
    const pdfHeight = sig.height * scaleFactor;

    // Coordenada Y no PDF começa de baixo para cima
    // htmlY é relativo ao topo da página visualizada
    const pdfX = sig.x * scaleFactor;
    const pdfY = pageHeight - sig.y * scaleFactor - pdfHeight;

    page.drawImage(signatureImage, {
      x: pdfX,
      y: pdfY,
      width: pdfWidth,
      height: pdfHeight,
    });
  }

  // Salvar o PDF modificado
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

export function downloadPdf(data: Uint8Array, filename: string) {
  // Casting 'data' as any to avoid TypeScript error:
  // "Type 'Uint8Array<ArrayBufferLike>' is not assignable to type 'BlobPart'"
  const blob = new Blob([data as any], { type: "application/pdf" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename; // Nome do arquivo
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
