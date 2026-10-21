import axiosClient from "./axiosClient";

export async function getCart() {
  const res = await axiosClient.get("/cart");
  return res.data.data;
}

export async function addToCart(variantId: string, quantity: number) {
  const res = await axiosClient.post("/cart", { variantId, quantity });
  return res.data.data;
}

export async function updateCartItem(id: string, quantity: number) {
  const res = await axiosClient.patch(`/cart/${id}`, { quantity });
  return res.data.data;
}

export async function removeFromCart(id: string) {
  await axiosClient.delete(`/cart/${id}`);
}

export async function clearCart() {
  await axiosClient.delete("/cart/clear");
}
