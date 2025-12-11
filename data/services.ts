import { DurationType } from "./seedDelegations";

export type Platform = "absher" | "absherBusiness" | "najiz";

export interface ServiceOption {
  id: string;
  platform: Platform;
  nameAr: string;
  nameEn: string;
  isDigital: boolean;
  defaultDuration?: DurationType;
}

export const services: ServiceOption[] = [
  {
    id: "drv-license",
    platform: "absher",
    nameAr: "استلام رخصة القيادة",
    nameEn: "Driving license pickup",
    isDigital: true,
    defaultDuration: "24h",
  },
  {
    id: "vehicle-auth",
    platform: "absher",
    nameAr: "تفويض مركبة",
    nameEn: "Vehicle delegation",
    isDigital: true,
    defaultDuration: "7d",
  },
  {
    id: "passport-delivery",
    platform: "absher",
    nameAr: "استلام جواز السفر",
    nameEn: "Passport delivery",
    isDigital: false,
  },
  {
    id: "court-rep",
    platform: "najiz",
    nameAr: "تمثيل في قضية",
    nameEn: "Court representation",
    isDigital: false,
    defaultDuration: "custom",
  },
  {
    id: "notary",
    platform: "najiz",
    nameAr: "توثيق وكالة",
    nameEn: "Notary authorization",
    isDigital: false,
  },
  {
    id: "document-drop",
    platform: "najiz",
    nameAr: "تسليم مستندات",
    nameEn: "Submit documents",
    isDigital: true,
    defaultDuration: "24h",
  },
  {
    id: "absherbiz-auth",
    platform: "absherBusiness",
    nameAr: "تفويض أعمال",
    nameEn: "Business delegation",
    isDigital: true,
    defaultDuration: "7d",
  },
  {
    id: "absherbiz-branches",
    platform: "absherBusiness",
    nameAr: "إدارة الفروع",
    nameEn: "Branch management",
    isDigital: true,
  },
];
