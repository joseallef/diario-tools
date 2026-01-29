"use client";

import { Signature, useEditorStore } from "@/features/pdf-editor/store/editorStore";
import { GripVertical, X } from "lucide-react";
import { useRef } from "react";
import Draggable from "react-draggable";

interface DraggableSignatureProps {
  signature: Signature;
  containerScale: number; // Para limitar o movimento dentro da página se necessário
}

export function DraggableSignature({ signature }: DraggableSignatureProps) {
  const { removeSignature, updateSignature } = useEditorStore();
  const nodeRef = useRef(null); // Ref para evitar findDOMNode deprecated error

  const handleStop = (e: any, data: { x: number; y: number }) => {
    updateSignature(signature.id, { x: data.x, y: data.y });
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      position={{ x: signature.x, y: signature.y }}
      onStop={handleStop}
      // bounds="parent" // Removido temporariamente para evitar travamento se o parent não for detectado corretamente
    >
      <div
        ref={nodeRef}
        className="absolute z-50 group cursor-move hover:ring-2 ring-primary ring-offset-2 rounded-md transition-all"
        style={{ width: signature.width, height: signature.height, margin: 0 }} // margin 0 é importante
      >
        {/* Botão de Remover (só aparece no hover) */}
        <button
          onClick={() => removeSignature(signature.id)}
          // onTouchEnd para mobile
          onTouchEnd={(e) => {
            e.stopPropagation();
            removeSignature(signature.id);
          }}
          className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-50 hover:bg-red-600"
        >
          <X className="h-3 w-3" />
        </button>

        {/* Handle de Drag (Visual aid) */}
        <div className="absolute -left-4 top-1/2 -translate-y-1/2 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
          <GripVertical className="h-4 w-4" />
        </div>

        {/* A Imagem da Assinatura */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={signature.content}
          alt="Assinatura"
          draggable={false} // Importante para não conflitar com o Draggable
          className="w-full h-full object-contain pointer-events-none select-none"
        />
      </div>
    </Draggable>
  );
}
