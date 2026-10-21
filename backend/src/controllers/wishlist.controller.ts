import type { NextFunction, Request, Response } from "express";
import { prisma } from "../config/db.js";
import ApiError from "../utils/ApiError.js";
import catchAsync from "../utils/catchAsync.js";
import { sendSuccess } from "../utils/ApiResponse.js";

export const getWishlist = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;

    const items = await prisma.wishlistItem.findMany({
      where: {
        userId,
      },
      include: {
        product: { include: { variants: true, images: true, brand: true } },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    sendSuccess(res, items, "Wishlist fetched successfully");
  },
);

export const addProductToWishlist = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    const productId = req.body.productId as string;

    // Check if the product exists
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      return next(new ApiError("Product not found", 404));
    }

    // Check if the product is already in the wishlist
    const existingItem = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existingItem) {
      return next(new ApiError("Product already in wishlist", 400));
    }

    // Add the product to the wishlist
    const item = await prisma.wishlistItem.create({
      data: {
        userId,
        productId,
      },
    });

    sendSuccess(res, item, "Product added to wishlist", 201);
  },
);

export const removeProductFromWishlist = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    const productId = req.params.productId as string;

    // Check if the product exists
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      return next(new ApiError("Product not found", 404));
    }

    // Check if the product is in the wishlist
    const existingItem = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (!existingItem) {
      return next(new ApiError("Product not in wishlist", 404));
    }

    // Remove the product from the wishlist
    await prisma.wishlistItem.delete({
      where: {
        id: existingItem.id,
      },
    });

    sendSuccess(res, null, "Product removed from wishlist successfully");
  },
);
