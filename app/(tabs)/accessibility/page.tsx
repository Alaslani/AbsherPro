"use client";

import { t } from "@/lib/i18n";
import { useSettingsStore } from "@/store/settings";
import { Contrast, Languages, Type, Zap } from "lucide-react";
import React from "react";

export default function AccessibilityPage() {
  const language = useSettingsStore((state) => state.language);
  const toggleLargeText = useSettingsStore((state) => state.toggleLargeText);
  const toggleHighContrast = useSettingsStore((state) => state.toggleHighContrast);
  const toggleBigButtons = useSettingsStore((state) => state.toggleBigButtons);
  const setLanguage = useSettingsStore((state) => state.setLanguage);
  const largeText = useSettingsStore((state) => state.largeText);
  const highContrast = useSettingsStore((state) => state.highContrast);
  const bigButtons = useSettingsStore((state) => state.bigButtons);

  return (
    <div className="space-y-3">
      <div className="card p-4">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-[#1B8E5A]" />
          <h1 className="text-lg font-semibold text-slate-900">{t("accessibilityTitle", language)}</h1>
        </div>
        <p className="mt-1 text-sm text-slate-600">
          {language === "ar"
            ? "خصص التجربة بما يناسبك"
            : "Customize the experience to your comfort."}
        </p>
      </div>

      <div className="card space-y-3 p-4">
        <ToggleRow
          active={language === "ar"}
          onClick={() => setLanguage(language === "ar" ? "en" : "ar")}
          title={language === "ar" ? "العربية" : "English"}
          subtitle={language === "ar" ? "تبديل اللغة" : "Switch language"}
          icon={<Languages className="h-5 w-5" />}
        />
        <ToggleRow
          active={largeText}
          onClick={toggleLargeText}
          title={t("largeText", language)}
          subtitle={language === "ar" ? "نص أكبر لقراءة مريحة" : "Larger body text"}
          icon={<Type className="h-5 w-5" />}
        />
        <ToggleRow
          active={highContrast}
          onClick={toggleHighContrast}
          title={t("highContrast", language)}
          subtitle={language === "ar" ? "ألوان قوية وأوضح" : "Stronger contrast"}
          icon={<Contrast className="h-5 w-5" />}
        />
        <ToggleRow
          active={bigButtons}
          onClick={toggleBigButtons}
          title={t("bigButtons", language)}
          subtitle={language === "ar" ? "زيادة حجم الأزرار" : "Increase button size"}
          icon={<Type className="h-5 w-5" />}
        />
      </div>
    </div>
  );
}

function ToggleRow({
  active,
  onClick,
  title,
  subtitle,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-2xl border px-3 py-3 text-left shadow-sm ${
        active
          ? "border-[#1B8E5A] bg-[#1B8E5A]/10 text-[#1B8E5A]"
          : "border-[var(--border)] bg-white text-slate-800"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#1B8E5A]">
          {icon}
        </div>
        <div>
          <p className="text-sm font-semibold">{title}</p>
          <p className="text-xs text-slate-500">{subtitle}</p>
        </div>
      </div>
      <div
        className={`h-6 w-11 rounded-full border ${
          active ? "border-[#1B8E5A] bg-[#1B8E5A]" : "border-[var(--border)] bg-slate-200"
        }`}
      >
        <div
          className={`h-5 w-5 rounded-full bg-white shadow transition ${
            active ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </div>
    </button>
  );
}
