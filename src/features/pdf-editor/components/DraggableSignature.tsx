"use client";

import { Signature, useEditorStore } from "@/features/pdf-editor/store/editorStore";
import { GripVertical, Maximize2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface DraggableSignatureProps {
  signature: Signature;
  containerScale: number;
}

export function DraggableSignature({ signature, containerScale = 1 }: DraggableSignatureProps) {
  const { removeSignature, updateSignature } = useEditorStore();

  // Estado local para controle preciso de Posição e Tamanho
  const [position, setPosition] = useState({ x: signature.x, y: signature.y });
  const [size, setSize] = useState({ width: signature.width, height: signature.height });

  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  // Refs para cálculo de delta
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const initialPosRef = useRef<{ x: number; y: number } | null>(null);
  const initialSizeRef = useRef<{ width: number; height: number } | null>(null);

  // Sincronizar estado se mudar externamente
  useEffect(() => {
    if (!isDragging && !isResizing) {
      setPosition({ x: signature.x, y: signature.y });
      setSize({ width: signature.width, height: signature.height });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature.x, signature.y, signature.width, signature.height]);

  // --- Lógica de DRAG ---
  const handleDragStart = (e: React.PointerEvent) => {
    if (isResizing) return;
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

    dragStartRef.current = { x: e.clientX, y: e.clientY };
    initialPosRef.current = { x: position.x, y: position.y };
  };

  const handleDragMove = (e: React.PointerEvent) => {
    if (!isDragging || !dragStartRef.current || !initialPosRef.current) return;

    e.preventDefault();
    e.stopPropagation();

    const deltaX = (e.clientX - dragStartRef.current.x) / containerScale;
    const deltaY = (e.clientY - dragStartRef.current.y) / containerScale;

    let newX = initialPosRef.current.x + deltaX;
    let newY = initialPosRef.current.y + deltaY;

    // Bounds
    const element = e.currentTarget as HTMLElement;
    const parent = element.offsetParent as HTMLElement;

    if (parent) {
      const parentWidth = parent.clientWidth;
      const parentHeight = parent.clientHeight;
      const maxX = parentWidth - size.width;
      const maxY = parentHeight - size.height;

      newX = Math.max(0, Math.min(newX, maxX));
      newY = Math.max(0, Math.min(newY, maxY));
    }

    setPosition({ x: newX, y: newY });
  };

  const handleDragEnd = (e: React.PointerEvent) => {
    if (!isDragging) return;

    e.preventDefault();
    e.stopPropagation();

    setIsDragging(false);
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);

    updateSignature(signature.id, { x: position.x, y: position.y });
    dragStartRef.current = null;
    initialPosRef.current = null;
  };

  // --- Lógica de RESIZE ---
  const handleResizeStart = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Importante: Não propagar para o Drag

    setIsResizing(true);
    // Captura no botão de resize, mas o evento de move pode ser global ou no botão.
    // Melhor capturar no botão.
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

    dragStartRef.current = { x: e.clientX, y: e.clientY };
    initialSizeRef.current = { width: size.width, height: size.height };
  };

  const handleResizeMove = (e: React.PointerEvent) => {
    if (!isResizing || !dragStartRef.current || !initialSizeRef.current) return;

    e.preventDefault();
    e.stopPropagation();

    const deltaX = (e.clientX - dragStartRef.current.x) / containerScale;
    // Não usamos deltaY direto para manter aspect ratio, mas calculamos baseado no X

    const aspectRatio = initialSizeRef.current.width / initialSizeRef.current.height;

    let newWidth = initialSizeRef.current.width + deltaX;
    // Limites mínimos
    newWidth = Math.max(30, newWidth);

    // Calcular altura proporcional
    const newHeight = newWidth / aspectRatio;

    // TODO: Limites máximos (não sair da página) poderiam ser adicionados aqui
    // Mas resize geralmente permite crescer e o drag ajusta depois.
    // Vamos apenas garantir que não quebre o layout.

    setSize({ width: newWidth, height: newHeight });
  };

  const handleResizeEnd = (e: React.PointerEvent) => {
    if (!isResizing) return;

    e.preventDefault();
    e.stopPropagation();

    setIsResizing(false);
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);

    updateSignature(signature.id, {
      width: size.width,
      height: size.height,
    });

    dragStartRef.current = null;
    initialSizeRef.current = null;
  };

  return (
    <div
      onPointerDown={handleDragStart}
      onPointerMove={handleDragMove}
      onPointerUp={handleDragEnd}
      className={`absolute z-50 group select-none pointer-events-auto ${isDragging ? "cursor-grabbing" : "cursor-move"}`}
      style={{
        width: size.width * containerScale,
        height: size.height * containerScale,
        transform: `translate3d(${position.x * containerScale}px, ${position.y * containerScale}px, 0)`,
        touchAction: "none",
        willChange: "transform, width, height",
      }}
    >
      {/* A Imagem da Assinatura - Z-Index 0 */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={signature.content}
        alt="Assinatura"
        draggable={false}
        className="w-full h-full object-contain pointer-events-none select-none relative z-0"
      />

      {/* Hitbox Layer - Z-Index 10 - Garante captura do clique em cima da imagem + Feedback Visual */}
      <div className="absolute inset-0 z-10 bg-transparent hover:bg-black/5 transition-colors cursor-move rounded-sm" />

      {/* Borda de Foco/Hover - Sempre visível em touch devices ou quando ativo */}
      <div
        className={`absolute inset-0 border-2 border-primary rounded-md transition-opacity pointer-events-none z-20 ${isDragging || isResizing ? "opacity-100" : "opacity-0 group-hover:opacity-100 [@media(hover:none)]:opacity-100"}`}
      />

      {/* Botão de Remover - Sempre visível em touch devices */}
      <button
        onPointerDown={(e) => {
          e.stopPropagation();
          removeSignature(signature.id);
        }}
        className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 [@media(hover:none)]:opacity-100 transition-opacity shadow-md z-50 hover:bg-red-600 cursor-pointer"
      >
        <X className="h-3 w-3" />
      </button>

      {/* Handle de Drag (Visual aid - Esquerda) */}
      <div className="absolute -left-4 top-1/2 -translate-y-1/2 text-slate-400 opacity-0 group-hover:opacity-100 [@media(hover:none)]:opacity-100 transition-opacity pointer-events-none z-50">
        <GripVertical className="h-4 w-4" />
      </div>

      {/* Handle de Resize (Canto Inferior Direito) */}
      <div
        onPointerDown={handleResizeStart}
        onPointerMove={handleResizeMove}
        onPointerUp={handleResizeEnd}
        className="absolute -bottom-2 -right-2 w-6 h-6 bg-white border-2 border-primary rounded-full flex items-center justify-center cursor-nwse-resize z-50 shadow-sm opacity-0 group-hover:opacity-100 [@media(hover:none)]:opacity-100 transition-opacity touch-none"
      >
        <Maximize2 className="h-3 w-3 text-primary rotate-90" />
      </div>
    </div>
  );
}
