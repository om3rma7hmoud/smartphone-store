import { z } from "zod";

const variantSchema = z.object({
  color: z.string().min(1),
  colorHex: z.string().optional(),
  storage: z.string().optional(),
  ram: z.string().optional(),
  sku: z.string().min(1),
  price: z.number().positive(),
  compareAtPrice: z.number().positive().optional(),
  stock: z.number().int().min(0),
});

export const createProductSchema = z.object({
  name: z.string().min(2),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  description: z.string().min(10),
  brandId: z.uuid(),
  categoryId: z.string().uuid(),
  screenSize: z.string().optional(),
  screenType: z.string().optional(),
  processor: z.string().optional(),
  battery: z.string().optional(),
  camera: z.string().optional(),
  os: z.string().optional(),
  releaseYear: z.number().int().optional(),
  variants: z.array(variantSchema).min(1, "At least one variant is required"),
});

export const updateProductSchema = createProductSchema.partial();
