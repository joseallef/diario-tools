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
  getImageDimensions,
  renderTypedSignature,
  sizeCanvasForHiDpi,
  trimTransparentPng,
} from "@/features/pdf-editor/utils/signatureImage";
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
  const [activeTab, setActiveTab] = useState("draw");
  const [strokeWidth, setStrokeWidth] = useState<"thin" | "medium" | "thick">("medium");
  const [isEmpty, setIsEmpty] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const t = useTranslations("SignatureModal");

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

  const clearCanvas = () => {
    signaturePadRef.current?.clear();
    setIsEmpty(true);
  };

  const resetForm = () => {
    setTextSignature("");
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
        dataUrl = renderTypedSignature(textSignature.trim());
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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid h-11 w-full grid-cols-2 gap-1 rounded-xl bg-muted/80 p-1">
            <TabsTrigger
              value="draw"
              className="h-9 gap-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md data-[state=inactive]:hover:bg-background data-[state=inactive]:hover:text-primary data-[state=inactive]:hover:ring-1 data-[state=inactive]:hover:ring-primary/20"
            >
              <PenLine className="h-4 w-4" />
              {t("tabs.draw")}
            </TabsTrigger>
            <TabsTrigger
              value="type"
              className="h-9 gap-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md data-[state=inactive]:hover:bg-background data-[state=inactive]:hover:text-primary data-[state=inactive]:hover:ring-1 data-[state=inactive]:hover:ring-primary/20"
            >
              <Type className="h-4 w-4" />
              {t("tabs.type")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="draw" className="space-y-4 py-4">
            {/* Always white pad — readable in dark mode, matches exported ink */}
            <div
              ref={padHostRef}
              className="relative h-[220px] w-full overflow-hidden rounded-xl border-2 border-dashed border-slate-300 bg-white shadow-inner transition-colors hover:border-primary/40"
            >
              <canvas
                ref={canvasRef}
                className="block h-full w-full cursor-crosshair touch-none"
                style={{ touchAction: "none" }}
              />
              <div className="pointer-events-none absolute inset-x-8 bottom-6 border-b border-slate-200" />
              <div className="absolute top-2 right-2 z-10">
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
                <p className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-slate-400">
                  {t("thickness.hint")}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">
                  {t("thickness.label")}
                </span>
                <div
                  role="group"
                  aria-label={t("thickness.label")}
                  className="flex gap-1 rounded-lg bg-muted p-1"
                >
                  {(["thin", "medium", "thick"] as const).map((key) => (
                    <HandleTooltip key={key} label={t(`thickness.${key}`)} side="top">
                      <button
                        type="button"
                        aria-label={t(`thickness.${key}`)}
                        aria-pressed={strokeWidth === key}
                        onClick={() => setStrokeWidth(key)}
                        className={`cursor-pointer rounded-md p-2 transition-all hover:bg-background hover:shadow-sm hover:ring-1 hover:ring-primary/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 active:scale-95 ${
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

          <TabsContent value="type" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="signature-text">{t("type.label")}</Label>
              <Input
                id="signature-text"
                placeholder={t("type.placeholder")}
                value={textSignature}
                onChange={(e) => setTextSignature(e.target.value)}
                className="text-lg"
                autoComplete="name"
              />
            </div>
            {/* White preview matches final black ink on PDF */}
            <div className="flex min-h-[140px] items-center justify-center rounded-xl border border-slate-200 bg-white p-8 text-center shadow-inner">
              {textSignature.trim() ? (
                <span
                  className="text-4xl text-black"
                  style={{ fontFamily: '"Segoe Script", "Apple Chancery", cursive' }}
                >
                  {textSignature}
                </span>
              ) : (
                <span className="italic text-slate-400">{t("type.preview")}</span>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-2 flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isSubmitting}
          >
            {t("actions.cancel")}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!canConfirm}
            className="min-w-[10.5rem]"
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
