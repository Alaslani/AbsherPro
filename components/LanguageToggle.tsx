"use client";

import { cn } from "@/lib/utils";
import { useSettingsStore } from "@/store/settings";
import { Languages } from "lucide-react";

const LanguageToggle = () => {
  const language = useSettingsStore((state) => state.language);
  const setLanguage = useSettingsStore((state) => state.setLanguage);

  const nextLanguage = language === "ar" ? "en" : "ar";

  return (
    <button
      onClick={() => setLanguage(nextLanguage)}
      className={cn(
        "flex items-center gap-2 rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm font-semibold text-[#1B8E5A] shadow-sm transition hover:border-[#1B8E5A]",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B8E5A]"
      )}
      aria-label={language === "ar" ? "Switch to English" : "التبديل للعربية"}
    >
      <Languages className="h-4 w-4" />
      <span>{language === "ar" ? "EN" : "ع"}</span>
    </button>
  );
};

export default LanguageToggle;
