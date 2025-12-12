"use client";

import { t } from "@/lib/i18n";
import { useSettingsStore } from "@/store/settings";
import { Contrast, Languages, MapPin, Type, UserCheck, Zap, ArrowLeft } from "lucide-react";
import React, { useState } from "react";

export default function AccessibilityPage() {
  const language = useSettingsStore((state) => state.language);
  const toggleLargeText = useSettingsStore((state) => state.toggleLargeText);
  const toggleHighContrast = useSettingsStore((state) => state.toggleHighContrast);
  const toggleBigButtons = useSettingsStore((state) => state.toggleBigButtons);
  const setLanguage = useSettingsStore((state) => state.setLanguage);
  const largeText = useSettingsStore((state) => state.largeText);
  const highContrast = useSettingsStore((state) => state.highContrast);
  const bigButtons = useSettingsStore((state) => state.bigButtons);
  const [showAgentFlow, setShowAgentFlow] = useState(false);
  const [agentRequested, setAgentRequested] = useState(false);
  const [locationSaved, setLocationSaved] = useState(false);

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
        <button
          onClick={() => {
            setShowAgentFlow(true);
            setAgentRequested(false);
            setLocationSaved(false);
          }}
          className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-[#EA580C] to-[#f18f3c] px-4 py-3 text-white shadow hover:brightness-95"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
              <ArrowLeft className="h-4 w-4" />
            </span>
            <div className="text-left">
              <p className="text-sm font-semibold">{t("trustedAgentTitle", language)}</p>
              <p className="text-xs text-white/80">{t("trustedAgentDesc", language)}</p>
            </div>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
            <UserCheck className="h-6 w-6" />
          </div>
        </button>

        {showAgentFlow && (
          <div className="rounded-2xl border border-[var(--border)] bg-white px-4 py-4 shadow-sm">
            <div className="flex items-center justify-between rounded-2xl bg-[#1B8E5A]/10 px-3 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-[#1B8E5A] shadow-inner">
                  <UserCheck className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-slate-900">{t("trustedAgentTitle", language)}</h2>
                  <p className="text-xs text-slate-600">{t("trustedAgentDesc", language)}</p>
                </div>
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#B45309] shadow-sm">
                {t("trustedAgentCost", language)}
              </span>
            </div>

            <div className="mt-3 rounded-xl border border-dashed border-[var(--border)] bg-slate-50 px-3 py-3 text-left">
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 text-[#1B8E5A]" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800">{t("trustedAgentLocationTitle", language)}</p>
                  <button
                    onClick={() => setLocationSaved(true)}
                    className="mt-2 inline-flex items-center gap-2 rounded-lg bg-[#1B8E5A] px-3 py-2 text-xs font-semibold text-white shadow-sm hover:brightness-95"
                  >
                    <MapPin className="h-4 w-4" />
                    {t("trustedAgentLocationBtn", language)}
                  </button>
                  {locationSaved && (
                    <p className="mt-2 text-xs font-semibold text-emerald-700">
                      {t("trustedAgentLocationSaved", language)}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-3 flex flex-col gap-2">
              <button
                onClick={() => setAgentRequested(true)}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#1B8E5A] px-4 py-3 text-sm font-semibold text-white shadow-sm hover:brightness-95 disabled:opacity-60"
                disabled={!locationSaved}
              >
                <ArrowLeft className="h-4 w-4" />
                {t("trustedAgentConfirm", language)}
              </button>

              <button
                onClick={() => {
                  setShowAgentFlow(false);
                  setAgentRequested(false);
                  setLocationSaved(false);
                }}
                className="w-full rounded-2xl border border-[var(--border)] px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                {t("trustedAgentBack", language)}
              </button>
            </div>

            {agentRequested && (
              <p className="mt-3 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800">
                {t("trustedAgentDone", language)}
              </p>
            )}
          </div>
        )}

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
