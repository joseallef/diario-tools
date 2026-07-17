import { create } from "zustand";

/**
 * Signature placement uses normalized page coordinates (0–1).
 * This keeps position/size correct across zoom, resize and multi-page PDFs.
 */
export interface Signature {
  id: string;
  type: "draw" | "text" | "image";
  content: string;
  /** Left edge as fraction of page width */
  x: number;
  /** Top edge as fraction of page height */
  y: number;
  /** Width as fraction of page width */
  width: number;
  /** Height as fraction of page height */
  height: number;
  page: number;
  /** Intrinsic image width / height */
  aspectRatio: number;
  /** Rotation in degrees (CSS clockwise positive) */
  rotation: number;
}

interface EditorState {
  file: File | null;
  fileBuffer: ArrayBuffer | null;
  numPages: number;
  currentPage: number;
  scale: number;
  signatures: Signature[];
  selectedSignatureId: string | null;
  /** Data URL waiting for click-to-place on the PDF */
  pendingSignature: { content: string; type: Signature["type"]; aspectRatio: number } | null;

  setFile: (file: File, buffer: ArrayBuffer) => void;
  setNumPages: (num: number) => void;
  setCurrentPage: (page: number) => void;
  setScale: (scale: number) => void;
  addSignature: (signature: Signature) => void;
  updateSignature: (id: string, updates: Partial<Signature>) => void;
  removeSignature: (id: string) => void;
  setSelectedSignatureId: (id: string | null) => void;
  setPendingSignature: (
    pending: { content: string; type: Signature["type"]; aspectRatio: number } | null
  ) => void;
  reset: () => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  file: null,
  fileBuffer: null,
  numPages: 0,
  currentPage: 1,
  scale: 1,
  signatures: [],
  selectedSignatureId: null,
  pendingSignature: null,

  setFile: (file, buffer) => {
    set({
      file,
      fileBuffer: buffer,
      signatures: [],
      selectedSignatureId: null,
      pendingSignature: null,
      currentPage: 1,
    });
  },
  setNumPages: (num) => set({ numPages: num }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setScale: (scale) => set({ scale }),

  addSignature: (signature) =>
    set((state) => ({
      signatures: [...state.signatures, signature],
      selectedSignatureId: signature.id,
      pendingSignature: null,
    })),

  updateSignature: (id, updates) =>
    set((state) => ({
      signatures: state.signatures.map((sig) => (sig.id === id ? { ...sig, ...updates } : sig)),
    })),

  removeSignature: (id) =>
    set((state) => ({
      signatures: state.signatures.filter((sig) => sig.id !== id),
      selectedSignatureId: state.selectedSignatureId === id ? null : state.selectedSignatureId,
    })),

  setSelectedSignatureId: (id) => set({ selectedSignatureId: id }),
  setPendingSignature: (pending) => set({ pendingSignature: pending, selectedSignatureId: null }),

  reset: () =>
    set({
      file: null,
      fileBuffer: null,
      numPages: 0,
      currentPage: 1,
      scale: 1,
      signatures: [],
      selectedSignatureId: null,
      pendingSignature: null,
    }),
}));

/** Default signature width ≈ 28% of page width; height follows aspect ratio. */
export function computeDefaultNormSize(
  aspectRatio: number,
  pageWidthPx: number,
  pageHeightPx: number
): { width: number; height: number } {
  const width = 0.28;
  const height = (width * pageWidthPx) / (aspectRatio * pageHeightPx);
  const maxHeight = 0.18;
  if (height > maxHeight) {
    return {
      width: (maxHeight * aspectRatio * pageHeightPx) / pageWidthPx,
      height: maxHeight,
    };
  }
  return { width, height };
}
