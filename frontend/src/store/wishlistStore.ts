import { create } from "zustand";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../api/wishlist.api";
import { toast } from "react-toastify";
import type { Product } from "../types";

interface WishlistItem {
  id: string;
  productId: string;
  product: Product;
}

interface WishlistState {
  items: WishlistItem[];
  isLoading: boolean;

  fetchWishlist: () => Promise<void>;
  addItem: (productId: string) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],
  isLoading: false,

  fetchWishlist: async () => {
    if (get().isLoading) return;
    set({ isLoading: true });
    try {
      const items = await getWishlist();
      set({ items });
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Could not load your wishlist.",
      );
    } finally {
      set({ isLoading: false });
    }
  },

  addItem: async (productId) => {
    try {
      await addToWishlist(productId);
      const items = await getWishlist();
      set({ items });
      toast.success(`Added to wishlist.`);
    } catch {
      toast.error("You must login to add items to your wishlist.");
    }
  },

  removeItem: async (productId) => {
    await removeFromWishlist(productId);
    set((state) => ({
      items: state.items.filter((i) => i.productId !== productId),
    }));
    toast.success("Removed from wishlist.");
  },
}));
