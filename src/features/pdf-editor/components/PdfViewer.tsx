"use client";

import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/features/pdf-editor/store/editorStore";
import { Download, Loader2, Minus, Plus } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { toast } from "sonner";
import { burnSignaturesIntoPdf, downloadPdf } from "../utils/pdfProcessing";
import { DraggableSignature } from "./DraggableSignature";
import { SignatureModal } from "./SignatureModal";

// Configurar worker via CDN
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
  } = useEditorStore();
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [isSaving, setIsSaving] = useState(false);
  const [realScale, setRealScale] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Refs para cálculo de coordenadas
  const pageRef = useRef<HTMLDivElement>(null);
  const [pdfPageWidth, setPdfPageWidth] = useState<number>(0); // Largura real do PDF (Points)

  // Memorizar o buffer para evitar loops de renderização e detached buffer
  const safeFileBuffer = useMemo(() => {
    return fileBuffer ? fileBuffer.slice(0) : null;
  }, [fileBuffer]);

  // Resize observer e cálculo de escala real
  useEffect(() => {
    const updateDimensions = () => {
      const container = document.getElementById("pdf-container-wrapper");
      if (container) {
        setContainerWidth(container.clientWidth - 48);
      }

      // Calcular escala real (visual vs layout) para corrigir o drag
      if (pageRef.current) {
        const rect = pageRef.current.getBoundingClientRect();
        // Se houver scale CSS ou zoom, rect.width será diferente de offsetWidth
        // Mas offsetWidth pode ser 0 se hidden.
        if (pageRef.current.offsetWidth > 0) {
          const scale = rect.width / pageRef.current.offsetWidth;
          // Pequena tolerância para evitar updates desnecessários
          if (Math.abs(scale - 1) > 0.01) {
            setRealScale(scale);
          } else {
            setRealScale(1);
          }
        }
      }
    };

    window.addEventListener("resize", updateDimensions);
    // Executar periodicamente para garantir que pegamos o estado final da renderização
    const interval = setInterval(updateDimensions, 1000);
    setTimeout(updateDimensions, 100);

    return () => {
      window.removeEventListener("resize", updateDimensions);
      clearInterval(interval);
    };
  }, [fileBuffer, numPages, currentPage]);

  const handleAddSignature = (dataUrl: string) => {
    // Adicionar assinatura no centro da tela visível
    addSignature({
      id: crypto.randomUUID(),
      type: "image",
      content: dataUrl,
      x: 100, // Posição inicial arbitrária
      y: 100,
      width: 150, // Largura padrão
      height: 75,
      page: currentPage,
    });
  };

  const handleDownload = async () => {
    if (!fileBuffer || !file) return;

    try {
      setIsSaving(true);
      // Calcular fator de escala: (Tamanho Real PDF) / (Tamanho Renderizado na Tela)
      // O react-pdf retorna o viewport original no onLoadSuccess da Page, mas vamos simplificar:
      // Se a página está renderizada com width X e o PDF tem width Y.

      // Vamos pegar o objeto PDFPageProxy do react-pdf para ter as dimensões reais
      // Mas por simplicidade, vamos passar 1 por enquanto e ajustar na lógica de processamento
      // ou melhor: Capturar a largura real via evento onLoadSuccess da Page

      // Fator de escala simples se soubermos a largura original.
      // Como fallback, vamos assumir que o react-pdf renderizou na largura containerWidth
      // e precisamos descobrir a largura original do PDF.

      // Correção: Precisamos do PDFDocumentProxy para pegar as dimensões reais.
      // Vamos fazer isso dentro do `burnSignaturesIntoPdf` carregando o doc novamente.
      // Mas precisamos passar a relação de aspecto.

      // Solução Robusta: Passar para o `burnSignaturesIntoPdf` a largura em PIXELS que a página tem na tela AGORA.
      // A função lá dentro compara com a largura em POINTS do PDF e calcula o ratio.

      const currentRenderedWidth = pageRef.current?.clientWidth || containerWidth;

      // Passamos scaleFactor como inverso: Quantos Points de PDF valem 1 Pixel de Tela?
      // Na verdade, passamos a largura renderizada e deixamos o utilitário calcular.

      // Vamos alterar a assinatura do método burn para aceitar renderedWidth
      // Mas aqui vamos calcular manualmente o ratio aproximado
      // Ratio = (PDF Points Width) / (Rendered Pixels Width)
      // Como não temos o PDF Points Width aqui fácil (sem acessar o objeto interno do react-pdf),
      // Vamos passar o Rendered Width para a função e ela carrega o PDF e descobre.

      const pdfBytes = await burnSignaturesIntoPdf(
        fileBuffer,
        signatures,
        0 // 0 indica que vamos calcular dentro da função baseada na largura da página
      );

      // Hack temporário: A função burn precisa saber a largura renderizada para calcular o ratio
      // Vamos modificar a função burnSignaturesIntoPdf para aceitar (renderedWidth)

      downloadPdf(pdfBytes, `assinado_${file.name}`);
      toast.success("Download iniciado!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao gerar PDF.");
    } finally {
      setIsSaving(false);
    }
  };

  // Callback quando a página carrega para capturar dimensões reais se possível
  const onPageLoadSuccess = (page: any) => {
    setPdfPageWidth(page.originalWidth);
  };

  const handleDownloadWithScale = async () => {
    if (!fileBuffer || !file) return;
    setIsSaving(true);
    try {
      const renderedWidth = pageRef.current?.clientWidth || 1;
      const pdfOriginalWidth = pdfPageWidth || 595; // Fallback A4

      const scaleFactor = pdfOriginalWidth / renderedWidth;

      const pdfBytes = await burnSignaturesIntoPdf(fileBuffer, signatures, scaleFactor);
      downloadPdf(pdfBytes, `assinado_${file.name}`);
      toast.success("PDF Assinado gerado com sucesso!");
    } catch (e) {
      toast.error("Erro ao processar PDF");
    } finally {
      setIsSaving(false);
    }
  };

  if (!fileBuffer) return null;

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.5));

  return (
    <div id="pdf-container-wrapper" className="flex flex-col items-center w-full gap-4">
      {/* Toolbar Flutuante Superior - Ações Principais */}
      <div className="sticky top-4 z-50 flex gap-2 bg-white/90 backdrop-blur shadow-lg p-2 rounded-full border border-slate-200 max-w-[95vw] overflow-hidden">
        <SignatureModal onConfirm={handleAddSignature} />

        <div className="w-px bg-slate-200 mx-1" />

        <Button
          onClick={handleDownloadWithScale}
          disabled={isSaving || signatures.length === 0}
          className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 cursor-pointer"
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          <span className="hidden sm:inline">
            {isSaving ? "Processando..." : "Baixar PDF Assinado"}
          </span>
          <span className="inline sm:hidden">{isSaving ? "Salvar" : "Baixar"}</span>
        </Button>
      </div>

      {/* Toolbar Flutuante Inferior - Zoom Controls */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 bg-white/90 backdrop-blur shadow-lg border border-slate-200 p-1.5 rounded-full">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full hover:bg-slate-100 cursor-pointer"
          onClick={handleZoomOut}
          disabled={zoomLevel <= 0.5}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="text-xs font-medium w-10 text-center select-none tabular-nums">
          {Math.round(zoomLevel * 100)}%
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full hover:bg-slate-100 cursor-pointer"
          onClick={handleZoomIn}
          disabled={zoomLevel >= 3}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="bg-slate-100 p-8 rounded-xl min-h-[600px] overflow-auto w-full flex justify-center shadow-inner">
        <Document
          file={safeFileBuffer}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          loading={
            <div className="flex flex-col items-center gap-2 mt-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="text-sm text-slate-500">Renderizando PDF...</span>
            </div>
          }
          className="shadow-xl relative"
        >
          {/* Container Relativo para Overlay */}
          <div className="relative" ref={pageRef}>
            <Page
              pageNumber={currentPage}
              width={containerWidth > 0 ? Math.min(containerWidth, 800) * zoomLevel : undefined}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              className="bg-white"
              onLoadSuccess={onPageLoadSuccess}
            />

            {/* Overlay Layer - Onde as assinaturas vivem */}
            <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
              {signatures
                .filter((s) => s.page === currentPage)
                .map((sig) => (
                  <DraggableSignature
                    key={sig.id}
                    signature={sig}
                    containerScale={realScale * zoomLevel}
                  />
                ))}
            </div>
          </div>
        </Document>
      </div>

      {numPages > 1 && (
        <div className="flex gap-4 items-center bg-white p-2 rounded-lg border shadow-sm">
          <Button
            variant="outline"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="cursor-pointer"
          >
            Anterior
          </Button>
          <span className="text-sm font-medium">
            Página {currentPage} de {numPages}
          </span>
          <Button
            variant="outline"
            disabled={currentPage >= numPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="cursor-pointer"
          >
            Próxima
          </Button>
        </div>
      )}
    </div>
  );
}
