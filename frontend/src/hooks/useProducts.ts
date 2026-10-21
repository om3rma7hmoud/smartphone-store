import { useEffect, useState } from "react";
import { getAllProducts, type ProductFilters } from "../api/products.api";
import type { Product } from "../types";

export function useProducts(filters?: ProductFilters) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getAllProducts(filters);
        setProducts(response.products);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch products",
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, [filters]);

  return { products, isLoading, error };
}
