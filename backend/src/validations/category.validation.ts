import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  type: z.enum(["PHONE", "ACCESSORY"]),
});

export const updateCategorySchema = createCategorySchema.partial();
