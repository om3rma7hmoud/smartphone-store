import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "react-toastify";

interface CompareState {
  productIds: string[];
  toggle: (productId: string) => void;
  clear: () => void;
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set) => ({
      productIds: [],

      toggle: (productId) => {
        set((state) => {
          if (state.productIds.includes(productId)) {
            return {
              productIds: state.productIds.filter((id) => id !== productId),
            };
          }
          if (state.productIds.length >= 3) {
            toast.error(
              "Compare list is full, You can compare up to 3 products at a time.",
            );
            return state;
          }
          toast.success(`Added to compare.`);
          return { productIds: [...state.productIds, productId] };
        });
      },

      clear: () => set({ productIds: [] }),
    }),
    {
      name: "compare-storage", // Name of localstorage key
    },
  ),
);
