"use client";

import { ReactNode, useEffect } from "react";
import { useDelegationsStore, DELEGATIONS_STORAGE_KEY } from "@/store/delegations";
import { persistSettings, useSettingsStore } from "@/store/settings";
import { cn } from "@/lib/utils";

export default function Providers({ children }: { children: ReactNode }) {
  const {
    delegations,
    hydrate: hydrateDelegations,
    hasHydrated: delegationsHydrated,
  } = useDelegationsStore();

  const {
    language,
    largeText,
    highContrast,
    bigButtons,
    hydrate: hydrateSettings,
    hasHydrated: settingsHydrated,
  } = useSettingsStore();

  useEffect(() => {
    hydrateSettings();
    hydrateDelegations();
  }, [hydrateSettings, hydrateDelegations]);

  useEffect(() => {
    if (!settingsHydrated) return;
    persistSettings(useSettingsStore.getState());
  }, [language, largeText, highContrast, bigButtons, settingsHydrated]);

  useEffect(() => {
    if (!delegationsHydrated || typeof window === "undefined") return;
    window.localStorage.setItem(
      DELEGATIONS_STORAGE_KEY,
      JSON.stringify(delegations)
    );
  }, [delegations, delegationsHydrated]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language]);

  return (
    <div
      data-big-buttons={bigButtons ? "true" : "false"}
      data-high-contrast={highContrast ? "true" : "false"}
      className={cn(
        "min-h-screen transition-colors duration-300",
        language === "ar" ? "font-[var(--font-cairo)]" : "font-[var(--font-inter)]",
        highContrast ? "bg-white text-black" : "bg-[#F8FAF9] text-slate-900",
        largeText ? "text-[17px]" : "text-[15px]"
      )}
    >
      {children}
    </div>
  );
}
