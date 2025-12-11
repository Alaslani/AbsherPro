import { Delegation } from "@/data/seedDelegations";
import { t } from "@/lib/i18n";
import { cn, durationLabel, formatDate, platformLabel } from "@/lib/utils";
import { Archive, CalendarClock, CheckCircle2, Clock3, Shield, Trash2, User2 } from "lucide-react";
import StatusBadge from "./StatusBadge";

interface Props {
  delegation: Delegation;
  language: "ar" | "en";
  mode: "grantor" | "delegate";
  onArchive?: (id: string) => void;
  onDelete?: (id: string) => void;
  onSelect?: (delegation: Delegation) => void;
}

const DelegationCard = ({ delegation, language, mode, onArchive, onDelete, onSelect }: Props) => {
  const label = language === "ar" ? delegation.serviceNameAr : delegation.serviceNameEn;
  const platform = platformLabel(delegation.platform, language);

  const handleSelect = () => {
    if (onSelect) onSelect(delegation);
  };

  return (
    <div
      className={cn(
        "card w-full cursor-pointer p-4 transition hover:shadow-md",
        language === "ar" ? "text-right" : "text-left"
      )}
      onClick={handleSelect}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Shield className="h-4 w-4 text-[#1B8E5A]" />
            <span>{platform}</span>
          </div>
          <p className="text-lg font-semibold text-slate-900">{label}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <StatusBadge status={delegation.status} language={language} />
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2 py-1 text-[11px] font-semibold",
              delegation.platform === "absher"
                ? "bg-[#1B8E5A]/10 text-[#1B8E5A]"
                : "bg-[#6B4FA0]/10 text-[#6B4FA0]"
            )}
          >
            {delegation.platform === "absher" ? "🇸🇦" : "⚖️"} {platform}
          </span>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <Clock3 className="h-4 w-4 text-[#1B8E5A]" />
          <span>{durationLabel(delegation.durationType, language)}</span>
        </div>
        <div className="flex items-center gap-2">
          <CalendarClock className="h-4 w-4 text-[#1B8E5A]" />
          <span>
            {formatDate(delegation.startAt)} - {formatDate(delegation.endAt)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <User2 className="h-4 w-4 text-[#1B8E5A]" />
          <span className="text-sm">
            {mode === "delegate" ? delegation.grantorName : delegation.delegateName}
          </span>
        </div>
      </div>

      <div
        className="mt-4 flex items-center gap-2"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {onSelect && (
          <button
            onClick={() => onSelect(delegation)}
            className="flex-1 rounded-xl border border-[var(--border)] px-3 py-2 text-sm font-semibold text-[#1B8E5A] shadow-sm"
          >
            {t("viewDetails", language)}
          </button>
        )}
        {onArchive && (
          <button
            onClick={() => onArchive(delegation.id)}
            className="flex items-center gap-2 rounded-xl border border-[var(--border)] px-3 py-2 text-sm font-semibold text-slate-700"
          >
            <Archive className="h-4 w-4" /> {t("archive", language)}
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(delegation.id)}
            className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700"
          >
            <Trash2 className="h-4 w-4" /> {t("delete", language)}
          </button>
        )}
      </div>

      {mode === "delegate" && delegation.delegateStatus === "pending" && (
        <p className="mt-3 flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">
          <CheckCircle2 className="h-4 w-4" /> {t("pendingTerms", language)}
        </p>
      )}
    </div>
  );
};

export default DelegationCard;
