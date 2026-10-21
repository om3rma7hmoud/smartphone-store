import type { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync.js";
import { prisma } from "../config/db.js";
import { sendSuccess } from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

export const getCart = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;

  const items = await prisma.cartItem.findMany({
    where: { userId },
    include: {
      product: {
        include: {
          images: true,
          brand: true,
        },
      },
      variant: true,
    },
    orderBy: { createdAt: "desc" },
  });

  sendSuccess(res, items, "Cart fetched successfully");
});

export const addItem = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { variantId, quantity } = req.body;
    const userId = req.user!.id;

    if (
      typeof variantId !== "string" ||
      !Number.isInteger(quantity) ||
      quantity <= 0
    ) {
      return next(new ApiError("Invalid variant or quantity", 400));
    }

    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
      include: { product: true },
    });

    if (!variant || !variant.product.isPublished) {
      return next(new ApiError("Product variant not found", 404));
    }

    const existing = await prisma.cartItem.findUnique({
      where: {
        userId_variantId: {
          userId,
          variantId,
        },
      },
    });

    const newQuantity = (existing?.quantity ?? 0) + quantity;

    if (newQuantity > variant.stock) {
      return next(new ApiError("Not enough stock available", 400));
    }

    const item = await prisma.cartItem.upsert({
      where: {
        userId_variantId: {
          userId,
          variantId,
        },
      },
      update: {
        quantity: {
          increment: quantity,
        },
      },
      create: {
        userId,
        productId: variant.productId,
        variantId,
        quantity,
      },
    });

    sendSuccess(res, item, "Added to cart", 201);
  },
);

export const updateItem = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;
    const { quantity } = req.body;

    if (!Number.isInteger(quantity) || quantity <= 0) {
      return next(new ApiError("Quantity must be a positive integer", 400));
    }

    const item = await prisma.cartItem.findUnique({
      where: { id },
      include: { variant: true },
    });

    if (!item || item.userId !== req.user!.id) {
      return next(new ApiError("Cart item not found", 404));
    }

    if (item.variant.stock < quantity) {
      return next(new ApiError("Not enough stock available", 400));
    }

    const updatedItem = await prisma.cartItem.update({
      where: { id },
      data: { quantity },
    });

    sendSuccess(res, updatedItem, "Cart item updated");
  },
);

export const deleteItem = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;

    const item = await prisma.cartItem.findUnique({
      where: { id },
    });
    if (!item || item.userId !== req.user?.id) {
      return next(new ApiError("Cart item not found", 404));
    }

    await prisma.cartItem.delete({ where: { id } });
    sendSuccess(res, null, "Removed from cart");
  },
);

export const clearCart = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.id;

    await prisma.cartItem.deleteMany({ where: { userId } });
    sendSuccess(res, null, "Cart cleared");
  },
);
