"use client";

import { Button } from "@/components/ui/button";
import { Dropzone } from "@/features/file-upload/Dropzone";
import { useEditorStore } from "@/features/pdf-editor/store/editorStore";
import { Loader2, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";

import { PrivacyBadge } from "@/components/PrivacyBadge";

// Importação Dinâmica com SSR desativado para evitar erro DOMMatrix
function EditorLoader() {
  const t = useTranslations("PdfEditorPage");
  return (
    <div className="flex flex-col items-center gap-2 mt-20">
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
    <main className="flex w-full flex-col items-center p-4 md:p-12">
      <div className="z-10 w-full max-w-5xl items-center justify-between text-sm lg:flex mb-8">
        <h1 className="w-full text-center text-3xl font-bold text-slate-900">{t("title")}</h1>
      </div>

      <div className="mb-8">
        <PrivacyBadge />
      </div>

      <div className="w-full max-w-4xl flex flex-col items-center gap-6">
        {!file ? (
          <div className="flex flex-col gap-6 text-center items-center">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-slate-800">{t("upload.title")}</h2>
              <p className="text-sm text-slate-500">{t("upload.description")}</p>
            </div>
            <Dropzone />
          </div>
        ) : (
          <div className="w-full flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-slate-200">
              <span className="font-medium text-slate-700 truncate max-w-[300px]">{file.name}</span>
              <Button
                variant="destructive"
                size="sm"
                onClick={reset}
                className="gap-2 cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
                {t("remove")}
              </Button>
            </div>
            <PdfViewer />
          </div>
        )}
      </div>
    </main>
  );
}
