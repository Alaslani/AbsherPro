"use client";

import { services, ServiceOption, Platform } from "@/data/services";
import { DurationType } from "@/data/seedDelegations";
import { t } from "@/lib/i18n";
import { cn, durationLabel, formatDate, platformLabel } from "@/lib/utils";
import { useDelegationsStore } from "@/store/delegations";
import { useSettingsStore } from "@/store/settings";
import { useRouter } from "next/navigation";
import {
  AlarmClockCheck,
  ArrowLeft,
  BadgeCheck,
  Bell,
  Check,
  Clock3,
  FileCheck2,
  Loader2,
  Plus,
  Phone,
  Scale,
  Search,
  ShieldCheck,
  User2,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";

const steps = ["service", "duration", "delegate", "review"] as const;
type Step = (typeof steps)[number];

const statusPills: Record<
  "pending" | "active" | "completed",
  { bg: string; text: string; border: string }
> = {
  pending: { bg: "bg-amber-50", text: "text-amber-800", border: "border-amber-200" },
  active: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  completed: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
};

export default function HomePage() {
  const { createDelegation, delegations } = useDelegationsStore();
  const language = useSettingsStore((state) => state.language);
  const router = useRouter();

  const [step, setStep] = useState<Step>("service");
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>("absher");
  const [selectedService, setSelectedService] = useState<ServiceOption | null>(
    services.find((s) => s.platform === "absher") ?? services[0]
  );
  const [durationType, setDurationType] = useState<DurationType>("24h");
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [customEndDate, setCustomEndDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [delegateName, setDelegateName] = useState("");
  const [delegateId, setDelegateId] = useState("");
  const [delegatePhone, setDelegatePhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [success, setSuccess] = useState<string | null>(null);
  const flowRef = useRef<HTMLDivElement | null>(null);

  const normalizeDigits = (value: string) => {
    const arabicDigits = "٠١٢٣٤٥٦٧٨٩";
    const englishDigits = "0123456789";
    return value
      .replace(/[٠-٩]/g, (d) => englishDigits[arabicDigits.indexOf(d)])
      .replace(/\D/g, "")
      .slice(0, 10);
  };

  const startDateObj = useMemo(() => new Date(startDate), [startDate]);
  const autoEndDate = useMemo(() => {
    if (durationType === "24h") {
      const end = new Date(startDateObj);
      end.setDate(end.getDate() + 1);
      return end.toISOString().slice(0, 10);
    }
    if (durationType === "7d") {
      const end = new Date(startDateObj);
      end.setDate(end.getDate() + 7);
      return end.toISOString().slice(0, 10);
    }
    return customEndDate;
  }, [durationType, startDateObj, customEndDate]);

  const latestDelegations = useMemo(
    () =>
      delegations
        .filter((d) => !d.isDeletedForGrantor && !d.isDeletedForDelegate)
        .slice(0, 3),
    [delegations]
  );

  const stats = useMemo(() => {
    const pending = delegations.filter((d) => d.status === "pending").length;
    const active = delegations.filter((d) => d.status === "active").length;
    const completed = delegations.filter((d) => d.status === "completed").length;
    const total = delegations.length;
    return { pending, active, completed, total };
  }, [delegations]);

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const haystack = `${service.nameAr} ${service.nameEn}`.toLowerCase();
      const matchesSearch = haystack.includes(searchTerm.toLowerCase());
      const matchesPlatform = service.platform === selectedPlatform;
      return matchesSearch && matchesPlatform;
    });
  }, [searchTerm, selectedPlatform]);

  const handlePlatformSelect = (platform: Platform) => {
    setSelectedPlatform(platform);
    const firstService = services.find((s) => s.platform === platform);
    if (firstService) setSelectedService(firstService);
    setStep("service");
    // Smooth scroll to flow
    if (flowRef.current) {
      flowRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const startNewDelegation = () => {
    setStep("service");
    const firstService = services.find((s) => s.platform === selectedPlatform) ?? services[0];
    setSelectedService(firstService);
    if (flowRef.current) {
      flowRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleConfirm = () => {
    if (!selectedService || !delegateName || delegateId.length !== 10 || !delegatePhone) return;
    const created = createDelegation({
      serviceId: selectedService.id,
      serviceNameAr: selectedService.nameAr,
      serviceNameEn: selectedService.nameEn,
      platform: selectedService.platform,
      isDigitalService: selectedService.isDigital,
      delegateId,
      delegateName,
      delegatePhone,
      durationType,
      startAt: startDateObj.toISOString(),
      endAt: new Date(autoEndDate).toISOString(),
    });
    setSuccess(created.id);
    setStep("service");
    setDelegateId("");
    setDelegateName("");
    setDelegatePhone("");
    setDurationType("24h");
    const today = new Date().toISOString().slice(0, 10);
    setStartDate(today);
    setCustomEndDate(today);
  };

  const heroCard = (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1B8E5A] via-[#17814f] to-[#156B45] p-4 text-white shadow-lg">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-sm opacity-90">{language === "ar" ? "مرحباً بك في" : "Welcome to"}</p>
          <h1 className="text-2xl font-bold tracking-tight">
            {language === "ar" ? "خدمات التفويض الذكي" : "Smart Delegation Services"}
          </h1>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
          <Bell className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <HeroStat
          label={language === "ar" ? "التفويضات النشطة" : "Active delegations"}
          value={stats.active || 1}
        />
        <HeroStat
          label={language === "ar" ? "قيد الانتظار" : "Pending"}
          value={stats.pending || 1}
          variant="soft"
        />
      </div>
    </div>
  );

  const quickStats = (
    <div className="grid grid-cols-2 gap-3">
      <MiniStat
        icon={<Clock3 className="h-5 w-5 text-amber-600" />}
        title={language === "ar" ? "قيد الانتظار" : "Pending"}
        value={stats.pending}
        dotClass="bg-amber-500"
      />
      <MiniStat
        icon={<BadgeCheck className="h-5 w-5 text-emerald-600" />}
        title={language === "ar" ? "نشط" : "Active"}
        value={stats.active}
        dotClass="bg-emerald-500"
      />
      <MiniStat
        icon={<User2 className="h-5 w-5 text-[#6B4FA0]" />}
        title={language === "ar" ? "إجمالي" : "Total"}
        value={stats.total}
        dotClass="bg-[#6B4FA0]"
      />
      <MiniStat
        icon={<FileCheck2 className="h-5 w-5 text-blue-600" />}
        title={language === "ar" ? "مكتمل" : "Completed"}
        value={stats.completed}
        dotClass="bg-blue-500"
      />
    </div>
  );

  return (
    <div className="space-y-4">
      {heroCard}

            <div className="card p-4">
        <div className="flex items-center justify-between">
          <p className="text-base font-semibold text-slate-900">منصات التفويض</p>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {[
            {
              key: "absher",
              label: "أبشر",
              icon: <ShieldCheck className="h-6 w-6 text-[#1B8E5A]" />,
            },
            {
              key: "absherBusiness",
              label: "أبشر أعمال",
              icon: <User2 className="h-6 w-6 text-[#1B8E5A]" />,
            },
            {
              key: "najiz",
              label: "ناجز",
              icon: <Scale className="h-6 w-6 text-[#6B4FA0]" />,
            },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => handlePlatformSelect(item.key as Platform)}
              aria-label={`اختيار منصة ${item.label} للتفويض`}
              className={cn(
                "flex h-28 flex-col items-center justify-center rounded-2xl border border-[var(--border)] bg-white text-sm font-semibold text-slate-800 shadow-sm transition hover:shadow",
                selectedPlatform === (item.key as Platform) && "border-[#1B8E5A] bg-[#1B8E5A]/10 text-[#1B8E5A]"
              )}
            >
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-slate-50">
                {item.icon}
              </div>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

<button
        onClick={startNewDelegation}
        className="flex w-full items-center justify-between rounded-2xl bg-gradient-to-r from-[#1B8E5A] to-[#156B45] px-4 py-3 text-white shadow-lg"
      >
        <div className="flex items-center gap-2 text-lg font-semibold">
          <Plus className="h-5 w-5" />
          <span>{language === "ar" ? "إنشاء تفويض جديد" : "Create new delegation"}</span>
        </div>
        <ArrowLeft className="h-5 w-5" />
      </button>

      {quickStats}

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">
          {language === "ar" ? "آخر التفويضات" : "Latest delegations"}
        </h2>
        <button
          onClick={() => router.push("/grantor")}
          className="text-sm font-semibold text-[#1B8E5A] hover:underline"
        >
          {language === "ar" ? "عرض الكل" : "View all"}
        </button>
      </div>

      <div className="space-y-3">
        {latestDelegations.map((delegation) => (
          <div key={delegation.id} className="rounded-2xl border border-[var(--border)] bg-white p-3 shadow-sm">
            <div className="flex items-center justify-between">
              <StatusPill status={delegation.status} language={language} />
              <span className="flex items-center gap-1 rounded-full bg-[#1B8E5A]/10 px-3 py-1 text-xs font-semibold text-[#1B8E5A]">
                <ShieldCheck className="h-4 w-4" /> {delegation.platform === "absher" ? "أبشر" : "ناجز"}
              </span>
            </div>
            <p className="mt-2 text-base font-bold text-slate-900">
              {language === "ar" ? delegation.serviceNameAr : delegation.serviceNameEn}
            </p>
            <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
              <AlarmClockCheck className="h-4 w-4 text-amber-500" />
              <span>{formatDate(delegation.startAt)}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-[13px] font-semibold">
              <span className="rounded-full border border-[var(--border)] bg-slate-50 px-3 py-1 text-slate-700">
                {language === "ar" ? "استلام شخصي" : "In-person pickup"}
              </span>
              <span className="rounded-full border border-[var(--border)] bg-blue-50 px-3 py-1 text-blue-700">
                {delegation.isDigitalService
                  ? language === "ar"
                    ? "خدمة إلكترونية"
                    : "Digital service"
                  : language === "ar"
                  ? "خدمة حضورياً"
                  : "In-person"}
              </span>
            </div>
          </div>
        ))}
        {latestDelegations.length === 0 && (
          <div className="flex items-center gap-2 rounded-2xl border border-dashed border-[var(--border)] bg-white px-4 py-4 text-sm text-slate-600">
            <Loader2 className="h-4 w-4 animate-spin text-[#1B8E5A]" />
            {language === "ar" ? "لا توجد تفويضات بعد" : "No delegations yet"}
          </div>
        )}
      </div>

      <FlowCard
        step={step}
        language={language}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filteredServices={filteredServices}
        selectedService={selectedService}
        onSelectService={(service) => {
      setSelectedService(service);
      setStep("duration");
      if (service.defaultDuration) setDurationType(service.defaultDuration);
    }}
    durationType={durationType}
        setDurationType={setDurationType}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={autoEndDate}
        setCustomEndDate={setCustomEndDate}
        delegateName={delegateName}
        setDelegateName={setDelegateName}
        delegateId={delegateId}
        setDelegateId={setDelegateId}
        delegatePhone={delegatePhone}
        setDelegatePhone={setDelegatePhone}
        phoneError={phoneError}
        setPhoneError={setPhoneError}
        onReview={() => setStep("review")}
        onDelegate={() => setStep("delegate")}
        onConfirm={handleConfirm}
        computedEndDate={autoEndDate}
        startDateObj={startDateObj}
        setStep={setStep}
        flowRef={flowRef}
        normalizeDigits={normalizeDigits}
      />

      {success && (
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <Check className="h-5 w-5" />
          <div>
            <p className="font-semibold">{t("createSuccess", language)}</p>
            <p className="text-xs">ID: {success}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function HeroStat({
  label,
  value,
  variant = "strong",
}: {
  label: string;
  value: number;
  variant?: "strong" | "soft";
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/15 bg-white/10 px-3 py-3 text-white shadow-inner",
        variant === "soft" && "bg-white/5"
      )}
    >
      <p className="text-xs opacity-90">{label}</p>
      <p className="text-2xl font-bold leading-tight">{value}</p>
    </div>
  );
}

function MiniStat({
  icon,
  title,
  value,
  dotClass,
}: {
  icon: React.ReactNode;
  title: string;
  value: number;
  dotClass: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-white px-3 py-3 shadow-sm">
      <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50">
        {icon}
        <span className={cn("absolute -bottom-1 -right-1 h-2.5 w-2.5 rounded-full", dotClass)} />
      </div>
      <div>
        <p className="text-sm text-slate-500">{title}</p>
        <p className="text-xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}

function StatusPill({
  status,
  language,
}: {
  status: "pending" | "active" | "completed" | "rejected" | "expired";
  language: "ar" | "en";
}) {
  if (status === "rejected" || status === "expired") {
    return (
      <span className="flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
        <Clock3 className="h-4 w-4" />{" "}
        {status === "rejected"
          ? language === "ar"
            ? "مرفوض"
            : "Rejected"
          : language === "ar"
          ? "منتهي"
          : "Expired"}
      </span>
    );
  }

  const pill = statusPills[status === "completed" ? "completed" : status === "active" ? "active" : "pending"];
  const label =
    status === "active"
      ? language === "ar"
        ? "نشط"
        : "Active"
      : status === "completed"
      ? language === "ar"
        ? "مكتمل"
        : "Completed"
      : language === "ar"
      ? "قيد الانتظار"
      : "Pending";

  return (
    <span
      className={cn(
        "flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold",
        pill.bg,
        pill.text,
        pill.border
      )}
    >
      <Clock3 className="h-4 w-4" />
      {label}
    </span>
  );
}

function FlowCard({
  step,
  language,
  searchTerm,
  setSearchTerm,
  filteredServices,
  selectedService,
  onSelectService,
  durationType,
  setDurationType,
  startDate,
  setStartDate,
  endDate,
  setCustomEndDate,
  delegateName,
  setDelegateName,
  delegateId,
  setDelegateId,
  delegatePhone,
  setDelegatePhone,
  phoneError,
  setPhoneError,
  onReview,
  onDelegate,
  onConfirm,
  computedEndDate,
  startDateObj,
  setStep,
  flowRef,
  normalizeDigits,
}: {
  step: Step;
  language: "ar" | "en";
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  filteredServices: ServiceOption[];
  selectedService: ServiceOption | null;
  onSelectService: (s: ServiceOption) => void;
  durationType: DurationType;
  setDurationType: (v: DurationType) => void;
  startDate: string;
  setStartDate: (v: string) => void;
  endDate: string;
  setCustomEndDate: (v: string) => void;
  delegateName: string;
  setDelegateName: (v: string) => void;
  delegateId: string;
  setDelegateId: (v: string) => void;
  delegatePhone: string;
  setDelegatePhone: (v: string) => void;
  phoneError: string;
  setPhoneError: (v: string) => void;
  onReview: () => void;
  onDelegate: () => void;
  onConfirm: () => void;
  computedEndDate: string;
  startDateObj: Date;
  setStep: (step: Step) => void;
  flowRef: React.RefObject<HTMLDivElement | null>;
  normalizeDigits: (v: string) => string;
}) {
  return (
    <div ref={flowRef} className="card space-y-4 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1B8E5A]/10 text-[#1B8E5A]">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <span>{language === "ar" ? "مسار إنشاء تفويض" : "Delegation flow"}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          {steps.map((s, idx) => (
            <div
              key={s}
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full border text-xs font-semibold",
                step === s ? "border-[#1B8E5A] text-[#1B8E5A]" : "border-[var(--border)] text-slate-400"
              )}
            >
              {idx + 1}
            </div>
          ))}
        </div>
      </div>

      {step === "service" && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-white px-3 py-3 shadow-sm">
            <Search className="h-5 w-5 text-[#1B8E5A]" />
            <input
              className="border-0 p-0 shadow-none focus:ring-0"
              placeholder={t("searchPlaceholder", language)}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 gap-2">
            {filteredServices.map((service) => {
              const isSelected = selectedService?.id === service.id;
              return (
                <button
                  key={service.id}
                  onClick={() => onSelectService(service)}
                  className={cn(
                    "flex items-center justify-between rounded-2xl border px-3 py-3 text-left shadow-sm transition",
                    isSelected
                      ? "border-[#1B8E5A] bg-[#1B8E5A]/10"
                      : "border-[var(--border)] bg-white"
                  )}
                >
                  <div>
                    <p className="text-xs text-slate-500">
                      {service.platform === "absher" ? t("platformAbsher", language) : t("platformNajiz", language)}
                    </p>
                    <p className="text-base font-semibold text-slate-900">
                      {language === "ar" ? service.nameAr : service.nameEn}
                    </p>
                    <p className="text-xs text-slate-500">
                      {service.isDigital ? t("digitalService", language) : language === "ar" ? "حضورياً" : "In person"}
                    </p>
                  </div>
                  <ShieldCheck className="h-5 w-5 text-[#1B8E5A]" />
                </button>
              );
            })}
          </div>
          <button className="btn-primary" onClick={onDelegate}>
            {language === "ar" ? "التالي" : "Next"}
          </button>
        </div>
      )}

      {step === "duration" && (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-slate-800">{t("durationSelectionTitle", language)}</p>
          <div className="grid grid-cols-3 gap-2">
            {([
              { label: t("duration24h", language), value: "24h" },
              { label: t("duration7d", language), value: "7d" },
              { label: t("durationCustom", language), value: "custom" },
            ] as const).map((option) => (
              <button
                key={option.value}
                onClick={() => setDurationType(option.value)}
                className={cn(
                  "rounded-2xl border px-3 py-3 text-sm font-semibold shadow-sm",
                  durationType === option.value
                    ? "border-[#1B8E5A] bg-[#1B8E5A]/10 text-[#1B8E5A]"
                    : "border-[var(--border)] bg-white text-slate-700"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
          {durationType === "custom" && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="mb-1 text-xs font-semibold text-slate-600">{t("startDate", language)}</p>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="bg-white" />
              </div>
              <div>
                <p className="mb-1 text-xs font-semibold text-slate-600">{t("endDate", language)}</p>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="bg-white"
                />
              </div>
            </div>
          )}
          <button className="btn-primary" onClick={onDelegate}>
            {language === "ar" ? "التالي" : "Next"}
          </button>
        </div>
      )}

      {step === "delegate" && (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-slate-800">{t("delegateInfoTitle", language)}</p>
          <div className="grid grid-cols-1 gap-3">
            <div className="rounded-xl border border-[var(--border)] bg-white px-3 py-3">
              <div className="flex items-center gap-2">
                <User2 className="h-4 w-4 text-[#1B8E5A]" />
                <input
                  value={delegateName}
                  onChange={(e) => setDelegateName(e.target.value)}
                  placeholder={language === "ar" ? "محمد أحمد" : "Mohammed"}
                  className="border-0 p-0 shadow-none focus:ring-0"
                />
              </div>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-white px-3 py-3">
              <div className="flex items-center gap-2">
                <User2 className="h-4 w-4 text-[#1B8E5A]" />
                <input
                  value={delegateId}
                  onChange={(e) => setDelegateId(normalizeDigits(e.target.value))}
                  placeholder={language === "ar" ? "1234567890" : "+9665xxxxxxx"}
                  className="border-0 p-0 shadow-none focus:ring-0"
                  inputMode="numeric"
                />
              </div>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-white px-3 py-3">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#1B8E5A]" />
                <input
                  value={delegatePhone}
                  onChange={(e) => {
                    const v = normalizeDigits(e.target.value);
                    setDelegatePhone(v);
                    const valid = /^05\d{8}$/.test(v);
                    setPhoneError(valid || v.length === 0 ? "" : "الرجاء إدخال رقم جوال صحيح بصيغة 05xxxxxxxx");
                  }}
                  placeholder="05xxxxxxxx"
                  className="border-0 p-0 shadow-none focus:ring-0"
                  inputMode="numeric"
                />
              </div>
              {phoneError && <p className="mt-1 text-xs text-red-600">{phoneError}</p>}
            </div>
          </div>
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={() => setStep("duration")}
              className="flex items-center gap-2 rounded-xl border border-[var(--border)] px-3 py-3 text-sm font-semibold text-slate-700"
            >
              <ArrowLeft className="h-4 w-4" />
              {language === "ar" ? "السابق" : "Back"}
            </button>
            <button
              className="btn-primary"
              onClick={() => {
                const valid = /^05\d{8}$/.test(delegatePhone);
                if (!valid) {
                  setPhoneError("الرجاء إدخال رقم جوال صحيح بصيغة 05xxxxxxxx");
                  return;
                }
                setPhoneError("");
                onReview();
              }}
              disabled={delegateId.length !== 10 || !delegateName || !delegatePhone}
            >
              {language === "ar" ? "مراجعة" : "Review"}
            </button>
          </div>
        </div>
      )}
{step === "review" && selectedService && (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-slate-800">{t("reviewTitle", language)}</p>
          <div className="rounded-xl border border-[var(--border)] bg-slate-50 px-3 py-3">
            <p className="text-xs text-slate-500">{platformLabel(selectedService.platform, language)}</p>
            <p className="text-base font-semibold text-slate-900">
              {language === "ar" ? selectedService.nameAr : selectedService.nameEn}
            </p>
            <p className="text-xs text-slate-500">
              {selectedService.isDigital ? t("digitalService", language) : language === "ar" ? "حضورياً" : "In person"}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl border border-[var(--border)] bg-white px-3 py-3">
              <p className="text-xs text-slate-500">{t("delegateName", language)}</p>
              <p className="font-semibold text-slate-800">{delegateName}</p>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-white px-3 py-3">
              <p className="text-xs text-slate-500">{t("delegateId", language)}</p>
              <p className="font-semibold text-slate-800">{delegateId}</p>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-white px-3 py-3 col-span-2">
              <p className="text-xs text-slate-500">{language === "ar" ? "رقم جوال المفوَّض" : "Delegate phone"}</p>
              <p className="font-semibold text-slate-800">{delegatePhone}</p>
            </div>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-3 text-sm text-slate-700">
            <div className="flex items-center gap-2">
              <Clock3 className="h-4 w-4 text-[#1B8E5A]" />
              <span>
                {formatDate(startDateObj.toISOString())} - {formatDate(new Date(computedEndDate).toISOString())}
              </span>
            </div>
            <span className="rounded-full bg-[#1B8E5A]/10 px-3 py-1 text-xs font-semibold text-[#1B8E5A]">
              {durationLabel(durationType, language)}
            </span>
          </div>
          <button className="btn-primary" onClick={onConfirm}>
            {t("confirmDelegation", language)}
          </button>
        </div>
      )}
    </div>
  );
}
