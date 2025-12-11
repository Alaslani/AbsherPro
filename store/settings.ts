import { Language } from "@/lib/i18n";
import { create } from "zustand";

const SETTINGS_STORAGE_KEY = "absher-settings";

export type SettingsState = {
  language: Language;
  largeText: boolean;
  highContrast: boolean;
  bigButtons: boolean;
  hasHydrated: boolean;
  setLanguage: (language: Language) => void;
  toggleLargeText: () => void;
  toggleHighContrast: () => void;
  toggleBigButtons: () => void;
  hydrate: () => void;
};

export const useSettingsStore = create<SettingsState>((set) => ({
  language: "ar",
  largeText: false,
  highContrast: false,
  bigButtons: false,
  hasHydrated: false,
  setLanguage: (language) => set({ language }),
  toggleLargeText: () => set((state) => ({ largeText: !state.largeText })),
  toggleHighContrast: () => set((state) => ({ highContrast: !state.highContrast })),
  toggleBigButtons: () => set((state) => ({ bigButtons: !state.bigButtons })),
  hydrate: () => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as Partial<SettingsState>;
      set({
        language: parsed.language ?? "ar",
        largeText: parsed.largeText ?? false,
        highContrast: parsed.highContrast ?? false,
        bigButtons: parsed.bigButtons ?? false,
        hasHydrated: true,
      });
      return;
    }
    set({ hasHydrated: true });
  },
}));

export const persistSettings = (state: SettingsState) => {
  if (typeof window === "undefined") return;
  const payload = {
    language: state.language,
    largeText: state.largeText,
    highContrast: state.highContrast,
    bigButtons: state.bigButtons,
  };
  window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(payload));
};
