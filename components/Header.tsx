"use client";

import LanguageToggle from "@/components/LanguageToggle";
import { t } from "@/lib/i18n";
import { useSettingsStore } from "@/store/settings";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, Mic, Sparkles } from "lucide-react";
import AiAssistantButton from "./AiAssistantButton";

const Header = () => {
  const language = useSettingsStore((state) => state.language);
  const pathname = usePathname();
  const router = useRouter();

  const titles: Record<string, string> = {
    "/": t("home", language),
    "/grantor": t("grantor", language),
    "/delegate": t("delegate", language),
    "/analytics": t("analytics", language),
    "/accessibility": t("accessibility", language),
  };

  const pageTitle = titles[pathname] ?? t("appTitle", language);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-md items-center justify-between gap-3 px-4 py-3">
        <button
          onClick={() => router.back()}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-white text-[#1B8E5A] shadow-sm"
          aria-label="Back"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex flex-1 items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#1B8E5A] to-[#156B45] text-white shadow">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-500">{t("appTitle", language)}</p>
            <p className="text-base font-semibold text-slate-900">{pageTitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <AiAssistantButton size="sm">
            <Mic className="h-4 w-4" />
          </AiAssistantButton>
        </div>
      </div>
    </header>
  );
};

export default Header;
