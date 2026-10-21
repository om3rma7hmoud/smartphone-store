import type { Request, Response } from "express";
import {
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  Prisma,
} from "@prisma/client";
import type Stripe from "stripe";

import { prisma } from "../config/db.js";
import { env } from "../config/env.js";
import { stripe } from "../config/stripe.js";
import ApiError from "../utils/ApiError.js";
import { sendSuccess } from "../utils/ApiResponse.js";
import catchAsync from "../utils/catchAsync.js";

// Store prices are currently assumed to be in Egyptian pounds (EGP).
// Change this constant if the store's configured currency is different.
const STRIPE_CURRENCY = "egp";

function toMinorUnits(value: Prisma.Decimal | string | number): number {
  const minorUnits = new Prisma.Decimal(value).mul(100);

  if (!minorUnits.isInteger()) {
    throw new ApiError("Order contains an invalid monetary amount", 400);
  }

  const amount = Number(minorUnits.toFixed(0));
  if (!Number.isSafeInteger(amount) || amount < 0) {
    throw new ApiError("Order amount is outside the supported range", 400);
  }

  return amount;
}

export const createCheckoutSession = catchAsync(
  async (req: Request, res: Response) => {
    const rawOrderId = req.params.orderId;
    const orderId = Array.isArray(rawOrderId) ? rawOrderId[0] : rawOrderId;

    if (!orderId) throw new ApiError("Order ID is required", 400);

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: req.user!.id,
      },
      include: {
        items: true,
      },
    });

    if (!order) throw new ApiError("Order not found", 404);
    if (order.paymentMethod !== PaymentMethod.STRIPE) {
      throw new ApiError("This order does not use Stripe payment", 400);
    }
    if (order.paymentStatus === PaymentStatus.PAID) {
      throw new ApiError("This order has already been paid", 409);
    }
    if (
      order.paymentStatus !== PaymentStatus.UNPAID ||
      order.status !== OrderStatus.PENDING
    ) {
      throw new ApiError("This order is no longer payable", 409);
    }
    if (order.items.length === 0) {
      throw new ApiError("This order has no items", 400);
    }

    // Reuse the same active Checkout Session when the client retries.
    // The fixed Stripe idempotency key also protects concurrent requests.
    if (order.stripeSessionId) {
      const existingSession = await stripe.checkout.sessions.retrieve(
        order.stripeSessionId,
      );

      if (existingSession.status === "open" && existingSession.url) {
        return sendSuccess(
          res,
          { checkoutUrl: existingSession.url },
          "Checkout session ready",
        );
      }

      throw new ApiError(
        "This checkout session is no longer active. Create a new order to try again.",
        409,
      );
    }

    const itemsSubtotal = order.items.reduce(
      (sum, item) => sum.plus(item.unitPrice.mul(item.quantity)),
      new Prisma.Decimal(0),
    );

    if (
      !itemsSubtotal.equals(order.subtotal) ||
      !itemsSubtotal.plus(order.shippingFee).equals(order.total)
    ) {
      throw new ApiError("Order totals do not match its items", 409);
    }

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
      order.items.map((item) => {
        if (item.quantity < 1 || !Number.isInteger(item.quantity)) {
          throw new ApiError("Order contains an invalid quantity", 400);
        }
        if (item.unitPrice.lte(0)) {
          throw new ApiError("Order contains an invalid item price", 400);
        }

        return {
          price_data: {
            currency: STRIPE_CURRENCY,
            unit_amount: toMinorUnits(item.unitPrice),
            product_data: {
              name: item.productName,
              description: item.variantInfo || undefined,
            },
          },
          quantity: item.quantity,
        };
      });

    if (order.shippingFee.gt(0)) {
      lineItems.push({
        price_data: {
          currency: STRIPE_CURRENCY,
          unit_amount: toMinorUnits(order.shippingFee),
          product_data: { name: "Shipping" },
        },
        quantity: 1,
      });
    }

    if (toMinorUnits(order.total) <= 0) {
      throw new ApiError("Order total must be greater than zero", 400);
    }

    const baseUrl = env.FRONTEND_URL.replace(/\/+$/, "");
    const session = await stripe.checkout.sessions.create(
      {
        mode: "payment",
        payment_method_types: ["card"],
        line_items: lineItems,
        client_reference_id: order.id,
        metadata: {
          orderId: order.id,
          userId: order.userId,
        },
        payment_intent_data: {
          metadata: {
            orderId: order.id,
            userId: order.userId,
          },
        },
        success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/checkout/cancel?orderId=${encodeURIComponent(order.id)}`,
      },
      { idempotencyKey: `order-${order.id}-checkout-v1` },
    );

    if (!session.url) {
      throw new ApiError("Stripe did not return a checkout URL", 502);
    }

    // Attach the session only while this order is still pending and unpaid.
    const attached = await prisma.order.updateMany({
      where: {
        id: order.id,
        userId: req.user!.id,
        paymentMethod: PaymentMethod.STRIPE,
        paymentStatus: PaymentStatus.UNPAID,
        status: OrderStatus.PENDING,
        stripeSessionId: null,
      },
      data: { stripeSessionId: session.id },
    });

    if (attached.count !== 1) {
      // A concurrent request may have attached this same idempotent session.
      const latestOrder = await prisma.order.findFirst({
        where: { id: order.id, userId: req.user!.id },
        select: { stripeSessionId: true, paymentStatus: true, status: true },
      });

      if (
        latestOrder?.stripeSessionId !== session.id ||
        latestOrder.paymentStatus !== PaymentStatus.UNPAID ||
        latestOrder.status !== OrderStatus.PENDING
      ) {
        throw new ApiError(
          "Order changed while checkout was being prepared. Refresh and try again.",
          409,
        );
      }
    }

    return sendSuccess(
      res,
      { checkoutUrl: session.url },
      "Checkout session created successfully",
      201,
    );
  },
);
