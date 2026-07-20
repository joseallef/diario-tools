"use client";

import { useConsent } from "@/components/consent/ConsentProvider";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export function CookieBanner() {
  const t = useTranslations("CookieConsent");
  const {
    ready,
    consent,
    preferencesOpen,
    closePreferences,
    acceptAll,
    rejectOptional,
    savePreferences,
  } = useConsent();

  const [customizing, setCustomizing] = useState(false);
  const [analyticsDraft, setAnalyticsDraft] = useState(false);

  const needsChoice = ready && consent === null;
  const show = needsChoice || preferencesOpen;

  useEffect(() => {
    if (preferencesOpen) {
      setCustomizing(true);
      setAnalyticsDraft(consent?.analytics ?? false);
    } else if (needsChoice) {
      setCustomizing(false);
      setAnalyticsDraft(false);
    }
  }, [preferencesOpen, consent, needsChoice]);

  if (!show) return null;

  const showDetails = customizing || preferencesOpen;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-consent-title"
      className="fixed inset-x-0 bottom-0 z-[100] border-t border-border bg-background/95 p-4 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] backdrop-blur-md sm:p-5"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-4">
        <div className="space-y-2">
          <h2 id="cookie-consent-title" className="text-base font-semibold text-foreground">
            {preferencesOpen && consent ? t("manageTitle") : t("title")}
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {t("description")}{" "}
            <Link
              href="/privacidade"
              className="font-medium text-primary underline-offset-2 hover:underline"
            >
              {t("privacyLink")}
            </Link>
            .
          </p>
        </div>

        {showDetails && (
          <div className="space-y-3 rounded-lg border border-border bg-muted/40 p-3">
            <label className="flex items-start gap-3 text-sm">
              <input
                type="checkbox"
                checked
                disabled
                className="mt-1 size-4 accent-primary"
              />
              <span>
                <span className="font-medium text-foreground">{t("necessaryTitle")}</span>
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  {t("necessaryDescription")}
                </span>
              </span>
            </label>
            <label className="flex items-start gap-3 text-sm">
              <input
                type="checkbox"
                checked={analyticsDraft}
                onChange={(e) => setAnalyticsDraft(e.target.checked)}
                className="mt-1 size-4 cursor-pointer accent-primary"
              />
              <span>
                <span className="font-medium text-foreground">{t("analyticsTitle")}</span>
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  {t("analyticsDescription")}
                </span>
              </span>
            </label>
          </div>
        )}

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
          {showDetails ? (
            <>
              {preferencesOpen && consent ? (
                <Button type="button" variant="outline" onClick={closePreferences}>
                  {t("cancel")}
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setCustomizing(false);
                    setAnalyticsDraft(false);
                  }}
                >
                  {t("back")}
                </Button>
              )}
              <Button type="button" onClick={() => savePreferences(analyticsDraft)}>
                {t("save")}
              </Button>
            </>
          ) : (
            <>
              <Button type="button" variant="outline" onClick={() => setCustomizing(true)}>
                {t("customize")}
              </Button>
              <Button type="button" variant="secondary" onClick={rejectOptional}>
                {t("reject")}
              </Button>
              <Button type="button" onClick={acceptAll}>
                {t("accept")}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
