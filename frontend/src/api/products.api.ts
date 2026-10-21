import axiosClient from "./axiosClient";

export interface ProductFilters {
  brand?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  ram?: string;
  storage?: string;
  os?: string;
  search?: string;
  sort?: string;
}

export const getAllProducts = async (filters?: ProductFilters) => {
  const res = await axiosClient.get("/products", { params: filters });

  return res.data.data;
};

export const getProductBySlug = async (slug: string) => {
  const res = await axiosClient.get(`/products/${slug}`);

  return res.data.data;
};

export const getProductById = async (id: string) => {
  const res = await axiosClient.get(`/products/id/${id}`);

  return res.data.data;
};
