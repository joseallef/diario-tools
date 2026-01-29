import { create } from 'zustand';

export interface Signature {
  id: string;
  type: 'image' | 'text' | 'draw';
  content: string; // Base64 ou URL
  x: number;
  y: number;
  width: number;
  height: number;
  page: number;
}

interface EditorState {
  file: File | null;
  fileBuffer: ArrayBuffer | null;
  numPages: number;
  currentPage: number;
  scale: number;
  signatures: Signature[];

  setFile: (file: File, buffer: ArrayBuffer) => void;
  setNumPages: (num: number) => void;
  setCurrentPage: (page: number) => void;
  setScale: (scale: number) => void;
  addSignature: (signature: Signature) => void;
  updateSignature: (id: string, updates: Partial<Signature>) => void;
  removeSignature: (id: string) => void;
  reset: () => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  file: null,
  fileBuffer: null,
  numPages: 0,
  currentPage: 1,
  scale: 1,
  signatures: [],

  setFile: (file, buffer) => {
    // Armazenar o buffer original E uma cópia se necessário,
    // mas o mais seguro é sempre passar uma cópia para quem consome.
    // Aqui garantimos que o que entra no store é válido.
    set({ file, fileBuffer: buffer });
  },
  setNumPages: (num) => set({ numPages: num }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setScale: (scale) => set({ scale }),

  addSignature: (signature) =>
    set((state) => ({
      signatures: [...state.signatures, signature],
    })),

  updateSignature: (id, updates) =>
    set((state) => ({
      signatures: state.signatures.map((sig) => (sig.id === id ? { ...sig, ...updates } : sig)),
    })),

  removeSignature: (id) =>
    set((state) => ({
      signatures: state.signatures.filter((sig) => sig.id !== id),
    })),

  reset: () =>
    set({
      file: null,
      fileBuffer: null,
      numPages: 0,
      currentPage: 1,
      scale: 1,
      signatures: [],
    }),
}));
