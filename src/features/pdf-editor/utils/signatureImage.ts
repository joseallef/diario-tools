/** High-DPI + trim helpers for crisp signature PNGs. */

const EXPORT_PIXEL_RATIO = () =>
  Math.max(2, Math.min(4, Math.ceil((typeof window !== "undefined" ? window.devicePixelRatio : 1) || 1) * 2));

export function getSignaturePixelRatio(): number {
  return EXPORT_PIXEL_RATIO();
}

/** Size a canvas for crisp drawing; returns the scale applied to the 2d context. */
export function sizeCanvasForHiDpi(
  canvas: HTMLCanvasElement,
  cssWidth: number,
  cssHeight: number,
  ratio = getSignaturePixelRatio()
): number {
  canvas.width = Math.max(1, Math.round(cssWidth * ratio));
  canvas.height = Math.max(1, Math.round(cssHeight * ratio));
  canvas.style.width = `${cssWidth}px`;
  canvas.style.height = `${cssHeight}px`;

  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }
  return ratio;
}

/** Crop transparent margins, keeping a small padding. */
export function trimTransparentPng(dataUrl: string, padding = 8): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(dataUrl);
        return;
      }

      ctx.drawImage(img, 0, 0);
      const { data, width, height } = ctx.getImageData(0, 0, canvas.width, canvas.height);

      let top = height;
      let left = width;
      let right = 0;
      let bottom = 0;
      let found = false;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const alpha = data[(y * width + x) * 4 + 3];
          if (alpha > 16) {
            found = true;
            if (x < left) left = x;
            if (x > right) right = x;
            if (y < top) top = y;
            if (y > bottom) bottom = y;
          }
        }
      }

      if (!found) {
        reject(new Error("empty"));
        return;
      }

      const pad = Math.round(padding * (width / Math.max(img.width / 2, 1)));
      left = Math.max(0, left - pad);
      top = Math.max(0, top - pad);
      right = Math.min(width - 1, right + pad);
      bottom = Math.min(height - 1, bottom + pad);

      const cropW = right - left + 1;
      const cropH = bottom - top + 1;
      const out = document.createElement("canvas");
      out.width = cropW;
      out.height = cropH;
      const outCtx = out.getContext("2d");
      if (!outCtx) {
        resolve(dataUrl);
        return;
      }
      outCtx.drawImage(canvas, left, top, cropW, cropH, 0, 0, cropW, cropH);
      resolve(out.toDataURL("image/png"));
    };
    img.onerror = () => reject(new Error("load"));
    img.src = dataUrl;
  });
}

export function getImageDimensions(dataUrl: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => reject(new Error("load"));
    img.src = dataUrl;
  });
}

/** Render a typed signature as a high-resolution transparent PNG. */
export async function renderTypedSignature(
  text: string,
  fontFamily: string,
  renderScale = 1,
  fontStyle: "normal" | "italic" = "normal"
): Promise<string> {
  const ratio = getSignaturePixelRatio();
  const fontSize = Math.round(96 * renderScale);
  const cssFont = `${fontStyle} 400 ${fontSize}px ${fontFamily}`;

  try {
    await document.fonts.load(cssFont);
    await document.fonts.ready;
  } catch {
    // Fall through — browser may still paint with a fallback face
  }

  const measure = document.createElement("canvas");
  const measureCtx = measure.getContext("2d");
  if (!measureCtx) return "";

  measureCtx.font = cssFont;
  const metrics = measureCtx.measureText(text);
  const textWidth = Math.ceil(metrics.width);

  // Script faces (f, l, g…) often exceed actualBoundingBox — prefer font box + cushion
  const ascent = Math.ceil(
    Math.max(
      metrics.actualBoundingBoxAscent || 0,
      metrics.fontBoundingBoxAscent || 0,
      fontSize * 0.95
    )
  );
  const descent = Math.ceil(
    Math.max(
      metrics.actualBoundingBoxDescent || 0,
      metrics.fontBoundingBoxDescent || 0,
      fontSize * 0.35
    )
  );
  const padX = Math.round(fontSize * 0.4);
  const padY = Math.round(fontSize * 0.4);

  const cssW = textWidth + padX * 2;
  const cssH = ascent + descent + padY * 2;

  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(cssW * ratio));
  canvas.height = Math.max(1, Math.round(cssH * ratio));
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  ctx.scale(ratio, ratio);
  ctx.font = cssFont;
  ctx.fillStyle = "#000000";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(text, padX, padY + ascent);

  return canvas.toDataURL("image/png");
}
