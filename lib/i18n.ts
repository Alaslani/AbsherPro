export type Language = "ar" | "en";

export type TranslationKey =
  | "appTitle"
  | "home"
  | "grantor"
  | "delegate"
  | "analytics"
  | "accessibility"
  | "searchPlaceholder"
  | "startDelegation"
  | "whyDelegationTitle"
  | "whyDelegationBody"
  | "serviceSelectionTitle"
  | "durationSelectionTitle"
  | "delegateInfoTitle"
  | "reviewTitle"
  | "confirmDelegation"
  | "delegateName"
  | "delegateId"
  | "duration24h"
  | "duration7d"
  | "durationCustom"
  | "startDate"
  | "endDate"
  | "platformAbsher"
  | "platformNajiz"
  | "digitalService"
  | "statusPending"
  | "statusActive"
  | "statusCompleted"
  | "statusRejected"
  | "statusExpired"
  | "grantorDelegations"
  | "delegateDelegations"
  | "filters"
  | "archive"
  | "delete"
  | "accept"
  | "reject"
  | "termsLabel"
  | "aiAssistant"
  | "aiIntro"
  | "aiTagline"
  | "aiPlaceholder"
  | "aiListening"
  | "aiListeningSub"
  | "aiChipLicense"
  | "aiChipNajiz"
  | "aiChip24h"
  | "aiPlatformAuto"
  | "aiBackendNote"
  | "analyticsTitle"
  | "totalDelegations"
  | "accepted"
  | "rejectedLabel"
  | "durationDistribution"
  | "platformUsage"
  | "accessibilityTitle"
  | "largeText"
  | "highContrast"
  | "bigButtons"
  | "trustedAgentTitle"
  | "trustedAgentDesc"
  | "trustedAgentStart"
  | "trustedAgentConfirm"
  | "trustedAgentBack"
  | "trustedAgentDone"
  | "trustedAgentLocationTitle"
  | "trustedAgentLocationBtn"
  | "trustedAgentLocationSaved"
  | "trustedAgentCost"
  | "delegateNeeded"
  | "serviceNeeded"
  | "durationNeeded"
  | "createSuccess"
  | "viewDetails"
  | "pendingTerms"
  | "termsHeading"
  | "termsBullet1"
  | "termsBullet2"
  | "termsBullet3"
  | "termsNotice";

