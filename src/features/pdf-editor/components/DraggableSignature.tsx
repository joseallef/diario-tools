"use client";

import { HandleTooltip, IconAction } from "@/components/ui/icon-action";
import { Signature, useEditorStore } from "@/features/pdf-editor/store/editorStore";
import { RotateCcw, RotateCw, Trash2, Undo2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

type Corner = "nw" | "ne" | "sw" | "se";
type TransformMode = "none" | "drag" | "resize" | "rotate";

interface DraggableSignatureProps {
  signature: Signature;
  pageWidth: number;
  pageHeight: number;
  isSelected: boolean;
  interactive?: boolean;
}

const CORNER_CURSOR: Record<Corner, string> = {
  nw: "nwse-resize",
  se: "nwse-resize",
  ne: "nesw-resize",
  sw: "nesw-resize",
};

const CORNER_CLASS: Record<Corner, string> = {
  nw: "-left-1.5 -top-1.5",
  ne: "-right-1.5 -top-1.5",
  sw: "-left-1.5 -bottom-1.5",
  se: "-right-1.5 -bottom-1.5",
};

function normalizeAngle(deg: number) {
  let a = deg % 360;
  if (a > 180) a -= 360;
  if (a < -180) a += 360;
  return a;
}

function snapAngle(deg: number, shiftKey: boolean) {
  const step = shiftKey ? 15 : 5;
  const snapped = Math.round(deg / step) * step;
  // Magnetic snap to horizontal near 0°
  if (Math.abs(normalizeAngle(snapped)) < (shiftKey ? 3 : 2.5)) return 0;
  return normalizeAngle(snapped);
}

function screenToLocal(dx: number, dy: number, rotationDeg: number) {
  const θ = (-rotationDeg * Math.PI) / 180;
  const cos = Math.cos(θ);
  const sin = Math.sin(θ);
  return {
    x: dx * cos - dy * sin,
    y: dx * sin + dy * cos,
  };
}

export function DraggableSignature({
  signature,
  pageWidth,
  pageHeight,
  isSelected,
  interactive = true,
}: DraggableSignatureProps) {
  const { removeSignature, updateSignature, setSelectedSignatureId } = useEditorStore();
  const t = useTranslations("PdfEditorPage.viewer.transform");

  const [norm, setNorm] = useState({
    x: signature.x,
    y: signature.y,
    width: signature.width,
    height: signature.height,
  });
  const [rotation, setRotation] = useState(signature.rotation ?? 0);
  const [mode, setMode] = useState<TransformMode>("none");
  const [activeCorner, setActiveCorner] = useState<Corner | null>(null);
  const [justPlaced, setJustPlaced] = useState(true);

  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);
  const initialNormRef = useRef(norm);
  const initialRotationRef = useRef(rotation);
  const startAngleRef = useRef(0);
  const normRef = useRef(norm);
  const rotationRef = useRef(rotation);
  normRef.current = norm;
  rotationRef.current = rotation;

  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mode === "none") {
      setNorm({
        x: signature.x,
        y: signature.y,
        width: signature.width,
        height: signature.height,
      });
      setRotation(signature.rotation ?? 0);
    }
  }, [
    signature.x,
    signature.y,
    signature.width,
    signature.height,
    signature.rotation,
    mode,
  ]);

  useEffect(() => {
    const timer = setTimeout(() => setJustPlaced(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const px = {
    x: norm.x * pageWidth,
    y: norm.y * pageHeight,
    width: norm.width * pageWidth,
    height: norm.height * pageHeight,
  };

  const clampNorm = (next: typeof norm) => {
    const width = Math.min(Math.max(next.width, 0.06), 0.95);
    const height = Math.min(Math.max(next.height, 0.03), 0.5);
    return {
      width,
      height,
      x: Math.min(Math.max(next.x, 0), 1 - width),
      y: Math.min(Math.max(next.y, 0), 1 - height),
    };
  };

  const commitAll = () => {
    const latest = normRef.current;
    updateSignature(signature.id, {
      x: latest.x,
      y: latest.y,
      width: latest.width,
      height: latest.height,
      rotation: rotationRef.current,
    });
  };

  const applyResizeFromCorner = (corner: Corner, localDxPx: number, localDyPx: number) => {
    const init = initialNormRef.current;
    const aspect = signature.aspectRatio;
    const pageAspect = pageWidth / pageHeight;

    // Convert pixel deltas in local space to norm deltas
    const dW = localDxPx / pageWidth;
    const dH = localDyPx / pageHeight;

    // Anchor = opposite corner stays fixed
    let nextW = init.width;
    let nextH = init.height;
    let nextX = init.x;
    let nextY = init.y;

    // Use the dominant axis for aspect-locked resize (feels natural when rotated)
    const projected =
      Math.abs(localDxPx) >= Math.abs(localDyPx)
        ? localDxPx
        : localDyPx * aspect * (pageHeight / pageWidth);

    const deltaW =
      corner === "se" || corner === "ne"
        ? projected / pageWidth
        : -projected / pageWidth;

    nextW = init.width + deltaW;
    nextH = (nextW * pageAspect) / aspect;

    // Reposition so the opposite corner stays put
    if (corner === "se") {
      nextX = init.x;
      nextY = init.y;
    } else if (corner === "sw") {
      nextX = init.x + init.width - nextW;
      nextY = init.y;
    } else if (corner === "ne") {
      nextX = init.x;
      nextY = init.y + init.height - nextH;
    } else {
      // nw
      nextX = init.x + init.width - nextW;
      nextY = init.y + init.height - nextH;
    }

    // Suppress unused warning for dW/dH when using projected — keep for clarity
    void dW;
    void dH;

    const clamped = clampNorm({ x: nextX, y: nextY, width: nextW, height: nextH });
    normRef.current = clamped;
    setNorm(clamped);
  };

  const handleDragStart = (e: React.PointerEvent) => {
    if (mode === "resize" || mode === "rotate") return;
    if ((e.target as HTMLElement).closest("[data-handle]")) return;

    e.preventDefault();
    e.stopPropagation();
    setSelectedSignatureId(signature.id);
    setMode("drag");
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    pointerStartRef.current = { x: e.clientX, y: e.clientY };
    initialNormRef.current = { ...norm };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!pointerStartRef.current) return;

    if (mode === "drag") {
      e.preventDefault();
      e.stopPropagation();
      const dx = (e.clientX - pointerStartRef.current.x) / pageWidth;
      const dy = (e.clientY - pointerStartRef.current.y) / pageHeight;
      const next = clampNorm({
        ...initialNormRef.current,
        x: initialNormRef.current.x + dx,
        y: initialNormRef.current.y + dy,
      });
      normRef.current = next;
      setNorm(next);
      return;
    }

    if (mode === "resize" && activeCorner) {
      e.preventDefault();
      e.stopPropagation();
      const screenDx = e.clientX - pointerStartRef.current.x;
      const screenDy = e.clientY - pointerStartRef.current.y;
      const local = screenToLocal(screenDx, screenDy, initialRotationRef.current);
      applyResizeFromCorner(activeCorner, local.x, local.y);
      return;
    }

    if (mode === "rotate" && boxRef.current) {
      e.preventDefault();
      e.stopPropagation();
      const rect = boxRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const angle = (Math.atan2(e.clientY - cy, e.clientX - cx) * 180) / Math.PI;
      // atan2 0° is east; our handle is north → offset by 90°
      const absolute = angle + 90;
      let next = normalizeAngle(
        initialRotationRef.current + (absolute - startAngleRef.current)
      );
      next = snapAngle(next, e.shiftKey);
      rotationRef.current = next;
      setRotation(next);
    }
  };

  const handlePointerEnd = (e: React.PointerEvent) => {
    if (mode === "none") return;
    e.preventDefault();
    e.stopPropagation();
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }
    commitAll();
    setMode("none");
    setActiveCorner(null);
    pointerStartRef.current = null;
  };

  const startResize = (corner: Corner) => (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedSignatureId(signature.id);
    setMode("resize");
    setActiveCorner(corner);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    pointerStartRef.current = { x: e.clientX, y: e.clientY };
    initialNormRef.current = { ...norm };
    initialRotationRef.current = rotation;
  };

  const startRotate = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!boxRef.current) return;
    setSelectedSignatureId(signature.id);
    setMode("rotate");
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    pointerStartRef.current = { x: e.clientX, y: e.clientY };
    initialRotationRef.current = rotation;

    const rect = boxRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    startAngleRef.current =
      (Math.atan2(e.clientY - cy, e.clientX - cx) * 180) / Math.PI + 90;
  };

  const nudgeRotation = (delta: number) => {
    const next = snapAngle(normalizeAngle(rotation + delta), false);
    rotationRef.current = next;
    setRotation(next);
    updateSignature(signature.id, { rotation: next });
  };

  const resetRotation = () => {
    rotationRef.current = 0;
    setRotation(0);
    updateSignature(signature.id, { rotation: 0 });
  };

  const [isHovering, setIsHovering] = useState(false);
  const hoverLeaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearHoverTimer = () => {
    if (hoverLeaveTimer.current) {
      clearTimeout(hoverLeaveTimer.current);
      hoverLeaveTimer.current = null;
    }
  };

  useEffect(() => () => clearHoverTimer(), []);

  const handleHoverEnter = () => {
    clearHoverTimer();
    setIsHovering(true);
  };

  const handleHoverLeave = () => {
    clearHoverTimer();
    // Grace period so the cursor can cross the gap into the toolbar
    hoverLeaveTimer.current = setTimeout(() => setIsHovering(false), 600);
  };

  const showChrome =
    isSelected || isHovering || mode !== "none" || justPlaced;

  return (
    <div
      ref={boxRef}
      data-signature={signature.id}
      onPointerDown={handleDragStart}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onClick={(e) => e.stopPropagation()}
      onMouseEnter={handleHoverEnter}
      onMouseLeave={handleHoverLeave}
      onPointerEnter={handleHoverEnter}
      onPointerLeave={(e) => {
        // Don't collapse chrome while a transform gesture is active
        if (mode !== "none") return;
        // Still inside a child (toolbar/bridge) — keep alive
        // relatedTarget can be Window/non-Node; contains() requires a Node
        const related = e.relatedTarget;
        if (related instanceof Node && e.currentTarget.contains(related)) return;
        handleHoverLeave();
      }}
      className={`absolute z-50 select-none group ${
        interactive ? "pointer-events-auto" : "pointer-events-none"
      } ${mode === "drag" ? "cursor-grabbing" : "cursor-grab"} ${
        justPlaced ? "animate-in zoom-in-95 fade-in duration-300" : ""
      }`}
      style={{
        left: px.x,
        top: px.y,
        width: px.width,
        height: px.height,
        transform: `rotate(${rotation}deg)`,
        transformOrigin: "center center",
        touchAction: "none",
      }}
      role="button"
      tabIndex={0}
      aria-label={t("aria")}
      onKeyDown={(e) => {
        if (e.key === "Delete" || e.key === "Backspace") {
          e.preventDefault();
          removeSignature(signature.id);
        }
        if (e.key === "[") {
          e.preventDefault();
          nudgeRotation(-5);
        }
        if (e.key === "]") {
          e.preventDefault();
          nudgeRotation(5);
        }
        if (e.key === "0" && !e.metaKey && !e.ctrlKey) {
          e.preventDefault();
          resetRotation();
        }
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={signature.content}
        alt=""
        draggable={false}
        className="relative z-0 h-full w-full object-contain pointer-events-none select-none"
      />

      <div
        className={`absolute inset-0 z-10 rounded-sm transition-colors ${
          showChrome ? "bg-primary/5" : "bg-transparent"
        }`}
      />

      <div
        className={`pointer-events-none absolute inset-0 z-20 rounded-sm border-2 transition-opacity ${
          showChrome
            ? "border-primary opacity-100 shadow-[0_0_0_3px_rgba(15,118,110,0.15)]"
            : "border-primary/70 opacity-0"
        }`}
      />

      {/* Page badge */}
      <span
        className={`pointer-events-none absolute -top-6 left-0 z-50 rounded bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground shadow-sm transition-opacity ${
          showChrome ? "opacity-100" : "opacity-0"
        }`}
      >
        {t("pageBadge", { page: signature.page })}
      </span>

      {/* Rotation stem + handle */}
      <div
        className={`pointer-events-none absolute left-1/2 z-40 flex -translate-x-1/2 flex-col items-center transition-opacity ${
          showChrome ? "opacity-100" : "opacity-0"
        }`}
        style={{ top: -40 }}
      >
        <HandleTooltip label={t("rotate")} hint={t("rotateHint")} side="top">
          <div
            data-handle="rotate"
            role="button"
            tabIndex={0}
            aria-label={t("rotate")}
            onPointerDown={startRotate}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerEnd}
            onPointerCancel={handlePointerEnd}
            className="pointer-events-auto flex h-8 w-8 cursor-grab items-center justify-center rounded-full border-2 border-primary bg-white text-primary shadow-md transition-all duration-150 hover:scale-110 hover:bg-primary hover:text-white hover:shadow-lg hover:ring-2 hover:ring-primary/30 active:scale-95 active:cursor-grabbing touch-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            <RotateCw className="h-3.5 w-3.5" />
          </div>
        </HandleTooltip>
        <div className="h-3 w-0.5 bg-primary/80" />
      </div>

      {/* Live angle chip while rotating */}
      {mode === "rotate" && (
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 rounded-md bg-foreground/90 px-2.5 py-1.5 text-xs font-semibold tabular-nums text-background shadow-lg">
          <span className="block text-[9px] font-medium uppercase tracking-wide text-background/70">
            {t("angleLabel")}
          </span>
          {rotation > 0 ? "+" : ""}
          {rotation.toFixed(0)}°
        </div>
      )}

      {/* Four corner resize handles */}
      {(["nw", "ne", "sw", "se"] as Corner[]).map((corner) => (
        <HandleTooltip
          key={corner}
          label={t("resize")}
          hint={t("resizeHint")}
          side={corner.startsWith("n") ? "top" : "bottom"}
        >
          <div
            data-handle={`resize-${corner}`}
            role="button"
            tabIndex={0}
            aria-label={t("resize")}
            onPointerDown={startResize(corner)}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerEnd}
            onPointerCancel={handlePointerEnd}
            className={`absolute z-50 h-4 w-4 rounded-sm border-2 border-primary bg-white shadow-md transition-all duration-150 touch-none hover:scale-125 hover:bg-primary hover:shadow-lg hover:ring-2 hover:ring-primary/35 active:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
              CORNER_CLASS[corner]
            } ${showChrome ? "opacity-100" : "opacity-0"}`}
            style={{ cursor: CORNER_CURSOR[corner] }}
          />
        </HandleTooltip>
      ))}

      {/* Invisible hit-bridge: fills the dead zone between box and toolbar */}
      <div
        aria-hidden
        data-handle="bridge"
        className="absolute left-1/2 z-40 -translate-x-1/2"
        style={{
          top: "100%",
          width: "min(140%, 280px)",
          height: 56,
        }}
        onMouseEnter={handleHoverEnter}
        onPointerEnter={handleHoverEnter}
      />

      {/* Floating transform toolbar */}
      <div
        data-handle="toolbar"
        role="toolbar"
        aria-label={t("aria")}
        className={`absolute left-1/2 z-50 flex -translate-x-1/2 items-center gap-0.5 rounded-full border border-border bg-background/95 p-1 shadow-lg backdrop-blur transition-all duration-150 ${
          showChrome
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-1 opacity-0"
        }`}
        style={{ bottom: -48 }}
        onPointerDown={(e) => {
          e.stopPropagation();
          setSelectedSignatureId(signature.id);
        }}
        onMouseEnter={handleHoverEnter}
        onPointerEnter={handleHoverEnter}
        onClick={(e) => e.stopPropagation()}
      >
        <IconAction
          label={t("rotateLeft")}
          hint={t("rotateLeftHint")}
          side="bottom"
          size="sm"
          onClick={() => nudgeRotation(-5)}
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </IconAction>
        <IconAction
          label={t("angleLabel")}
          hint={t("resetRotationHint")}
          side="bottom"
          size="sm"
          className="h-7 min-w-[3.4rem] w-auto rounded-full px-2 text-[11px] font-semibold tabular-nums"
          onClick={resetRotation}
        >
          {rotation === 0 ? "0°" : `${rotation > 0 ? "+" : ""}${Math.round(rotation)}°`}
        </IconAction>
        <IconAction
          label={t("rotateRight")}
          hint={t("rotateRightHint")}
          side="bottom"
          size="sm"
          onClick={() => nudgeRotation(5)}
        >
          <RotateCw className="h-3.5 w-3.5" />
        </IconAction>
        <div className="mx-0.5 h-4 w-px bg-border" aria-hidden />
        <IconAction
          label={t("resetRotation")}
          hint={t("resetRotationHint")}
          side="bottom"
          size="sm"
          variant="muted"
          disabled={rotation === 0}
          onClick={resetRotation}
        >
          <Undo2 className="h-3.5 w-3.5" />
        </IconAction>
        <div className="mx-0.5 h-4 w-px bg-border" aria-hidden />
        <IconAction
          label={t("remove")}
          hint={t("removeHint")}
          side="bottom"
          size="sm"
          variant="danger"
          data-handle="delete"
          onClick={() => removeSignature(signature.id)}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </IconAction>
      </div>
    </div>
  );
}

