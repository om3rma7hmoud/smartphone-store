import { Prisma } from "@prisma/client";
import type { Request, Response } from "express";

import { prisma } from "../config/db.js";
import ApiError from "../utils/ApiError.js";
import { sendSuccess } from "../utils/ApiResponse.js";
import catchAsync from "../utils/catchAsync.js";
import { createOrderSchema } from "../validations/order.validation.js";

export const createOrder = catchAsync(async (req: Request, res: Response) => {
  const parsed = createOrderSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ApiError(
      parsed.error.issues.map((issue) => issue.message).join(", "),
      400,
    );
  }

  const userId = req.user!.id;
  const { addressId, paymentMethod } = parsed.data;

  const order = await prisma.$transaction(async (tx) => {
    // Only allow the authenticated user to use their own saved address.
    const address = await tx.address.findFirst({
      where: { id: addressId, userId },
      select: { id: true },
    });

    if (!address) {
      throw new ApiError(
        "Address not found or does not belong to the user",
        404,
      );
    }

    // Cart contents, prices, and quantities come from the database.
    const cartItems = await tx.cartItem.findMany({
      where: { userId },
      include: {
        product: true,
        variant: true,
      },
    });

    if (cartItems.length === 0) {
      throw new ApiError("Your cart is empty", 400);
    }

    let subtotal = new Prisma.Decimal(0);
    const orderItems: Prisma.OrderItemUncheckedCreateWithoutOrderInput[] = [];

    for (const item of cartItems) {
      if (
        item.variant.productId !== item.productId ||
        !item.product.isPublished
      ) {
        throw new ApiError(
          `Product "${item.product.name}" is unavailable`,
          409,
        );
      }

      if (!Number.isInteger(item.quantity) || item.quantity < 1) {
        throw new ApiError("Invalid cart quantity", 400);
      }

      // Atomic conditional decrement prevents concurrent orders from
      // reducing stock below zero. A failed check rolls back the transaction.
      const stockUpdate = await tx.productVariant.updateMany({
        where: {
          id: item.variantId,
          productId: item.productId,
          stock: { gte: item.quantity },
        },
        data: { stock: { decrement: item.quantity } },
      });

      if (stockUpdate.count !== 1) {
        throw new ApiError(
          `Insufficient stock for "${item.product.name}"`,
          409,
        );
      }

      const unitPrice = item.variant.price;
      subtotal = subtotal.plus(unitPrice.mul(item.quantity));

      const variantInfo = [
        item.variant.color,
        item.variant.storage,
        item.variant.ram,
      ]
        .filter((value): value is string => Boolean(value))
        .join(" / ");

      orderItems.push({
        productId: item.productId,
        variantId: item.variantId,
        productName: item.product.name,
        variantInfo: variantInfo || "Standard",
        unitPrice,
        quantity: item.quantity,
      });
    }

    // Shipping is server-calculated. Replace this placeholder with the
    // store's shipping policy before production use.
    const shippingFee = new Prisma.Decimal(150);
    const total = subtotal.plus(shippingFee);

    return tx.order.create({
      data: {
        userId,
        addressId,
        paymentMethod,
        subtotal,
        shippingFee,
        total,
        items: { create: orderItems },
      },
      select: {
        id: true,
        userId: true,
        addressId: true,
        status: true,
        paymentMethod: true,
        paymentStatus: true,
        subtotal: true,
        shippingFee: true,
        total: true,
        createdAt: true,
        updatedAt: true,
        address: true,
        items: {
          include: {
            product: {
              include: {
                images: {
                  orderBy: {
                    order: "asc",
                  },
                },
                brand: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  });

  sendSuccess(res, order, "Order created successfully", 201);
});

export const getMyOrders = catchAsync(async (req: Request, res: Response) => {
  const orders = await prisma.order.findMany({
    where: { userId: req.user!.id },
    select: {
      id: true,
      userId: true,
      addressId: true,
      status: true,
      paymentMethod: true,
      paymentStatus: true,
      subtotal: true,
      shippingFee: true,
      total: true,
      createdAt: true,
      updatedAt: true,
      address: true,
      items: {
        include: {
          product: {
            include: {
              images: {
                orderBy: {
                  order: "asc",
                },
              },
              brand: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  sendSuccess(res, orders, "Orders fetched successfully");
});

export const getMyOrderById = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    const order = await prisma.order.findFirst({
      where: {
        id,
        userId: req.user!.id,
      },
      select: {
        id: true,
        userId: true,
        addressId: true,
        status: true,
        paymentMethod: true,
        paymentStatus: true,
        subtotal: true,
        shippingFee: true,
        total: true,
        createdAt: true,
        updatedAt: true,
        address: true,
        items: {
          include: {
            product: {
              include: {
                images: {
                  orderBy: {
                    order: "asc",
                  },
                },
                brand: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!order) {
      throw new ApiError("Order not found", 404);
    }

    sendSuccess(res, order, "Order fetched successfully");
  },
);
