import type { Request, Response } from "express";
import { prisma } from "../config/db.js";
import ApiError from "../utils/ApiError.js";
import { sendSuccess } from "../utils/ApiResponse.js";
import catchAsync from "../utils/catchAsync.js";

export const getProductVariants = catchAsync(
  async (req: Request, res: Response) => {
    const rawSlug = req.params.slug;
    const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;

    if (!slug) {
      throw new ApiError("Product slug is required", 400);
    }

    const product = await prisma.product.findFirst({
      where: {
        slug,
        isPublished: true,
      },
      select: {
        id: true,
      },
    });

    if (!product) {
      throw new ApiError("Product not found", 404);
    }

    const variants = await prisma.productVariant.findMany({
      where: {
        productId: product.id,
      },
      select: {
        id: true,
        productId: true,
        color: true,
        colorHex: true,
        storage: true,
        ram: true,
        sku: true,
        price: true,
        compareAtPrice: true,
        stock: true,
      },
      orderBy: {
        price: "asc",
      },
    });

    return sendSuccess(
      res,
      { variants },
      "Product variants fetched successfully",
    );
  },
);
