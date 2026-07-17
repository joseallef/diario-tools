"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HandleTooltip, IconAction } from "@/components/ui/icon-action";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DEFAULT_SIGNATURE_FONT,
  getSignatureFont,
  SIGNATURE_FONTS,
  signatureFontVariablesClassName,
  type SignatureFontId,
} from "@/features/pdf-editor/config/signatureFonts";
import {
  getImageDimensions,
  renderTypedSignature,
  sizeCanvasForHiDpi,
  trimTransparentPng,
} from "@/features/pdf-editor/utils/signatureImage";
import { cn } from "@/lib/utils";
import { Check, Eraser, Loader2, PenLine, Type } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import SignaturePad from "signature_pad";

interface SignatureModalProps {
  onConfirm: (payload: {
    dataUrl: string;
    type: "draw" | "text";
    aspectRatio: number;
  }) => void;
  trigger?: React.ReactNode;
}

const strokeOptions = {
  thin: { minWidth: 0.5, maxWidth: 1.5 },
  medium: { minWidth: 1.2, maxWidth: 2.8 },
  thick: { minWidth: 2.2, maxWidth: 4.5 },
} as const;

export function SignatureModal({ onConfirm, trigger }: SignatureModalProps) {
  const [open, setOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const padHostRef = useRef<HTMLDivElement>(null);
  const signaturePadRef = useRef<SignaturePad | null>(null);
  const [textSignature, setTextSignature] = useState("");
  const [fontId, setFontId] = useState<SignatureFontId>(DEFAULT_SIGNATURE_FONT);
  const [activeTab, setActiveTab] = useState("draw");
  const [strokeWidth, setStrokeWidth] = useState<"thin" | "medium" | "thick">("medium");
  const [isEmpty, setIsEmpty] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const t = useTranslations("SignatureModal");

  const selectedFont = getSignatureFont(fontId);
  const previewText = textSignature.trim() || t("type.sample");

  const destroyPad = useCallback(() => {
    signaturePadRef.current?.off();
    signaturePadRef.current = null;
  }, []);

  const strokeWidthRef = useRef(strokeWidth);
  strokeWidthRef.current = strokeWidth;

  const initPad = useCallback(() => {
    const canvas = canvasRef.current;
    const host = padHostRef.current;
    if (!canvas || !host) return;

    const width = host.clientWidth || 360;
    const height = host.clientHeight || 200;
    const hadDrawing = signaturePadRef.current && !signaturePadRef.current.isEmpty();
    const previousData = hadDrawing ? signaturePadRef.current!.toData() : null;

    sizeCanvasForHiDpi(canvas, width, height);
    destroyPad();

    const widthKey = strokeWidthRef.current;
    const pad = new SignaturePad(canvas, {
      minWidth: strokeOptions[widthKey].minWidth,
      maxWidth: strokeOptions[widthKey].maxWidth,
      penColor: "#000000",
      backgroundColor: "rgba(255,255,255,0)",
      velocityFilterWeight: 0.7,
      throttle: 8,
    });

    pad.addEventListener("endStroke", () => setIsEmpty(pad.isEmpty()));
    pad.addEventListener("beginStroke", () => setIsEmpty(false));
    signaturePadRef.current = pad;

    if (previousData?.length) {
      pad.fromData(previousData);
      setIsEmpty(pad.isEmpty());
    } else {
      setIsEmpty(true);
    }
  }, [destroyPad]);

  useEffect(() => {
    if (!open || activeTab !== "draw") return;

    const frame = requestAnimationFrame(() => initPad());
    const onResize = () => initPad();
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      destroyPad();
    };
  }, [open, activeTab, initPad, destroyPad]);

  useEffect(() => {
    if (signaturePadRef.current) {
      signaturePadRef.current.minWidth = strokeOptions[strokeWidth].minWidth;
      signaturePadRef.current.maxWidth = strokeOptions[strokeWidth].maxWidth;
    }
  }, [strokeWidth]);

  useEffect(() => {
    if (!open || activeTab !== "type") return;
    const loads = SIGNATURE_FONTS.map((font) => {
      const style = font.fontStyle ?? "normal";
      return document.fonts
        .load(`${style} 400 48px ${font.family}`)
        .catch(() => undefined);
    });
    void Promise.all(loads);
  }, [open, activeTab]);

  const clearCanvas = () => {
    signaturePadRef.current?.clear();
    setIsEmpty(true);
  };

  const resetForm = () => {
    setTextSignature("");
    setFontId(DEFAULT_SIGNATURE_FONT);
    setActiveTab("draw");
    setStrokeWidth("medium");
    setIsEmpty(true);
    setIsSubmitting(false);
    clearCanvas();
  };

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) resetForm();
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      let dataUrl = "";
      let type: "draw" | "text" = "draw";

      if (activeTab === "draw") {
        const pad = signaturePadRef.current;
        if (!pad || pad.isEmpty()) return;
        dataUrl = await trimTransparentPng(pad.toDataURL("image/png"));
        type = "draw";
      } else if (textSignature.trim()) {
        const font = getSignatureFont(fontId);
        dataUrl = await renderTypedSignature(
          textSignature.trim(),
          font.family,
          font.renderScale,
          font.fontStyle ?? "normal"
        );
        if (!dataUrl) return;
        dataUrl = await trimTransparentPng(dataUrl);
        type = "text";
      } else {
        return;
      }

      const { width, height } = await getImageDimensions(dataUrl);
      onConfirm({
        dataUrl,
        type,
        aspectRatio: width / Math.max(height, 1),
      });
      handleOpenChange(false);
    } catch {
      // empty trim / load errors — keep modal open
    } finally {
      setIsSubmitting(false);
    }
  };

  const canConfirm =
    !isSubmitting &&
    (activeTab === "draw" ? !isEmpty : textSignature.trim().length > 0);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2 shadow-sm hover:shadow-md">
            <PenLine className="h-4 w-4" />
            {t("trigger")}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className={cn("sm:max-w-lg", signatureFontVariablesClassName)}>
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">{t("title")}</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">{t("description")}</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid h-9 w-full grid-cols-2 gap-0.5 rounded-lg bg-muted/80 p-0.5 sm:h-11 sm:gap-1 sm:rounded-xl sm:p-1">
            <TabsTrigger
              value="draw"
              className="h-8 gap-1.5 rounded-md text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md data-[state=inactive]:hover:bg-background data-[state=inactive]:hover:text-primary data-[state=inactive]:hover:ring-1 data-[state=inactive]:hover:ring-primary/20 sm:h-9 sm:gap-2 sm:rounded-lg"
            >
              <PenLine className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              {t("tabs.draw")}
            </TabsTrigger>
            <TabsTrigger
              value="type"
              className="h-8 gap-1.5 rounded-md text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md data-[state=inactive]:hover:bg-background data-[state=inactive]:hover:text-primary data-[state=inactive]:hover:ring-1 data-[state=inactive]:hover:ring-primary/20 sm:h-9 sm:gap-2 sm:rounded-lg"
            >
              <Type className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              {t("tabs.type")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="draw" className="mt-0 space-y-2.5 py-2.5 sm:space-y-4 sm:py-4">
            <div
              ref={padHostRef}
              className="relative h-[148px] w-full overflow-hidden rounded-lg border-2 border-dashed border-slate-300 bg-white shadow-inner transition-colors hover:border-primary/40 sm:h-[220px] sm:rounded-xl"
            >
              <canvas
                ref={canvasRef}
                className="block h-full w-full cursor-crosshair touch-none"
                style={{ touchAction: "none" }}
              />
              <div className="pointer-events-none absolute inset-x-6 bottom-4 border-b border-slate-200 sm:inset-x-8 sm:bottom-6" />
              <div className="absolute top-1.5 right-1.5 z-10 sm:top-2 sm:right-2">
                <IconAction
                  label={t("actions.clear")}
                  variant="danger"
                  size="sm"
                  className="bg-white/95 shadow-sm"
                  onClick={clearCanvas}
                >
                  <Eraser className="h-3.5 w-3.5" />
                </IconAction>
              </div>
              {isEmpty && (
                <p className="pointer-events-none absolute inset-0 flex items-center justify-center px-4 text-center text-xs text-slate-400 sm:text-sm">
                  {t("thickness.hint")}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">
                  {t("thickness.label")}
                </span>
                <div
                  role="group"
                  aria-label={t("thickness.label")}
                  className="flex gap-0.5 rounded-md bg-muted p-0.5 sm:gap-1 sm:rounded-lg sm:p-1"
                >
                  {(["thin", "medium", "thick"] as const).map((key) => (
                    <HandleTooltip key={key} label={t(`thickness.${key}`)} side="top">
                      <button
                        type="button"
                        aria-label={t(`thickness.${key}`)}
                        aria-pressed={strokeWidth === key}
                        onClick={() => setStrokeWidth(key)}
                        className={`cursor-pointer rounded-md p-1.5 transition-all hover:bg-background hover:shadow-sm hover:ring-1 hover:ring-primary/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 active:scale-95 sm:p-2 ${
                          strokeWidth === key
                            ? "bg-background text-primary shadow-sm ring-1 ring-primary/30"
                            : "text-muted-foreground"
                        }`}
                      >
                        <div
                          className={`w-5 rounded-full bg-current ${
                            key === "thin" ? "h-0.5" : key === "medium" ? "h-1" : "h-1.5"
                          }`}
                        />
                      </button>
                    </HandleTooltip>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="type" className="mt-0 space-y-2 py-2 sm:space-y-2.5 sm:py-2.5">
            <div className="space-y-1">
              <Label htmlFor="signature-text" className="text-xs sm:text-sm">
                {t("type.label")}
              </Label>
              <Input
                id="signature-text"
                placeholder={t("type.placeholder")}
                value={textSignature}
                onChange={(e) => setTextSignature(e.target.value)}
                className="h-9 text-base sm:h-9 sm:text-base"
                autoComplete="name"
              />
            </div>

            <div className="relative h-[72px] shrink-0 overflow-hidden rounded-md border border-border bg-muted [--sig-preview-size:1.35rem] sm:h-[88px] sm:[--sig-preview-size:1.5rem]">
              <div className="absolute inset-0 flex items-center justify-center px-3 text-center sm:px-4">
                {textSignature.trim() ? (
                  <span
                    className="max-w-full px-1 text-foreground transition-[font-family,font-size] duration-200"
                    style={{
                      fontFamily: selectedFont.cssVar,
                      fontStyle: selectedFont.fontStyle ?? "normal",
                      fontSize: `calc(${selectedFont.previewScale} * var(--sig-preview-size))`,
                      lineHeight: 1,
                    }}
                  >
                    {textSignature}
                  </span>
                ) : (
                  <span className="text-xs italic text-muted-foreground sm:text-sm">
                    {t("type.preview")}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-medium text-muted-foreground sm:text-xs">
                {t("type.fontLabel")}
              </span>

              <div
                role="listbox"
                aria-label={t("type.fontLabel")}
                className="grid grid-cols-3 gap-1 sm:grid-cols-5 sm:gap-1"
              >
                {SIGNATURE_FONTS.map((font) => {
                  const active = fontId === font.id;
                  return (
                    <button
                      key={font.id}
                      type="button"
                      role="option"
                      aria-selected={active}
                      onClick={() => setFontId(font.id)}
                      className={cn(
                        "relative flex h-[52px] cursor-pointer flex-col overflow-hidden rounded border bg-card p-1 text-left transition-all sm:h-[54px] sm:p-1.5",
                        "hover:bg-background hover:shadow-sm hover:ring-1 hover:ring-primary/25",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 active:scale-[0.98]",
                        active
                          ? "border-primary bg-background text-primary shadow-sm ring-1 ring-primary/30"
                          : "border-border text-muted-foreground"
                      )}
                    >
                      <span className="relative z-10 truncate text-[9px] font-medium leading-tight sm:text-[10px]">
                        {t(`type.fonts.${font.id}`)}
                      </span>
                      <div className="absolute inset-x-1 bottom-0.5 top-4 flex items-center sm:inset-x-1.5 sm:top-[1.05rem]">
                        <span
                          className="block max-w-full truncate text-foreground [--sig-sample-size:0.8rem] sm:[--sig-sample-size:0.88rem]"
                          style={{
                            fontFamily: font.cssVar,
                            fontStyle: font.fontStyle ?? "normal",
                            fontSize: `calc(${font.previewScale} * var(--sig-sample-size))`,
                            lineHeight: 1,
                          }}
                        >
                          {previewText}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-1 flex justify-end gap-2 sm:mt-2">
          <Button
            variant="outline"
            size="sm"
            className="sm:h-9 sm:px-4 sm:text-sm"
            onClick={() => handleOpenChange(false)}
            disabled={isSubmitting}
          >
            {t("actions.cancel")}
          </Button>
          <Button
            size="sm"
            onClick={handleConfirm}
            disabled={!canConfirm}
            className="min-w-[8.5rem] sm:h-9 sm:min-w-[10.5rem] sm:px-4 sm:text-sm"
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Check className="mr-2 h-4 w-4" />
            )}
            {t("actions.confirm")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
