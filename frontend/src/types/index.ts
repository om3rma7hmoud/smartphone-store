export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "CUSTOMER" | "ADMIN";
  token: string;
}

export interface ProductVariant {
  id: string;
  color: string;
  colorHex?: string;
  storage?: string;
  ram?: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  brand: { id: string; name: string; slug: string };
  category: { id: string; name: string; slug: string };
  isPublished: boolean;
  minPrice: number;
  rating: number;
  reviewCount: number;
  display?: string;
  screenSize?: string;
  processor?: string;
  screenType?: string;
  battery?: string;
  camera?: string;
  os: string;
  tags: Array<"new" | "bestseller" | "deal">;
  releaseYear: number;
  images: { url: string; altText?: string }[];
  variants: ProductVariant[];
  reviews?: Review[];
}

export interface FilterProduct {
  brands: string[];
  rams: string[];
  storages: string[];
  os: string[];
  min: number;
  max: number;
  category: "all" | "smartphones" | "accessories";
  dealsOnly: boolean;
}

export type SortKey = "newest" | "price-asc" | "price-desc" | "rating";

export interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Order {
  id: string;
  userId: string;
  addressId: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: "UNPAID" | "PAID" | "FAILED" | "REFUNDED";
  subtotal: number;
  shippingFee: number;
  total: number;
  createdAt: string;
  updatedAt: string;
  address: Address;
  items: OrderItem[];
}

export type OrderStatus =
  "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";

export interface OrderItem {
  id: string;
  productId: string;
  variantId: string;
  productName: string;
  variantInfo: string;
  unitPrice: number;
  quantity: number;
  product: {
    images: {
      id: string;
      url: string;
      altText: string | null;
      order: number;
    }[];
    brand: {
      name: string;
    };
  };
}

export type PaymentMethod = "CASH_ON_DELIVERY" | "STRIPE";

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  city: string;
  area: string;
  street: string;
  isDefault: boolean;
  createdAt?: string;
}
