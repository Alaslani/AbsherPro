"use client";

import { t } from "@/lib/i18n";
import { useDelegationsStore } from "@/store/delegations";
import { useSettingsStore } from "@/store/settings";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  PieChart,
  Award,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Star,
} from "lucide-react";
import { useMemo } from "react";

export default function AnalyticsPage() {
  const language = useSettingsStore((state) => state.language);
  const delegations = useDelegationsStore((state) => state.delegations);

  const stats = useMemo(() => {
    const filtered = delegations.filter(
      (item) => !item.isDeletedForDelegate && !item.isDeletedForGrantor
    );
    const total = filtered.length;
    const accepted = filtered.filter((d) => d.delegateStatus === "accepted").length;
    const rejected = filtered.filter((d) => d.status === "rejected").length;
    const durationCounts = {
      "24h": filtered.filter((d) => d.durationType === "24h").length,
      "7d": filtered.filter((d) => d.durationType === "7d").length,
      custom: filtered.filter((d) => d.durationType === "custom").length,
    } as const;
    const platformCounts = {
      absher: filtered.filter((d) => d.platform === "absher").length,
      najiz: filtered.filter((d) => d.platform === "najiz").length,
    } as const;
    const successRate = total === 0 ? 0 : Math.round((accepted / total) * 100);
    return { total, accepted, rejected, durationCounts, platformCounts, successRate };
  }, [delegations]);

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-[#1B8E5A]" />
          <h1 className="text-lg font-semibold text-slate-900">
            {t("analyticsTitle", language)}
          </h1>
        </div>
        <p className="mt-1 text-sm text-slate-500">
          {language === "ar"
            ? "نظرة سريعة على أداء التفويضات"
            : "Quick snapshot of delegations performance"}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatCard
          title={language === "ar" ? "تفويضات مكتمِلة" : "Completed"}
          value={stats.accepted}
          icon={<CheckCircle2 className="h-5 w-5 text-emerald-600" />}
          bg="bg-emerald-50"
        />
        <StatCard
          title={language === "ar" ? "تفويضات مرفوضة" : "Rejected"}
          value={stats.rejected}
          icon={<XCircle className="h-5 w-5 text-red-600" />}
          bg="bg-red-50"
        />
        <StatCard
          title={language === "ar" ? "إجمالي التفويضات" : "Total"}
          value={stats.total}
          icon={<PieChart className="h-5 w-5 text-[#1B8E5A]" />}
          bg="bg-slate-50"
        />
        <StatCard
          title={language === "ar" ? "نسبة النجاح" : "Success rate"}
          value={`${stats.successRate}%`}
          icon={<CheckCircle2 className="h-5 w-5 text-[#1B8E5A]" />}
          bg="bg-[#1B8E5A]/10"
        />
      </div>

      <div className="card space-y-3 p-4">
        <div className="flex items-center justify-between">
          <p className="text-base font-semibold text-slate-900">
            {language === "ar" ? "الخدمات الأكثر استخداماً" : "Top used services"}
          </p>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="h-3 w-3 rounded-full bg-emerald-500" />
            <span className="h-3 w-3 rounded-full bg-blue-500" />
            <span className="h-3 w-3 rounded-full bg-amber-500" />
            <span className="h-3 w-3 rounded-full bg-purple-500" />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-2 text-sm font-semibold text-slate-800">
            <LegendRow color="bg-emerald-500" label={language === "ar" ? "المخالفات" : "Violations"} value="35%" />
            <LegendRow color="bg-blue-500" label={language === "ar" ? "الجوازات" : "Passports"} value="25%" />
            <LegendRow color="bg-amber-500" label={language === "ar" ? "الأحوال" : "Civil"} value="22%" />
            <LegendRow color="bg-purple-500" label={language === "ar" ? "المركبات" : "Vehicles"} value="18%" />
          </div>
          <div className="relative h-32 w-32">
            <div className="absolute inset-0 rounded-full border-[14px] border-emerald-500" />
            <div className="absolute inset-1 rounded-full border-[12px] border-blue-500 clip-50" />
            <div className="absolute inset-2 rounded-full border-[10px] border-amber-500 clip-75" />
            <div className="absolute inset-3 rounded-full border-[8px] border-purple-500 clip-90" />
          </div>
        </div>
      </div>

      <div className="card space-y-3 p-4">
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5 text-[#1B8E5A]" />
          <p className="text-base font-semibold text-slate-900">
            {language === "ar" ? "أفضل المفوَّضين" : "Top delegates"}
          </p>
        </div>
        <div className="space-y-2">
          {[
            { name: "أحمد العتيبي", score: 4.9, count: 45, color: "bg-emerald-50" },
            { name: "خالد الدوسري", score: 4.8, count: 38, color: "bg-blue-50" },
            { name: "محمد السعيد", score: 4.7, count: 32, color: "bg-purple-50" },
          ].map((item, idx) => (
            <div
              key={item.name}
              className={`${item.color} flex items-center justify-between rounded-2xl border border-[var(--border)] px-3 py-3`}
            >
              <div className="flex items-center gap-2">
                <span className="text-base font-semibold text-slate-900">{item.name}</span>
                <span className="flex items-center gap-1 text-sm text-amber-500">
                  {item.score} <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                </span>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                {idx + 1}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card space-y-3 p-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <p className="text-base font-semibold text-slate-900">
            {language === "ar" ? "أسباب الفشل" : "Failure reasons"}
          </p>
        </div>
        {[
          { reason: language === "ar" ? "عدم تواجد المستلم" : "Recipient unavailable", count: 3 },
          { reason: language === "ar" ? "عنوان خاطئ" : "Wrong address", count: 1 },
          { reason: language === "ar" ? "مستندات ناقصة" : "Missing documents", count: 1 },
        ].map((item) => (
          <div
            key={item.reason}
            className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-red-50/60 px-3 py-2 text-sm text-slate-800"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-700">
              {item.count}
            </span>
            <span className="flex-1 px-3 text-right">{item.reason}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  bg,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  bg?: string;
}) {
  return (
    <div className={cn("card flex items-center justify-between p-4", bg ?? "")}>
      <div>
        <p className="text-sm text-slate-500">{title}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </div>
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/70 text-[#1B8E5A]">
        {icon}
      </div>
    </div>
  );
}

function LegendRow({
  color,
  label,
  value,
}: {
  color: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className={`h-3 w-3 rounded-full ${color}`} />
      <span>{label}</span>
      <span className="text-slate-500">{value}</span>
    </div>
  );
}
