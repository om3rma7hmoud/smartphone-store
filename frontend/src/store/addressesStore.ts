import { create } from "zustand";
import {
  getAddresses,
  createAddress,
  updateAddress,
  setDefaultAddress,
  deleteAddress,
} from "../api/addresses.api";

import type { Address } from "../types";

import type {
  AddressPayload,
  UpdateAddressPayload,
} from "../api/addresses.api";

interface AddressesState {
  addresses: Address[];
  isLoading: boolean;

  fetchAddresses: () => Promise<void>;
  addAddress: (data: AddressPayload) => Promise<void>;
  editAddress: (id: string, data: UpdateAddressPayload) => Promise<void>;
  makeDefault: (id: string) => Promise<void>;
  removeAddress: (id: string) => Promise<void>;
}

export const useAddressesStore = create<AddressesState>((set) => ({
  addresses: [],
  isLoading: false,

  fetchAddresses: async () => {
    try {
      set({ isLoading: true });
      const addresses = await getAddresses();
      set({ addresses });
    } finally {
      set({ isLoading: false });
    }
  },

  addAddress: async (data) => {
    await createAddress(data);
    const addresses = await getAddresses();
    set({ addresses });
  },

  editAddress: async (id, data) => {
    await updateAddress(id, data);
    const addresses = await getAddresses();
    set({ addresses });
  },

  makeDefault: async (id) => {
    await setDefaultAddress(id);
    const addresses = await getAddresses();
    set({ addresses });
  },

  removeAddress: async (id) => {
    await deleteAddress(id);
    const addresses = await getAddresses();
    set({ addresses });
  },
}));
