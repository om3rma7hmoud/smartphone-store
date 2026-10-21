import axiosClient from "./axiosClient";

export async function getWishlist() {
  const res = await axiosClient.get("/wishlist");
  return res.data.data;
}

export async function addToWishlist(productId: string) {
  const res = await axiosClient.post("/wishlist", { productId });
  return res.data.data;
}

export async function removeFromWishlist(productId: string) {
  await axiosClient.delete(`/wishlist/${productId}`);
}
