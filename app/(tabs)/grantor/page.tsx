"use client";

import DelegationCard from "@/components/DelegationCard";
import { t } from "@/lib/i18n";
import { CURRENT_GRANTOR_ID } from "@/data/seedDelegations";
import { useDelegationsStore } from "@/store/delegations";
import { useSettingsStore } from "@/store/settings";
import { CalendarClock, FileText, ShieldCheck, User2, Phone, X } from "lucide-react";
import { useMemo, useState } from "react";
import { durationLabel, formatDate, platformLabel } from "@/lib/utils";
import StatusBadge from "@/components/StatusBadge";

const filters = ["all", "active", "pending", "completed", "rejected", "expired"] as const;

type Filter = (typeof filters)[number];

const labelForFilter = (filter: Filter, language: "ar" | "en") => {
  switch (filter) {
    case "all":
      return language === "ar" ? "الكل" : "All";
    case "active":
      return t("statusActive", language);
    case "pending":
      return t("statusPending", language);
    case "completed":
      return t("statusCompleted", language);
    case "rejected":
      return t("statusRejected", language);
    case "expired":
      return t("statusExpired", language);
    default:
      return filter;
  }
};

export default function GrantorPage() {
  const language = useSettingsStore((state) => state.language);
  const { updateDelegation } = useDelegationsStore();
  const delegationsState = useDelegationsStore((state) => state.delegations);
  const [filter, setFilter] = useState<Filter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const delegations = useMemo(() => {
    let list = delegationsState.filter(
      (item) =>
        item.grantorId === CURRENT_GRANTOR_ID &&
        !item.isArchivedForGrantor &&
        !item.isDeletedForGrantor
    );
    if (filter !== "all") {
      list = list.filter((item) => item.status === filter);
    }
    return list;
  }, [filter, delegationsState]);

  const archive = (id: string) => updateDelegation(id, { isArchivedForGrantor: true });
  const remove = (id: string) => updateDelegation(id, { isDeletedForGrantor: true });
  const selected = delegations.find((d) => d.id === selectedId) ?? null;

  return (
    <div className="space-y-3">
      <div className="card p-4">
        <h1 className="text-lg font-semibold text-slate-900">
          {t("grantorDelegations", language)}
        </h1>
        <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
          {filters.map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`rounded-xl border px-2 py-2 font-semibold shadow-sm ${
                filter === item
                  ? "border-[#1B8E5A] bg-[#1B8E5A]/10 text-[#1B8E5A]"
                  : "border-[var(--border)] text-slate-600"
              }`}
            >
              {labelForFilter(item, language)}
            </button>
          ))}
        </div>
      </div>

      {delegations.map((delegation) => (
        <DelegationCard
          key={delegation.id}
          delegation={delegation}
          language={language}
          mode="grantor"
          onArchive={archive}
          onDelete={remove}
          onSelect={() => setSelectedId(delegation.id)}
        />
      ))}

      {delegations.length === 0 && (
        <p className="rounded-2xl border border-dashed border-[var(--border)] bg-white px-4 py-6 text-center text-sm text-slate-500">
          {language === "ar" ? "لا توجد تفويضات مطابقة" : "No delegations match the filter."}
        </p>
      )}

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 px-2 pb-20 sm:items-center sm:pb-0"
          onClick={() => setSelectedId(null)}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-white shadow-2xl sm:max-h-[80vh] sm:overflow-hidden"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-[#1B8E5A]" />
                <div>
                  <p className="text-xs text-slate-500">
                    {platformLabel(selected.platform, language)}
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    {language === "ar" ? selected.serviceNameAr : selected.serviceNameEn}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={selected.status} language={language} />
                <button
                  aria-label={language === "ar" ? "إغلاق" : "Close"}
                  onClick={() => setSelectedId(null)}
                  className="rounded-full p-1 text-slate-500 hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="space-y-3 px-4 py-3 text-sm text-slate-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarClock className="h-4 w-4 text-[#1B8E5A]" />
                  <span>
                    {formatDate(selected.startAt)} - {formatDate(selected.endAt)}
                  </span>
                </div>
                <span className="rounded-full bg-[#1B8E5A]/10 px-3 py-1 text-xs font-semibold text-[#1B8E5A]">
                  {durationLabel(selected.durationType, language)}
                </span>
              </div>

              <div className="space-y-2 rounded-2xl border border-[var(--border)] bg-slate-50 p-3">
                <div className="flex items-center gap-2 text-slate-800">
                  <User2 className="h-4 w-4 text-[#1B8E5A]" />
                  <span className="font-semibold">{language === "ar" ? "المفوَّض" : "Delegate"}</span>
                </div>
                <p className="text-slate-800 font-semibold">{selected.delegateName}</p>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Phone className="h-4 w-4 text-[#1B8E5A]" />
                  <span>{selected.delegatePhone}</span>
                </div>
              </div>

              <div className="rounded-2xl border border-[var(--border)] bg-white p-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <FileText className="h-4 w-4 text-[#1B8E5A]" />
                  {language === "ar" ? "الشروط والأحكام" : "Terms & Conditions"}
                </div>
                <p className="mt-2 text-xs leading-6 text-slate-700">
                  {language === "ar"
                    ? "نص تجريبي يمثل الشروط والأحكام للتفويض. للاطلاع فقط."
                    : "Placeholder terms text for review only."}
                </p>
              </div>
            </div>

            <div className="sticky bottom-0 grid grid-cols-2 gap-2 border-t border-[var(--border)] bg-white px-4 py-3">
              <button
                onClick={() => {
                  archive(selected.id);
                  setSelectedId(null);
                }}
                className="flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] px-3 py-3 text-sm font-semibold text-slate-700"
              >
                {t("archive", language)}
              </button>
              <button
                onClick={() => {
                  remove(selected.id);
                  setSelectedId(null);
                }}
                className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-3 text-sm font-semibold text-red-700"
              >
                {t("delete", language)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
