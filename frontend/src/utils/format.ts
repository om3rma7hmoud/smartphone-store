import type { Product, ProductVariant } from "../types";

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatEGP(value: number): string {
  return `EGP ${value.toLocaleString("en-US")}`;
}

export function discountPercent(price: number, compareAt?: number): number {
  if (!compareAt || compareAt <= price) return 0;
  return Math.round(((compareAt - price) / compareAt) * 100);
}

export function cheapestVariant(product: Product): ProductVariant {
  return product.variants.reduce(
    (min, v) => (v.price < min.price ? v : min),
    product.variants[0],
  );
}

export function variantLabel(variant: ProductVariant): string {
  return [
    variant.color,
    variant.storage,
    variant.ram ? `${variant.ram} RAM` : null,
  ]
    .filter(Boolean)
    .join(" · ");
}

export function totalStock(product: Product): number {
  return product.variants.reduce((sum, v) => sum + v.stock, 0);
}

export function stockLabel(stock: number): {
  text: string;
  tone: "in" | "low" | "out";
} {
  if (stock === 0) return { text: "Out of stock", tone: "out" };
  if (stock <= 5) return { text: `Only ${stock} left`, tone: "low" };
  return { text: "In stock", tone: "in" };
}
