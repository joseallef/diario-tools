"use client";

import {
  applyGtagConsent,
  createConsent,
  readConsent,
  writeConsent,
  type ConsentState,
} from "@/lib/consent";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type ConsentContextValue = {
  /** Hydration complete — safe to read persisted choice */
  ready: boolean;
  consent: ConsentState | null;
  /** Banner / preferences panel open */
  preferencesOpen: boolean;
  openPreferences: () => void;
  closePreferences: () => void;
  acceptAll: () => void;
  rejectOptional: () => void;
  savePreferences: (analytics: boolean) => void;
};

const ConsentContext = createContext<ConsentContextValue | null>(null);

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [consent, setConsent] = useState<ConsentState | null>(null);
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  useEffect(() => {
    const stored = readConsent();
    setConsent(stored);
    setReady(true);
    if (stored) {
      applyGtagConsent(stored.analytics);
    }
  }, []);

  const persist = useCallback((analytics: boolean) => {
    const next = createConsent(analytics);
    writeConsent(next);
    setConsent(next);
    applyGtagConsent(analytics);
    setPreferencesOpen(false);
  }, []);

  const value = useMemo<ConsentContextValue>(
    () => ({
      ready,
      consent,
      preferencesOpen,
      openPreferences: () => setPreferencesOpen(true),
      closePreferences: () => setPreferencesOpen(false),
      acceptAll: () => persist(true),
      rejectOptional: () => persist(false),
      savePreferences: (analytics: boolean) => persist(analytics),
    }),
    [ready, consent, preferencesOpen, persist]
  );

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
}

export function useConsent(): ConsentContextValue {
  const ctx = useContext(ConsentContext);
  if (!ctx) {
    throw new Error("useConsent must be used within ConsentProvider");
  }
  return ctx;
}
