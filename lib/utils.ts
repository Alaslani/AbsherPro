import { Delegation, DurationType } from "@/data/seedDelegations";
import { services } from "@/data/services";

export const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

export const formatDate = (value: string) => {
  const date = new Date(value);
  return date.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const formatDateTime = (value: string) => {
  const date = new Date(value);
  return date.toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const statusColor = (status: Delegation["status"]) => {
  switch (status) {
    case "active":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "pending":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "completed":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "rejected":
      return "bg-red-50 text-red-700 border-red-200";
    case "expired":
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
};

export const durationLabel = (duration: DurationType, language: "ar" | "en") => {
  const map: Record<DurationType, { ar: string; en: string }> = {
    "24h": { ar: "24 ساعة", en: "24 hours" },
    "7d": { ar: "7 أيام", en: "7 days" },
    custom: { ar: "تاريخ مخصص", en: "Custom" },
  };
  return map[duration]?.[language] ?? duration;
};

export const platformLabel = (
  platform: "absher" | "absherBusiness" | "najiz",
  language: "ar" | "en"
) => {
  if (platform === "absherBusiness") return language === "ar" ? "أبشر أعمال" : "Absher Business";
  return platform === "absher" ? (language === "ar" ? "أبشر" : "Absher") : language === "ar" ? "ناجز" : "Najiz";
};

export const findServiceById = (serviceId: string) =>
  services.find((service) => service.id === serviceId);

export const computeEndDate = (start: Date, durationType: DurationType) => {
  const end = new Date(start);
  if (durationType === "24h") {
    end.setHours(end.getHours() + 24);
  } else if (durationType === "7d") {
    end.setDate(end.getDate() + 7);
  }
  return end;
};
