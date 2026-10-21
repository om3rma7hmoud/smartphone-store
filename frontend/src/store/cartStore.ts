import { create } from "zustand";
import {
  addToCart,
  getCart,
  removeFromCart,
  updateCartItem,
} from "../api/cart.api";
import type { Product, ProductVariant } from "../types";

export interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  quantity: number;
  product: Product;
  variant: ProductVariant;
}

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  SHIPPING_FLAT: number;

  fetchCart: () => Promise<void>;
  addItem: (variantId: string, quantity: number) => Promise<void>;
  updateItem: (id: string, quantity: number) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  isLoading: false,
  SHIPPING_FLAT: 150,

  fetchCart: async () => {
    set({ isLoading: true });

    try {
      const items = await getCart();
      set({ items });
    } finally {
      set({ isLoading: false });
    }
  },

  addItem: async (variantId: string, quantity: number) => {
    await addToCart(variantId, quantity);

    const items = await getCart();
    set({ items });
  },

  updateItem: async (id: string, quantity: number) => {
    await updateCartItem(id, quantity);
    const items = await getCart();
    set({ items });
  },

  removeItem: async (id: string) => {
    await removeFromCart(id);
    set((state: CartState) => ({
      items: state.items.filter((i) => i.id !== id),
    }));
  },
  clearCart: () => set({ items: [] }),
}));
