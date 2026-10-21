import { z } from "zod";

export const createBrandSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z
    .string()
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must be lowercase letters, numbers, and dashes only",
    ),
  logoUrl: z.url().optional(),
});

export const updateBrandSchema = createBrandSchema.partial();
