"use client";

import { services } from "@/data/services";
import { t } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useAssistantStore } from "@/store/assistant";
import { useDelegationsStore } from "@/store/delegations";
import { useSettingsStore } from "@/store/settings";
import {
  BadgeCheck,
  CheckCircle2,
  Headphones,
  Mic,
  Send,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
}

const suggestionChips = [
  "تفويض استلام رخصة القيادة",
  "تفويض خدمة في ناجز",
  "تفويض لمدة 24 ساعة",
];

const detectIntent = (text: string) => {
  const lower = text.toLowerCase();
  const hasArabic = /[\u0600-\u06FF]/.test(text);
  const normalized = hasArabic ? text : lower;

  let serviceId: string | undefined;
  let platform: "absher" | "najiz" | undefined;
  let durationType: "24h" | "7d" | "custom" | undefined;

  if (normalized.includes("رخصة")) {
    serviceId = "drv-license";
    platform = "absher";
  }
  if (normalized.includes("ناجز")) {
    platform = "najiz";
    serviceId = serviceId ?? "document-drop";
  }
  if (normalized.includes("24") || normalized.includes("ساعة")) {
    durationType = "24h";
  }
  if (normalized.includes("7") || normalized.includes("أسبوع")) {
    durationType = "7d";
  }

  return { serviceId, platform, durationType };
};

