import { create } from "zustand";
import { getMyOrders, getOrderById } from "../api/orders.api";
import type { Order } from "../types";

interface OrdersState {
  orders: Order[];
  selectedOrder: Order | null;
  isLoading: boolean;
  isLoadingDetails: boolean;

  fetchOrders: () => Promise<void>;
  fetchOrderById: (id: string) => Promise<void>;
}

export const useOrdersStore = create<OrdersState>((set) => ({
  orders: [],
  selectedOrder: null,
  isLoading: false,
  isLoadingDetails: false,

  fetchOrders: async () => {
    try {
      set({ isLoading: true });

      const orders = await getMyOrders();

      set({ orders });
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchOrderById: async (id: string) => {
    try {
      set({
        isLoadingDetails: true,
        selectedOrder: null,
      });

      const order = await getOrderById(id);

      set({ selectedOrder: order });
    } catch (error) {
      console.error("Failed to fetch order:", error);
      throw error;
    } finally {
      set({ isLoadingDetails: false });
    }
  },
}));
