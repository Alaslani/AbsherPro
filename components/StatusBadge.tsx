import { t } from "@/lib/i18n";
import { statusColor } from "@/lib/utils";
import { Delegation } from "@/data/seedDelegations";

const statusLabels: Record<Delegation["status"], { ar: string; en: string }> = {
  pending: { ar: t("statusPending", "ar"), en: t("statusPending", "en") },
  active: { ar: t("statusActive", "ar"), en: t("statusActive", "en") },
  completed: { ar: t("statusCompleted", "ar"), en: t("statusCompleted", "en") },
  rejected: { ar: t("statusRejected", "ar"), en: t("statusRejected", "en") },
  expired: { ar: t("statusExpired", "ar"), en: t("statusExpired", "en") },
};

const StatusBadge = ({ status, language }: { status: Delegation["status"]; language: "ar" | "en" }) => {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-semibold ${statusColor(status)}`}>
      {statusLabels[status][language]}
    </span>
  );
};

export default StatusBadge;
