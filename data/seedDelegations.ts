export type DelegationStatus =
  | "pending"
  | "active"
  | "completed"
  | "rejected"
  | "expired";
export type DelegateStatus = "pending" | "accepted" | "rejected";
export type DurationType = "24h" | "7d" | "custom";

export interface Delegation {
  id: string;
  platform: "absher" | "najiz" | "absherBusiness";
  serviceId: string;
  serviceNameAr: string;
  serviceNameEn: string;
  isDigitalService: boolean;

  grantorId: string;
  grantorName: string;

  delegateId: string;
  delegateName: string;
  delegatePhone: string;
  delegateAcceptedTerms: boolean;

  durationType: DurationType;
  startAt: string;
  endAt: string;

  status: DelegationStatus;
  delegateStatus: DelegateStatus;
  delegateAcceptedAt?: string | null;

  isArchivedForGrantor: boolean;
  isArchivedForDelegate: boolean;
  isDeletedForGrantor: boolean;
  isDeletedForDelegate: boolean;

  createdAt: string;
  updatedAt: string;
}

export const CURRENT_GRANTOR_ID = "user-grantor-1";
export const CURRENT_DELEGATE_ID = "user-delegate-1";

export const seedDelegations: Delegation[] = [
  {
    id: "del-1001",
    platform: "absher",
    serviceId: "drv-license",
    serviceNameAr: "استلام رخصة القيادة",
    serviceNameEn: "Driving license pickup",
    isDigitalService: true,
    grantorId: CURRENT_GRANTOR_ID,
    grantorName: "سعود العتيبي",
    delegateId: CURRENT_DELEGATE_ID,
    delegateName: "محمد القحطاني",
    delegatePhone: "0551234567",
    delegateAcceptedTerms: true,
    durationType: "24h",
    startAt: "2024-06-15T09:00:00Z",
    endAt: "2024-06-16T09:00:00Z",
    status: "active",
    delegateStatus: "accepted",
    delegateAcceptedAt: "2024-06-15T09:05:00Z",
    isArchivedForGrantor: false,
    isArchivedForDelegate: false,
    isDeletedForGrantor: false,
    isDeletedForDelegate: false,
    createdAt: "2024-06-15T08:55:00Z",
    updatedAt: "2024-06-15T09:05:00Z",
  },
  {
    id: "del-1002",
    platform: "najiz",
    serviceId: "court-rep",
    serviceNameAr: "تمثيل في قضية",
    serviceNameEn: "Case representation",
    isDigitalService: false,
    grantorId: CURRENT_GRANTOR_ID,
    grantorName: "سعود العتيبي",
    delegateId: CURRENT_DELEGATE_ID,
    delegateName: "ريم التركي",
    delegatePhone: "0559876543",
    delegateAcceptedTerms: false,
    durationType: "7d",
    startAt: "2024-07-01T10:00:00Z",
    endAt: "2024-07-08T10:00:00Z",
    status: "pending",
    delegateStatus: "pending",
    delegateAcceptedAt: null,
    isArchivedForGrantor: false,
    isArchivedForDelegate: false,
    isDeletedForGrantor: false,
    isDeletedForDelegate: false,
    createdAt: "2024-07-01T09:45:00Z",
    updatedAt: "2024-07-01T09:45:00Z",
  },
  {
    id: "del-1003",
    platform: "absher",
    serviceId: "vehicle-auth",
    serviceNameAr: "تفويض مركبة لمدة 7 أيام",
    serviceNameEn: "Vehicle delegation (7 days)",
    isDigitalService: true,
    grantorId: CURRENT_GRANTOR_ID,
    grantorName: "سعود العتيبي",
    delegateId: CURRENT_DELEGATE_ID,
    delegateName: "محمد القحطاني",
    delegatePhone: "0557654321",
    delegateAcceptedTerms: true,
    durationType: "7d",
    startAt: "2024-05-20T12:00:00Z",
    endAt: "2024-05-27T12:00:00Z",
    status: "completed",
    delegateStatus: "accepted",
    delegateAcceptedAt: "2024-05-20T12:10:00Z",
    isArchivedForGrantor: false,
    isArchivedForDelegate: false,
    isDeletedForGrantor: false,
    isDeletedForDelegate: false,
    createdAt: "2024-05-20T11:50:00Z",
    updatedAt: "2024-05-27T12:10:00Z",
  },
  {
    id: "del-1004",
    platform: "najiz",
    serviceId: "notary",
    serviceNameAr: "تفويض توثيق",
    serviceNameEn: "Notary delegation",
    isDigitalService: false,
    grantorId: CURRENT_GRANTOR_ID,
    grantorName: "سعود العتيبي",
    delegateId: CURRENT_DELEGATE_ID,
    delegateName: "سارة المطيري",
    delegatePhone: "0552223334",
    delegateAcceptedTerms: false,
    durationType: "custom",
    startAt: "2024-07-10T07:00:00Z",
    endAt: "2024-07-20T07:00:00Z",
    status: "rejected",
    delegateStatus: "rejected",
    delegateAcceptedAt: null,
    isArchivedForGrantor: false,
    isArchivedForDelegate: true,
    isDeletedForGrantor: false,
    isDeletedForDelegate: false,
    createdAt: "2024-07-10T06:45:00Z",
    updatedAt: "2024-07-12T08:00:00Z",
  },
  {
    id: "del-1005",
    platform: "absher",
    serviceId: "id-renew",
    serviceNameAr: "تفويض تجديد هوية",
    serviceNameEn: "ID renewal delegation",
    isDigitalService: true,
    grantorId: CURRENT_GRANTOR_ID,
    grantorName: "سعود العتيبي",
    delegateId: CURRENT_DELEGATE_ID,
    delegateName: "أحمد العسيري",
    delegatePhone: "0553334445",
    delegateAcceptedTerms: false,
    durationType: "24h",
    startAt: "2024-07-15T08:00:00Z",
    endAt: "2024-07-16T08:00:00Z",
    status: "expired",
    delegateStatus: "pending",
    delegateAcceptedAt: null,
    isArchivedForGrantor: false,
    isArchivedForDelegate: false,
    isDeletedForGrantor: false,
    isDeletedForDelegate: false,
    createdAt: "2024-07-15T07:45:00Z",
    updatedAt: "2024-07-16T08:05:00Z",
  },
];