const AiAssistantModal = () => {
  const { isOpen, close } = useAssistantStore();
  const { createDelegation } = useDelegationsStore();
  const language = useSettingsStore((state) => state.language);

  const introText =
    language === "ar"
      ? "أهلاً! أخبرني عن خدمة التفويض المطلوبة وسأجهّزها لك."
      : "Hi! Tell me which delegation you need and I will draft it for you.";

  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", text: introText },
  ]);
  const [input, setInput] = useState("");
  const [delegateName, setDelegateName] = useState("");
  const [delegateId, setDelegateId] = useState("");
  const [delegatePhone] = useState("0550000000");
  const [durationType, setDurationType] = useState<"24h" | "7d" | "custom">("24h");
  const [serviceId, setServiceId] = useState<string>("drv-license");
  const [platform, setPlatform] = useState<"absher" | "najiz">("absher");
  const [successId, setSuccessId] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMessages([{ role: "assistant", text: introText }]);
    }
  }, [language, isOpen, introText]);

  const serviceOptions = useMemo(() => services, []);

  const syncPlatformWithService = (id: string) => {
    const found = services.find((srv) => srv.id === id);
    if (found) {
      setPlatform(found.platform);
      if (found.defaultDuration) setDurationType(found.defaultDuration);
    }
  };

  const handleClose = () => {
    setSuccessId(null);
    setDelegateName("");
    setDelegateId("");
    setInput("");
    setMessages([{ role: "assistant", text: introText }]);
    close();
  };

  const pushAssistantMessage = (text: string) =>
    setMessages((prev) => [...prev, { role: "assistant", text }]);

  const handleSend = (text?: string) => {
    const value = (text ?? input).trim();
    if (!value) return;
    setMessages((prev) => [...prev, { role: "user", text: value }]);
    setInput("");

    const hints = detectIntent(value);
    if (hints.serviceId) {
      setServiceId(hints.serviceId);
      syncPlatformWithService(hints.serviceId);
    }
    if (hints.platform) setPlatform(hints.platform);
    if (hints.durationType) setDurationType(hints.durationType);

    const needsDelegate = !delegateName || !delegateId;
    const parts = [
      language === "ar"
        ? "فهمت الطلب."
        : "Noted your request.",
    ];

    if (hints.serviceId) {
      const service = services.find((srv) => srv.id === hints.serviceId);
      if (service) {
        parts.push(
          language === "ar"
            ? `خدمة ${service.nameAr} في ${service.platform === "absher" ? "أبشر" : "ناجز"}.`
            : `${service.nameEn} on ${service.platform === "absher" ? "Absher" : "Najiz"}.`
        );
      }
    }
    if (hints.durationType) {
      parts.push(
        language === "ar"
          ? `المدة: ${hints.durationType === "24h" ? "24 ساعة" : hints.durationType === "7d" ? "7 أيام" : "مخصصة"}.`
          : `Duration set to ${hints.durationType === "24h" ? "24h" : hints.durationType === "7d" ? "7 days" : "custom"}.`
      );
    }

    if (needsDelegate) {
      parts.push(
        language === "ar"
          ? "زوّدني باسم وهوية المفوَّض"
          : "Share delegate name and ID/phone"
      );
    } else {
      parts.push(
        language === "ar" ? "جاهز لإنشاء التفويض." : "Ready to create the delegation."
      );
    }

    pushAssistantMessage(parts.join(" "));
  };

  const handleCreate = () => {
    const selectedService = services.find((srv) => srv.id === serviceId);
    if (!selectedService || !delegateId || !delegateName) return;

    const created = createDelegation({
      serviceId: selectedService.id,
      serviceNameAr: selectedService.nameAr,
      serviceNameEn: selectedService.nameEn,
      platform: selectedService.platform,
      isDigitalService: selectedService.isDigital,
      delegateId,
      delegateName,
      delegatePhone: delegatePhone || "0550000000",
      durationType,
    });
    setSuccessId(created.id);
    pushAssistantMessage(
      language === "ar"
        ? "تم إنشاء التفويض وإرساله للمفوَّض."
        : "Delegation created and sent to the delegate."
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 backdrop-blur-sm md:items-start md:justify-end">
      <div className="h-[92vh] w-full max-w-md rounded-t-3xl bg-white shadow-2xl md:mr-4 md:mt-6 md:h-[90vh] md:rounded-3xl">
        <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-r from-[#1B8E5A] to-[#156B45] text-white shadow">
              <Headphones className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">{t("aiAssistant", language)}</p>
              <p className="text-sm font-semibold text-slate-900">
                {language === "ar"
                  ? "تجربة صوتية وكتابية"
                  : "Voice + chat experience"}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="rounded-full border border-[var(--border)] p-2 text-slate-600"
            aria-label="Close assistant"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="relative mx-4 mt-4 rounded-2xl bg-gradient-to-r from-[#1B8E5A] to-[#156B45] p-4 text-white shadow">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
              <Mic className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold">{t("aiListening", language)}</p>
              <p className="text-xs text-white/80">
                {language === "ar"
                  ? "استمعنا لطلبك، يمكنك المتابعة كتابة أو بالصوت"
                  : "We heard your request, continue typing or keep speaking."}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto px-4 pb-1">
          {suggestionChips.map((chip) => (
            <button
              key={chip}
              onClick={() => handleSend(chip)}
              className="whitespace-nowrap rounded-full border border-[var(--border)] bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm"
            >
              {chip}
            </button>
          ))}
        </div>

        <div className="mt-3 h-56 overflow-y-auto px-4">
          {messages.map((message, idx) => (
            <div
              key={idx}
              className={cn(
                "mb-3 flex",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-3 py-2 text-sm",
                  message.role === "user"
                    ? "bg-[#1B8E5A] text-white"
                    : "bg-slate-100 text-slate-800"
                )}
              >
                {message.text}
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        <div className="mt-3 space-y-3 border-t border-[var(--border)] px-4 py-4">
          <div className="grid grid-cols-2 gap-2">
            <select
              value={serviceId}
              onChange={(e) => {
                setServiceId(e.target.value);
                syncPlatformWithService(e.target.value);
              }}
              className="rounded-xl border border-[var(--border)] bg-white px-3 py-3 text-sm"
            >
              {serviceOptions.map((service) => (
                <option key={service.id} value={service.id}>
                  {language === "ar" ? service.nameAr : service.nameEn}
                </option>
              ))}
            </select>
            <select
              value={durationType}
              onChange={(e) =>
                setDurationType(e.target.value as "24h" | "7d" | "custom")
              }
              className="rounded-xl border border-[var(--border)] bg-white px-3 py-3 text-sm"
            >
              <option value="24h">{t("duration24h", language)}</option>
              <option value="7d">{t("duration7d", language)}</option>
              <option value="custom">{t("durationCustom", language)}</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input
              placeholder={t("delegateName", language)}
              value={delegateName}
              onChange={(e) => setDelegateName(e.target.value)}
            />
            <input
              placeholder={t("delegateId", language)}
              value={delegateId}
              onChange={(e) => setDelegateId(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-slate-50 px-3 py-2 text-sm">
            <div>
              <p className="text-slate-700">{platform === "absher" ? t("platformAbsher", language) : t("platformNajiz", language)}</p>
              <p className="text-xs text-slate-500">
                {language === "ar" ? "اختيرت تلقائياً بناء على النص" : "Selected based on your request"}
              </p>
            </div>
            <BadgeCheck className="h-5 w-5 text-[#1B8E5A]" />
          </div>

          {successId && (
            <div className="flex items-start gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
              <CheckCircle2 className="mt-0.5 h-5 w-5" />
              <div>
                <p className="font-semibold">{t("createSuccess", language)}</p>
                <p className="text-xs text-emerald-700">ID: {successId}</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <input
              placeholder={t("aiPlaceholder", language)}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 rounded-xl border border-[var(--border)] bg-white px-3 py-3 text-sm"
            />
            <button
              onClick={() => handleSend()}
              className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1B8E5A] text-white shadow"
              aria-label="Send"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>

          <button
            onClick={handleCreate}
            disabled={!delegateId || !delegateName || !serviceId}
            className={cn(
              "btn-primary mt-1 flex items-center justify-center gap-2",
              (!delegateId || !delegateName || !serviceId) && "opacity-60"
            )}
          >
            <CheckCircle2 className="h-5 w-5" />
            {language === "ar" ? "إنشاء التفويض" : "Create delegation"}
          </button>

          <p className="text-[11px] text-slate-500">
            {/* Placeholder for real AI integration */}
            {language === "ar"
              ? "سيتم ربط المساعد بنماذج الذكاء الاصطناعي في الإنتاج."
              : "In production, this would connect to an AI backend for NLU."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AiAssistantModal;
