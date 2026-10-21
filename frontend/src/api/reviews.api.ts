import axiosClient from "./axiosClient";

export async function getProductReviews(productId: string) {
  const res = await axiosClient.get(`/reviews/${productId}`);
  return res.data.data;
}

export async function createReview(
  productId: string,
  rating: number,
  comment?: string,
) {
  const res = await axiosClient.post("/reviews", {
    productId,
    rating,
    comment,
  });
  return res.data.data;
}
