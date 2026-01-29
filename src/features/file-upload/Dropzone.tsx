'use client';

import { Card } from '@/components/ui/card';
import { useEditorStore } from '@/features/pdf-editor/store/editorStore';
import { cn } from '@/lib/utils';
import { File as FileIcon, Upload } from 'lucide-react';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';

export function Dropzone() {
  const { setFile } = useEditorStore();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      if (file.type !== 'application/pdf') {
        toast.error('Por favor, envie apenas arquivos PDF.');
        return;
      }

      try {
        const buffer = await file.arrayBuffer();
        setFile(file, buffer);
        toast.success('PDF carregado com sucesso!');
      } catch (error) {
        toast.error('Erro ao ler o arquivo.');
      }
    },
    [setFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
  });

  return (
    <Card
      {...getRootProps()}
      className={cn(
        'flex w-full max-w-md flex-col items-center justify-center gap-4 p-10 text-center transition-colors cursor-pointer border-2 border-dashed',
        isDragActive ? 'border-primary bg-primary/5' : 'border-slate-200 hover:bg-slate-50'
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
          {isDragActive ? 'Solte o PDF aqui' : 'Clique ou arraste seu PDF'}
        </p>
        <p className="text-sm text-slate-500 mt-1">Arquivos de até 50MB</p>
      </div>
    </Card>
  );
}
