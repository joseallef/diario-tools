"use client";

import { PrivacyTrust } from "@/components/PrivacyTrust";
import { Button } from "@/components/ui/button";
import { Dropzone } from "@/features/file-upload/Dropzone";
import { useEditorStore } from "@/features/pdf-editor/store/editorStore";
import { Loader2, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";

function EditorLoader() {
  const t = useTranslations("PdfEditorPage");
  return (
    <div className="mt-20 flex flex-col items-center gap-2">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <span className="text-sm text-slate-500">{t("loading")}</span>
    </div>
  );
}

const PdfViewer = dynamic(
  () => import("@/features/pdf-editor/components/PdfViewer").then((mod) => mod.PdfViewer),
  {
    ssr: false,
    loading: EditorLoader,
  }
);

export function PdfEditorPage() {
  const { file, reset } = useEditorStore();
  const t = useTranslations("PdfEditorPage");

  return (
    <div className="flex w-full flex-col items-center p-4 md:p-12">
      <div className="mb-6 flex w-full max-w-3xl flex-col items-center gap-3 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {t("title")}
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          {t("subtitle")}
        </p>
      </div>

      {!file && (
        <div className="mb-8 w-full flex justify-center">
          <PrivacyTrust />
        </div>
      )}

      <div className="flex w-full max-w-4xl flex-col items-center gap-6">
        {!file ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="space-y-1.5">
              <h2 className="text-lg font-semibold text-foreground">{t("upload.title")}</h2>
              <p className="max-w-md text-sm text-muted-foreground">{t("upload.description")}</p>
            </div>
            <Dropzone />
            <p className="max-w-md text-xs leading-relaxed text-muted-foreground">
              {t("upload.reassure")}
            </p>
          </div>
        ) : (
          <div className="w-full animate-in fade-in slide-in-from-bottom-4 flex flex-col gap-4 duration-500">
            <div className="flex items-center justify-between rounded-lg border border-border bg-card p-4 shadow-sm">
              <span className="max-w-[300px] truncate font-medium text-foreground">
                {file.name}
              </span>
              <Button
                variant="destructive"
                size="sm"
                onClick={reset}
                className="cursor-pointer gap-2"
              >
                <Trash2 className="h-4 w-4" />
                {t("remove")}
              </Button>
            </div>
            <p className="text-center text-xs text-muted-foreground">{t("editingHint")}</p>
            <PdfViewer />
          </div>
        )}
      </div>
    </div>
  );
}