const dictionary: Record<TranslationKey, { ar: string; en: string }> = {
  appTitle: { ar: "أبشر برو للتفويض", en: "Absher Delegation Pro" },
  home: { ar: "الرئيسية", en: "Home" },
  grantor: { ar: "تفويضاتي", en: "Grantor" },
  delegate: { ar: "كمفوَّض", en: "Delegate" },
  analytics: { ar: "تحليلات", en: "Analytics" },
  accessibility: { ar: "إمكانية الوصول", en: "Accessibility" },
  searchPlaceholder: {
    ar: "ابحث عن الخدمة أو الجهة...",
    en: "Search for a service or entity...",
  },
  startDelegation: { ar: "بدء تفويض", en: "Start Delegation" },
  whyDelegationTitle: { ar: "لماذا التفويض؟", en: "Why delegation?" },
  whyDelegationBody: {
    ar: "سهّل معاملاتك الحكومية، ومنح صلاحيات محددة بزمن ومهام واضحة.",
    en: "Delegate securely with time-bound permissions and clear tasks.",
  },
  serviceSelectionTitle: { ar: "اختيار الخدمة", en: "Service selection" },
  durationSelectionTitle: { ar: "مدة التفويض", en: "Duration" },
  delegateInfoTitle: { ar: "بيانات المفوَّض", en: "Delegate info" },
  reviewTitle: { ar: "مراجعة", en: "Review" },
  confirmDelegation: { ar: "تأكيد التفويض", en: "Confirm delegation" },
  delegateName: { ar: "اسم المفوَّض", en: "Delegate name" },
  delegateId: { ar: "هوية/جوال المفوَّض", en: "Delegate ID/phone" },
  duration24h: { ar: "24 ساعة", en: "24 hours" },
  duration7d: { ar: "7 أيام", en: "7 days" },
  durationCustom: { ar: "تاريخ مخصص", en: "Custom dates" },
  startDate: { ar: "تاريخ البداية", en: "Start date" },
  endDate: { ar: "تاريخ النهاية", en: "End date" },
  platformAbsher: { ar: "أبشر", en: "Absher" },
  platformNajiz: { ar: "ناجز", en: "Najiz" },
  digitalService: { ar: "خدمة رقمية", en: "Digital service" },
  statusPending: { ar: "قيد الموافقة", en: "Pending" },
  statusActive: { ar: "نشط", en: "Active" },
  statusCompleted: { ar: "مكتمل", en: "Completed" },
  statusRejected: { ar: "مرفوض", en: "Rejected" },
  statusExpired: { ar: "منتهي", en: "Expired" },
  grantorDelegations: { ar: "تفويضاتي", en: "My Delegations" },
  delegateDelegations: { ar: "تفويضاتي كمفوَّض", en: "Delegate view" },
  filters: { ar: "التصفيات", en: "Filters" },
  archive: { ar: "أرشفة", en: "Archive" },
  delete: { ar: "حذف", en: "Delete" },
  accept: { ar: "قبول", en: "Accept" },
  reject: { ar: "رفض", en: "Reject" },
  termsLabel: {
    ar: "أوافق على الشروط والأحكام الخاصة بهذا التفويض",
    en: "I agree to the terms and conditions for this delegation",
  },
  aiAssistant: { ar: "مساعد ذكي", en: "AI Assistant" },
  aiIntro: {
    ar: "أهلاً! أخبرني عن خدمة التفويض المطلوبة وسأجهزها لك.",
    en: "Hi! Tell me which delegation you need and I'll set it up for you.",
  },
  aiTagline: { ar: "تجربة صوتية وكتابية", en: "Voice + chat experience" },
  aiPlaceholder: { ar: "اطلب التفويض صوتيًا أو كتابيًا...", en: "Ask the assistant about a delegation..." },
  aiListening: { ar: "يستمع الآن...", en: "Listening..." },
  aiListeningSub: {
    ar: "استمعنا لطلبك، يمكنك المتابعة كتابة أو بالصوت.",
    en: "We heard your request; keep typing or continue speaking.",
  },
  aiChipLicense: { ar: "تفويض استلام رخصة القيادة", en: "Driving license pickup" },
  aiChipNajiz: { ar: "تفويض خدمة في ناجز", en: "Delegation for Najiz service" },
  aiChip24h: { ar: "تفويض لمدة 24 ساعة", en: "24-hour delegation" },
  aiPlatformAuto: {
    ar: "اختيرت تلقائياً بناء على النص",
    en: "Auto-selected from your request",
  },
  aiBackendNote: {
    ar: "سيتم ربط المساعد بنماذج الذكاء الاصطناعي في الإنتاج.",
    en: "The assistant will connect to an AI backend in production.",
  },
  analyticsTitle: { ar: "لوحة التحليلات", en: "Analytics" },
  totalDelegations: { ar: "إجمالي التفويضات", en: "Total delegations" },
  accepted: { ar: "مقبول", en: "Accepted" },
  rejectedLabel: { ar: "مرفوض", en: "Rejected" },
  durationDistribution: { ar: "توزيع المدد", en: "Duration mix" },
  platformUsage: { ar: "منصة الاستخدام", en: "Platform mix" },
  accessibilityTitle: { ar: "تحسين الوصول", en: "Improve accessibility" },
  largeText: { ar: "تكبير النص", en: "Large text" },
  highContrast: { ar: "تباين عالٍ", en: "High contrast" },
  bigButtons: { ar: "أزرار أكبر", en: "Bigger buttons" },
  trustedAgentTitle: { ar: "طلب مندوب موثّق", en: "Request a verified agent" },
  trustedAgentDesc: {
    ar: "سيتم إرسال مندوب موثّق لمساعدتك في منزلك.",
    en: "We’ll dispatch a verified agent to assist you at home.",
  },
  trustedAgentStart: { ar: "طلب مندوب موثّق", en: "Request agent" },
  trustedAgentConfirm: { ar: "تأكيد الطلب", en: "Confirm request" },
  trustedAgentBack: { ar: "رجوع", en: "Back" },
  trustedAgentDone: { ar: "تم إرسال الطلب وسيتواصل معك المندوب قريباً.", en: "Request sent. An agent will contact you shortly." },
  trustedAgentLocationTitle: {
    ar: "شارك موقعك لإرسال أقرب مندوب.",
    en: "Share your location so we can send the nearest agent.",
  },
  trustedAgentLocationBtn: { ar: "استخدام موقعي الحالي", en: "Use my current location" },
  trustedAgentLocationSaved: { ar: "تم حفظ موقعك الحالي.", en: "Your current location has been captured." },
  trustedAgentCost: { ar: "تكلفة الخدمة: ٢٠٠ ﷼", en: "Service cost: 200 ﷼" },
  delegateNeeded: { ar: "أضف بيانات المفوَّض لإكمال الطلب", en: "Add delegate details to proceed." },
  serviceNeeded: { ar: "اختر الخدمة المطلوبة", en: "Choose a service." },
  durationNeeded: { ar: "حدد مدة التفويض", en: "Select a duration." },
  createSuccess: { ar: "تم إنشاء التفويض بنجاح", en: "Delegation created successfully" },
  viewDetails: { ar: "عرض التفاصيل", en: "View details" },
  pendingTerms: { ar: "بانتظار قبول الشروط", en: "Awaiting terms acceptance" },
  termsHeading: { ar: "الشروط والأحكام", en: "Terms & Conditions" },
  termsBullet1: {
    ar: "الالتزام باستخدام بيانات التفويض للغرض المحدد فقط وأثناء المدة المصرّح بها.",
    en: "Use this delegation solely for the stated purpose within the authorized duration.",
  },
  termsBullet2: {
    ar: "حمل الهوية وإبرازها عند الطلب، مع الحفاظ على سرية أي مستندات أو صلاحيات تم منحها.",
    en: "Carry your ID, present it when requested, and keep all granted permissions confidential.",
  },
  termsBullet3: {
    ar: "لا يجوز تفويض طرف ثالث أو إجراء تعديلات دون موافقة المانح.",
    en: "Do not sub-delegate or modify this authorization without grantor consent.",
  },
  termsNotice: {
    ar: "بالمتابعة، أنت توافق على الشروط والأحكام الخاصة بهذا التفويض.",
    en: "By proceeding, you agree to the terms and conditions of this delegation.",
  },
};

export const t = (key: TranslationKey, language: Language): string => {
  const entry = dictionary[key];
  if (!entry) return key;
  return entry[language];
};
