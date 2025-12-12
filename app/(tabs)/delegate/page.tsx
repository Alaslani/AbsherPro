"use client";

import DelegationCard from "@/components/DelegationCard";
import { t } from "@/lib/i18n";
import { cn, durationLabel, formatDate, platformLabel } from "@/lib/utils";
import { useDelegationsStore } from "@/store/delegations";
import { useSettingsStore } from "@/store/settings";
import {
  CalendarClock,
  CheckCircle2,
  FileText,
  Phone,
  ScrollText,
  ShieldCheck,
  User2,
  X,
} from "lucide-react";
import { KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import StatusBadge from "@/components/StatusBadge";

export default function DelegatePage() {
  const language = useSettingsStore((state) => state.language);
  const { updateDelegation } = useDelegationsStore();
  const delegationsState = useDelegationsStore((state) => state.delegations);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  const delegations = useMemo(
    () =>
      delegationsState.filter(
        (item) => !item.isArchivedForDelegate && !item.isDeletedForDelegate
      ),
    [delegationsState]
  );

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const openDetails = (id: string) => {
    setSelectedId(id);
  };

  const closeDetails = () => {
    setSelectedId(null);
  };

  const accept = (id: string) => {
    updateDelegation(id, {
      delegateAcceptedTerms: true,
      delegateStatus: "accepted",
      status: "active",
      delegateAcceptedAt: new Date().toISOString(),
    });
    closeDetails();
  };

  const reject = (id: string) => {
    updateDelegation(id, {
      delegateStatus: "rejected",
      status: "rejected",
    });
    closeDetails();
  };

  const archive = (id: string) => updateDelegation(id, { isArchivedForDelegate: true });
  const remove = (id: string) => updateDelegation(id, { isDeletedForDelegate: true });

  const selected = delegations.find((d) => d.id === selectedId) ?? null;
  const hideTerms = selected?.delegateStatus === "accepted" || selected?.delegateStatus === "rejected";
  const titleId = selected ? `delegation-${selected.id}-title` : undefined;
  const termsId = selected ? `delegation-${selected.id}-terms` : undefined;

  useEffect(() => {
    if (selected && closeButtonRef.current) {
      lastFocusedRef.current = document.activeElement as HTMLElement | null;
      closeButtonRef.current.focus();
    }

    if (!selected && lastFocusedRef.current) {
      lastFocusedRef.current.focus();
      lastFocusedRef.current = null;
    }
  }, [selected]);

  const trapFocus = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab") return;
    const dialog = event.currentTarget;
    const focusable = dialog.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey) {
      if (document.activeElement === first) {
        event.preventDefault();
        last.focus();
      }
    } else if (document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <div className="space-y-3">
      <div className="card p-4">
        <h1 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
          <ScrollText className="h-5 w-5 text-[#1B8E5A]" /> {t("delegateDelegations", language)}
        </h1>
        {delegations.length === 0 && (
          <p className="mt-3 text-sm text-slate-500">
            {language === "ar" ? "لا يوجد تفويض بانتظارك" : "No delegation awaiting you."}
          </p>
        )}
      </div>

      {delegations.map((delegation) => (
        <DelegationCard
          key={delegation.id}
          delegation={delegation}
          language={language}
          mode="delegate"
          onSelect={() => openDetails(delegation.id)}
          onArchive={archive}
          onDelete={remove}
        />
      ))}

      {selected && !hideTerms && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 px-2 pb-20 sm:items-center sm:pb-0">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={termsId}
            className="w-full max-w-md rounded-3xl bg-white shadow-2xl sm:max-h-[80vh] sm:overflow-hidden"
            onKeyDown={trapFocus}
          >
            <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-[#1B8E5A]" />
                <div>
                  <p className="text-xs text-slate-500">
                    {platformLabel(selected.platform, language)}
                  </p>
                  <p id={titleId} className="text-sm font-semibold text-slate-900">
                    {language === "ar" ? selected.serviceNameAr : selected.serviceNameEn}
                  </p>
                </div>
              </div>
              <StatusBadge status={selected.status} language={language} />
              <button
                onClick={closeDetails}
                ref={closeButtonRef}
                className="rounded-full border border-[var(--border)] p-2 text-slate-600"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 px-4 py-3">
              <div className="flex items-center justify-between text-sm text-slate-700">
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
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <User2 className="h-4 w-4 text-[#1B8E5A]" />
                <span>{language === "ar" ? selected.grantorName : selected.grantorName}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <Phone className="h-4 w-4 text-[#1B8E5A]" />
                <span>{selected.delegatePhone}</span>
              </div>

              <div className="rounded-2xl border border-[var(--border)] bg-slate-50 p-3">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <FileText className="h-4 w-4 text-[#1B8E5A]" />
                  {t("termsHeading", language)}
                </div>
                <div className="max-h-40 space-y-2 overflow-y-auto rounded-xl bg-white px-3 py-3 text-xs leading-6 text-slate-700">
                  <p>1) {t("termsBullet1", language)}</p>
                  <p>2) {t("termsBullet2", language)}</p>
                  <p>3) {t("termsBullet3", language)}</p>
                </div>
                <div
                  id={termsId}
                  dir={language === "ar" ? "rtl" : "ltr"}
                  className={cn(
                    "mt-3 rounded-xl bg-white px-3 py-3",
                    language === "ar" ? "text-right" : "text-left"
                  )}
                >
                  <p className="text-sm leading-relaxed">{t("termsNotice", language)}</p>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 grid grid-cols-2 gap-2 border-t border-[var(--border)] bg-white px-4 py-3">
              <button
                onClick={() => accept(selected.id)}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold text-white shadow-sm",
                  "bg-[#1B8E5A]"
                )}
              >
                <CheckCircle2 className="h-5 w-5" /> {t("accept", language)}
              </button>
              <button
                onClick={() => reject(selected.id)}
                className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-3 text-sm font-semibold text-red-700 shadow-sm"
              >
                <X className="h-5 w-5" /> {t("reject", language)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
