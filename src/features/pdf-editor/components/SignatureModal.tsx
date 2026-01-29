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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Eraser, PenLine, Type } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import SignaturePad from "signature_pad";

interface SignatureModalProps {
  onConfirm: (dataUrl: string) => void;
  trigger?: React.ReactNode;
}

export function SignatureModal({ onConfirm, trigger }: SignatureModalProps) {
  const [open, setOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const signaturePadRef = useRef<SignaturePad | null>(null);
  const [textSignature, setTextSignature] = useState("");
  const [activeTab, setActiveTab] = useState("draw");

  // Estado para debug
  // const [debugInfo, setDebugInfo] = useState('Aguardando montagem...');

  // Variáveis de controle (refs para manter estado sem re-render)

  // Callback Ref: O React chama isso quando o elemento é montado
  const setCanvasRef = useCallback((node: HTMLCanvasElement | null) => {
    if (node !== null) {
      canvasRef.current = node;

      const canvas = node;

      // Inicialização Segura com SignaturePad
      const init = () => {
        const parent = canvas.parentElement;
        const width = parent?.clientWidth || 300;
        const height = parent?.clientHeight || 150;

        canvas.width = width;
        canvas.height = height;

        // Limpa instância anterior se houver
        if (signaturePadRef.current) {
          signaturePadRef.current.off();
        }

        // Inicializa a Lib
        signaturePadRef.current = new SignaturePad(canvas, {
          minWidth: 1,
          maxWidth: 3,
          penColor: "rgb(0, 0, 0)",
          backgroundColor: "rgba(255, 255, 255, 0)",
          velocityFilterWeight: 0.7,
        });

        // setDebugInfo(`SignaturePad Ready: ${width}x${height}`);
      };

      // Delay minúsculo para garantir layout
      requestAnimationFrame(() => {
        init();
        setTimeout(init, 300);
      });

      // Bloqueia scroll no canvas (Mobile fix essencial)
      const preventScroll = (e: TouchEvent) => {
        if (e.target === canvas) {
          e.preventDefault();
        }
      };

      canvas.addEventListener("touchstart", preventScroll, { passive: false });
      canvas.addEventListener("touchmove", preventScroll, { passive: false });
      canvas.addEventListener("touchend", preventScroll, { passive: false });
    } else {
      // Cleanup
      if (signaturePadRef.current) {
        signaturePadRef.current.off();
        signaturePadRef.current = null;
      }
    }
  }, []); // Dependências vazias = só cria uma vez

  // Removemos o useEffect antigo completamente

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handleConfirm = () => {
    let dataUrl = "";

    if (activeTab === "draw" && canvasRef.current) {
      // Verifica se desenhou algo (simples check visual ou flag)
      dataUrl = canvasRef.current.toDataURL("image/png");
    } else if (activeTab === "type" && textSignature) {
      // Converter texto em imagem via Canvas temporário
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.font = '48px "Great Vibes", cursive'; // Fonte simulada por enquanto
        const textWidth = ctx.measureText(textSignature).width;
        canvas.width = textWidth + 40;
        canvas.height = 100;

        // Configurar novamente após resize
        ctx.font = "48px cursive"; // Fallback para cursive nativa se Great Vibes não carregar
        ctx.fillStyle = "black";
        ctx.textBaseline = "middle";
        ctx.fillText(textSignature, 20, 50);
        dataUrl = canvas.toDataURL("image/png");
      }
    }

    if (dataUrl) {
      onConfirm(dataUrl);
      setOpen(false);
      // Reset
      setTextSignature("");
      clearCanvas();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2">
            <PenLine className="h-4 w-4" />
            Adicionar Assinatura
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Criar Assinatura</DialogTitle>
          <DialogDescription>Escolha como deseja assinar o documento.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="draw" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="draw" className="gap-2">
              <PenLine className="h-4 w-4" /> Desenhar
            </TabsTrigger>
            <TabsTrigger value="type" className="gap-2">
              <Type className="h-4 w-4" /> Digitar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="draw" className="space-y-4 py-4">
            <div className="relative rounded-lg border-2 border-slate-300 bg-white h-[200px] w-full overflow-hidden">
              <canvas
                ref={setCanvasRef}
                className="block w-full h-full cursor-crosshair touch-none relative z-10"
                style={{ touchAction: "none" }}
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50 z-50 bg-white/80 backdrop-blur-sm shadow-sm"
                onClick={clearCanvas}
                title="Limpar"
              >
                <Eraser className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-center text-slate-400">
              Desenhe sua assinatura acima usando o mouse ou o dedo.
            </p>
          </TabsContent>

          <TabsContent value="type" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="signature-text">Seu Nome</Label>
              <Input
                id="signature-text"
                placeholder="Ex: João Silva"
                value={textSignature}
                onChange={(e) => setTextSignature(e.target.value)}
                className="text-lg"
              />
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-8 text-center min-h-[120px] flex items-center justify-center">
              {textSignature ? (
                <span className="text-4xl font-[cursive]">{textSignature}</span>
              ) : (
                <span className="text-slate-300 italic">Visualização da assinatura</span>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 mt-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={activeTab === "draw" ? false : !textSignature}>
            <Check className="mr-2 h-4 w-4" />
            Inserir Assinatura
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
