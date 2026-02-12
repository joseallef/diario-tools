"use client";

import { Card } from "@/components/ui/card";
import { useEditorStore } from "@/features/pdf-editor/store/editorStore";
import { cn } from "@/lib/utils";
import { File as FileIcon, Upload } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

export function Dropzone() {
  const { setFile } = useEditorStore();
  const t = useTranslations("Dropzone");

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      if (file.type !== "application/pdf") {
        toast.error(t("errorType"));
        return;
      }

      try {
        const buffer = await file.arrayBuffer();
        setFile(file, buffer);
        toast.success(t("successUpload"));
      } catch {
        toast.error(t("errorRead"));
      }
    },
    [setFile, t]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
  });

  return (
    <Card
      {...getRootProps()}
      className={cn(
        "flex w-full max-w-md flex-col items-center justify-center gap-4 p-10 text-center transition-colors cursor-pointer border-2 border-dashed",
        isDragActive ? "border-primary bg-primary/5" : "border-slate-200 hover:bg-slate-50"
      )}
    >
      <input {...getInputProps()} />
      <div className="rounded-full bg-slate-100 p-4">
        {isDragActive ? (
          <FileIcon className="h-8 w-8 text-primary animate-bounce" />
        ) : (
          <Upload className="h-8 w-8 text-slate-400" />
        )}
      </div>
      <div>
        <p className="text-lg font-medium text-slate-900">
          {isDragActive ? t("dragActive") : t("dragInactive")}
        </p>
        <p className="text-sm text-slate-500 mt-1">{t("maxSize")}</p>
      </div>
    </Card>
  );
}
