import {
  CURRENT_GRANTOR_ID,
  Delegation,
  DelegationStatus,
  DelegateStatus,
  DurationType,
  seedDelegations,
} from "@/data/seedDelegations";
import { computeEndDate } from "@/lib/utils";
import { create } from "zustand";

export const DELEGATIONS_STORAGE_KEY = "absher-delegations";

export type CreateDelegationInput = {
  serviceId: string;
  serviceNameAr: string;
  serviceNameEn: string;
  platform: "absher" | "najiz" | "absherBusiness";
  isDigitalService: boolean;
  delegateId: string;
  delegateName: string;
  delegatePhone: string;
  durationType: DurationType;
  startAt?: string;
  endAt?: string;
};

export type DelegationsState = {
  delegations: Delegation[];
  hasHydrated: boolean;
  hydrate: () => void;
  createDelegation: (input: CreateDelegationInput) => Delegation;
  updateDelegation: (
    id: string,
    patch: Partial<Delegation> & { status?: DelegationStatus; delegateStatus?: DelegateStatus }
  ) => void;
  getGrantorDelegations: (grantorId?: string) => Delegation[];
  getDelegateDelegations: (delegateId?: string) => Delegation[];
};

const persistDelegations = (delegations: Delegation[]) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(DELEGATIONS_STORAGE_KEY, JSON.stringify(delegations));
};

export const useDelegationsStore = create<DelegationsState>((set, get) => ({
  delegations: seedDelegations,
  hasHydrated: false,
  hydrate: () => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem(DELEGATIONS_STORAGE_KEY);
    if (saved) {
      set({ delegations: JSON.parse(saved) as Delegation[], hasHydrated: true });
      return;
    }
    window.localStorage.setItem(DELEGATIONS_STORAGE_KEY, JSON.stringify(seedDelegations));
    set({ hasHydrated: true });
  },
  createDelegation: (input) => {
    const now = new Date();
    const startDate = input.startAt ? new Date(input.startAt) : now;
    const endDate = input.endAt
      ? new Date(input.endAt)
      : computeEndDate(startDate, input.durationType);

    const delegation: Delegation = {
      id: `del-${now.getTime()}`,
      platform: input.platform,
      serviceId: input.serviceId,
      serviceNameAr: input.serviceNameAr,
      serviceNameEn: input.serviceNameEn,
      isDigitalService: input.isDigitalService,
      grantorId: CURRENT_GRANTOR_ID,
      grantorName: "سعود العتيبي",
      delegateId: input.delegateId,
      delegateName: input.delegateName,
      delegatePhone: input.delegatePhone,
      delegateAcceptedTerms: false,
      durationType: input.durationType,
      startAt: startDate.toISOString(),
      endAt: endDate.toISOString(),
      status: "pending",
      delegateStatus: "pending",
      delegateAcceptedAt: null,
      isArchivedForGrantor: false,
      isArchivedForDelegate: false,
      isDeletedForGrantor: false,
      isDeletedForDelegate: false,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    set((state) => {
      const delegations = [delegation, ...state.delegations];
      persistDelegations(delegations);
      return { delegations };
    });

    return delegation;
  },
  updateDelegation: (id, patch) => {
    set((state) => {
      const delegations = state.delegations.map((delegation) =>
        delegation.id === id
          ? {
              ...delegation,
              ...patch,
              updatedAt: new Date().toISOString(),
            }
          : delegation
      );
      persistDelegations(delegations);
      return { delegations };
    });
  },
  getGrantorDelegations: (grantorId = CURRENT_GRANTOR_ID) =>
    get().delegations.filter(
      (delegation) =>
        delegation.grantorId === grantorId && !delegation.isDeletedForGrantor
    ),
  getDelegateDelegations: (delegateId?: string) =>
    get().delegations.filter((delegation) => {
      if (delegation.isDeletedForDelegate || delegation.isArchivedForDelegate) return false;
      if (delegateId) return delegation.delegateId === delegateId;
      return true;
    }),
}));
