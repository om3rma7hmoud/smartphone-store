import axiosClient from "./axiosClient";
import type { Order, PaymentMethod } from "../types";

interface CreateOrderPayload {
  addressId: string;
  paymentMethod: PaymentMethod;
}

export async function createOrder(data: CreateOrderPayload): Promise<Order> {
  const res = await axiosClient.post("/orders", data);
  return res.data.data;
}

export async function createCheckoutSession(orderId: string): Promise<string> {
  const res = await axiosClient.post(
    `/payments/orders/${orderId}/checkout-session`,
  );

  return res.data.data.checkoutUrl;
}

export async function getMyOrders(): Promise<Order[]> {
  const res = await axiosClient.get("/orders");
  return res.data.data;
}

export async function getOrderById(id: string): Promise<Order> {
  const res = await axiosClient.get(`/orders/${id}`);
  return res.data.data;
}
