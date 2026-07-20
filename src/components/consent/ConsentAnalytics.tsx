"use client";

import { useConsent } from "@/components/consent/ConsentProvider";
import { GoogleAnalytics } from "@next/third-parties/google";

const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

/**
 * Loads GA4 only after affirmative analytics consent.
 * Consent Mode default (denied) is set in the root layout beforeInteractive script.
 */
export function ConsentAnalytics() {
  const { ready, consent } = useConsent();

  if (!gaId || !ready || !consent?.analytics) {
    return null;
  }

  return <GoogleAnalytics gaId={gaId} />;
}
