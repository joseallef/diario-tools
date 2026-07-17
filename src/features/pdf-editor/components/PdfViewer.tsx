"use client";

import { Button } from "@/components/ui/button";
import { IconAction } from "@/components/ui/icon-action";
import {
  computeDefaultNormSize,
  useEditorStore,
} from "@/features/pdf-editor/store/editorStore";
import { burnSignaturesIntoPdf, downloadPdf } from "@/features/pdf-editor/utils/pdfProcessing";
import {
  Crosshair,
  Download,
  Loader2,
  Minus,
  Plus,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { toast } from "sonner";
import { DraggableSignature } from "./DraggableSignature";
import { SignatureModal } from "./SignatureModal";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export function PdfViewer() {
  const {
    file,
    fileBuffer,
    numPages,
    setNumPages,
    signatures,
    addSignature,
    currentPage,
    setCurrentPage,
    pendingSignature,
    setPendingSignature,
    selectedSignatureId,
    setSelectedSignatureId,
  } = useEditorStore();

  const [containerWidth, setContainerWidth] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [pageSize, setPageSize] = useState({ width: 0, height: 0 });
  const [isDocumentInView, setIsDocumentInView] = useState(true);
  const t = useTranslations("PdfEditorPage.viewer");

  const pageRef = useRef<HTMLDivElement>(null);
  const scrollHostRef = useRef<HTMLDivElement>(null);

  const safeFileBuffer = useMemo(
    () => (fileBuffer ? fileBuffer.slice(0) : null),
    [fileBuffer]
  );

  useEffect(() => {
    const updateDimensions = () => {
      const container = document.getElementById("pdf-container-wrapper");
      if (container) {
        setContainerWidth(container.clientWidth - 48);
      }
    };

    window.addEventListener("resize", updateDimensions);
    updateDimensions();
    const tId = window.setTimeout(updateDimensions, 50);
    return () => {
      window.removeEventListener("resize", updateDimensions);
      window.clearTimeout(tId);
    };
  }, [fileBuffer, numPages]);

  // Show zoom bar only while the PDF document area is on screen
  useEffect(() => {
    const target = scrollHostRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsDocumentInView(entry.isIntersecting && entry.intersectionRatio > 0.12);
      },
      {
        threshold: [0, 0.12, 0.25, 0.5],
        rootMargin: "-48px 0px -80px 0px",
      }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [safeFileBuffer]);

  // Keyboard: Escape cancels placement / clears selection; Delete removes selected
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (pendingSignature) {
          setPendingSignature(null);
          return;
        }
        if (selectedSignatureId) {
          setSelectedSignatureId(null);
        }
      }
      if (
        (e.key === "Delete" || e.key === "Backspace") &&
        selectedSignatureId &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement)
      ) {
        useEditorStore.getState().removeSignature(selectedSignatureId);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pendingSignature, selectedSignatureId, setPendingSignature, setSelectedSignatureId]);

  // Click/tap outside the signature (and its chrome) clears selection
  useEffect(() => {
    if (!selectedSignatureId) return;

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      if (target.closest("[data-signature]")) return;
      if (target.closest("[data-signature-chip]")) return;
      if (target.closest('[role="dialog"]')) return;
      if (target.closest("[data-radix-popper-content-wrapper]")) return;
      setSelectedSignatureId(null);
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [selectedSignatureId, setSelectedSignatureId]);

  const handleSignatureCreated = useCallback(
    (payload: { dataUrl: string; type: "draw" | "text"; aspectRatio: number }) => {
      setPendingSignature({
        content: payload.dataUrl,
        type: payload.type,
        aspectRatio: payload.aspectRatio,
      });
      toast.message(t("placement.toast"), {
        description: t("placement.hint"),
      });
    },
    [setPendingSignature, t]
  );

  const placeSignatureAt = useCallback(
    (clientX: number, clientY: number) => {
      if (!pendingSignature || !pageRef.current || pageSize.width <= 0) return;

      const rect = pageRef.current.getBoundingClientRect();
      const relX = (clientX - rect.left) / rect.width;
      const relY = (clientY - rect.top) / rect.height;

      if (relX < 0 || relX > 1 || relY < 0 || relY > 1) return;

      const { width, height } = computeDefaultNormSize(
        pendingSignature.aspectRatio,
        pageSize.width,
        pageSize.height
      );

      addSignature({
        id: crypto.randomUUID(),
        type: pendingSignature.type,
        content: pendingSignature.content,
        width,
        height,
        x: Math.min(Math.max(relX - width / 2, 0), 1 - width),
        y: Math.min(Math.max(relY - height / 2, 0), 1 - height),
        page: currentPage,
        aspectRatio: pendingSignature.aspectRatio,
        rotation: 0,
      });

      toast.success(t("placement.placed"));
    },
    [pendingSignature, pageSize, addSignature, currentPage, t]
  );

  const onPageLoadSuccess = useCallback(
    (page: { width: number; height: number; originalWidth: number; originalHeight: number }) => {
      // react-pdf Page provides rendered CSS dimensions via getBoundingClientRect after paint
      requestAnimationFrame(() => {
        if (pageRef.current) {
          const { width, height } = pageRef.current.getBoundingClientRect();
          setPageSize({ width, height });
        } else {
          setPageSize({ width: page.width, height: page.height });
        }
      });
    },
    []
  );

  // Keep pageSize in sync with zoom / container
  useEffect(() => {
    if (!pageRef.current) return;
    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) {
        setPageSize({ width, height });
      }
    });
    ro.observe(pageRef.current);
    return () => ro.disconnect();
  }, [currentPage, zoomLevel, safeFileBuffer]);

  const handleDownload = async () => {
    if (!fileBuffer || !file) return;
    setIsSaving(true);
    try {
      const pdfBytes = await burnSignaturesIntoPdf(fileBuffer, signatures);
      downloadPdf(pdfBytes, `assinado_${file.name}`);
      toast.success(t("toast.success"));
    } catch {
      toast.error(t("toast.error"));
    } finally {
      setIsSaving(false);
    }
  };

  if (!safeFileBuffer) return null;

  const pageRenderWidth =
    containerWidth > 0 ? Math.min(containerWidth, 840) * zoomLevel : undefined;

  const pageSignatures = signatures.filter((s) => s.page === currentPage);

  return (
    <div id="pdf-container-wrapper" className="flex w-full flex-col items-center gap-4">
      {/* Top toolbar */}
      <div className="sticky top-4 z-50 flex max-w-[95vw] items-center gap-2 overflow-hidden rounded-full border border-border bg-background/95 p-2 shadow-lg backdrop-blur">
        <SignatureModal onConfirm={handleSignatureCreated} />

        <div className="mx-1 h-6 w-px bg-border" />

        <Button
          onClick={handleDownload}
          disabled={isSaving || signatures.length === 0}
          variant="default"
          className="cursor-pointer gap-2 px-4"
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          <span className="hidden sm:inline">
            {isSaving ? t("download.processing") : t("download.ready")}
          </span>
          <span className="inline sm:hidden">
            {isSaving ? t("download.processingShort") : t("download.readyShort")}
          </span>
          {signatures.length > 0 && (
            <span className="ml-1 rounded-full bg-primary-foreground/20 px-1.5 text-[10px] font-bold">
              {signatures.length}
            </span>
          )}
        </Button>
      </div>

      {/* Placement mode banner */}
      {pendingSignature && (
        <div className="z-40 flex w-full max-w-xl items-center gap-3 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-foreground shadow-sm animate-in fade-in slide-in-from-top-2">
          <Crosshair className="h-5 w-5 shrink-0 text-primary" />
          <div className="min-w-0 flex-1">
            <p className="font-semibold">{t("placement.title")}</p>
            <p className="text-xs text-muted-foreground">{t("placement.hint")}</p>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={pendingSignature.content}
            alt=""
            className="h-10 max-w-[96px] object-contain rounded bg-white px-2 py-1 shadow-sm"
          />
          <IconAction
            label={t("controls.cancelPlacement")}
            hint={t("controls.cancelPlacementHint")}
            variant="muted"
            onClick={() => setPendingSignature(null)}
          >
            <X className="h-4 w-4" />
          </IconAction>
        </div>
      )}

      {/* Zoom — only while the document is visible in the viewport */}
      <div
        role="toolbar"
        aria-label={t("controls.zoomLevel", { level: Math.round(zoomLevel * 100) })}
        aria-hidden={!isDocumentInView}
        className={`fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-full border border-border bg-background/95 p-1.5 shadow-lg backdrop-blur transition-all duration-200 ${
          isDocumentInView
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-3 opacity-0"
        }`}
      >
        <IconAction
          label={t("controls.zoomOut")}
          side="top"
          variant="muted"
          disabled={zoomLevel <= 0.5}
          tabIndex={isDocumentInView ? 0 : -1}
          onClick={() => setZoomLevel((z) => Math.max(z - 0.25, 0.5))}
        >
          <Minus className="h-4 w-4" />
        </IconAction>
        <span
          className="min-w-12 select-none px-1 text-center text-xs font-semibold tabular-nums text-foreground"
          title={t("controls.zoomLevel", { level: Math.round(zoomLevel * 100) })}
        >
          {Math.round(zoomLevel * 100)}%
        </span>
        <IconAction
          label={t("controls.zoomIn")}
          side="top"
          variant="muted"
          disabled={zoomLevel >= 3}
          tabIndex={isDocumentInView ? 0 : -1}
          onClick={() => setZoomLevel((z) => Math.min(z + 0.25, 3))}
        >
          <Plus className="h-4 w-4" />
        </IconAction>
      </div>

      <div
        ref={scrollHostRef}
        className={`w-full min-h-[600px] overflow-auto rounded-xl bg-muted p-4 shadow-inner sm:p-8 ${
          pendingSignature ? "ring-2 ring-primary/40 ring-offset-2 ring-offset-background" : ""
        }`}
      >
        <Document
          file={safeFileBuffer}
          onLoadSuccess={({ numPages: n }) => setNumPages(n)}
          loading={
            <div className="mt-20 flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">{t("loading")}</span>
            </div>
          }
          className="relative shadow-xl"
        >
          {/*
            min-w-full + w-fit: center when page fits; when zoomed wider than
            the host, grow from the left so scrollLeft can reach the start.
          */}
          <div className="mx-auto flex w-fit min-w-full justify-center">
            <div
              ref={pageRef}
              className={`relative ${pendingSignature ? "cursor-crosshair" : ""}`}
              onClick={(e) => {
                // Clicks on signatures / their chrome must not clear selection
                if ((e.target as HTMLElement).closest("[data-signature]")) {
                  return;
                }

                if (pendingSignature) {
                  placeSignatureAt(e.clientX, e.clientY);
                  return;
                }

                setSelectedSignatureId(null);
              }}
            >
              <Page
                pageNumber={currentPage}
                width={pageRenderWidth}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                className="bg-white"
                onLoadSuccess={onPageLoadSuccess}
              />

              {/* Ghost preview following intent while in placement mode */}
              {pendingSignature && pageSize.width > 0 && (
                <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
                  <div className="rounded-lg border-2 border-dashed border-primary/50 bg-primary/5 px-4 py-8 text-center">
                    <p className="text-sm font-medium text-primary">{t("placement.clickHere")}</p>
                  </div>
                </div>
              )}

              <div
                className={`absolute inset-0 z-10 overflow-visible ${
                  pendingSignature ? "pointer-events-none" : "pointer-events-none"
                }`}
              >
                {pageSize.width > 0 &&
                  pageSignatures.map((sig) => (
                    <DraggableSignature
                      key={sig.id}
                      signature={sig}
                      pageWidth={pageSize.width}
                      pageHeight={pageSize.height}
                      isSelected={selectedSignatureId === sig.id}
                      interactive={!pendingSignature}
                    />
                  ))}
              </div>
            </div>
          </div>
        </Document>
      </div>

      {/* Pagination + signature chips */}
      <div className="flex w-full max-w-3xl flex-col items-center gap-3">
        {numPages > 1 && (
          <div className="flex items-center gap-4 rounded-lg border border-border bg-card p-2 shadow-sm">
            <Button
              variant="outline"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="cursor-pointer"
            >
              {t("pagination.prev")}
            </Button>
            <span className="text-sm font-medium text-foreground">
              {t("pagination.label", { current: currentPage, total: numPages })}
            </span>
            <Button
              variant="outline"
              disabled={currentPage >= numPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="cursor-pointer"
            >
              {t("pagination.next")}
            </Button>
          </div>
        )}

        {signatures.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2">
            {signatures.map((sig, index) => (
              <button
                key={sig.id}
                type="button"
                data-signature-chip
                onClick={() => {
                  setCurrentPage(sig.page);
                  setSelectedSignatureId(sig.id);
                  scrollHostRef.current?.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition-colors ${
                  selectedSignatureId === sig.id
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border bg-card text-muted-foreground hover:bg-muted"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={sig.content}
                  alt=""
                  className="h-5 w-10 object-contain rounded bg-white"
                />
                <span>
                  #{index + 1} · {t("pagination.pageShort", { page: sig.page })}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
