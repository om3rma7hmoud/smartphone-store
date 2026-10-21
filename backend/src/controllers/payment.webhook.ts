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

const STRIPE_CURRENCY = "egp";

type WebhookResult =
  | "processed"
  | "already-processed"
  | "ignored"
  | "invalid-payment";

function toMinorUnits(value: Prisma.Decimal | string | number): number {
  const minorUnits = new Prisma.Decimal(value).mul(100);
  if (!minorUnits.isInteger())
    throw new Error("Invalid monetary amount in order");
  const amount = Number(minorUnits.toFixed(0));
  if (!Number.isSafeInteger(amount) || amount < 0) {
    throw new Error("Order amount is outside the supported range");
  }
  return amount;
}

async function markOrderPaid(
  session: Stripe.Checkout.Session,
): Promise<WebhookResult> {
  const orderId = session.metadata?.orderId;
  const userId = session.metadata?.userId;
  if (!orderId || !userId) return "ignored";
  if (session.payment_status !== "paid") return "ignored";

  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findFirst({
      where: {
        id: orderId,
        userId,
        paymentMethod: PaymentMethod.STRIPE,
        stripeSessionId: session.id,
      },
      select: {
        id: true,
        userId: true,
        total: true,
        paymentStatus: true,
        status: true,
      },
    });

    // Ignore stale or unrecognized sessions; never fulfill by metadata alone.
    if (!order) return "ignored";
    if (order.paymentStatus === PaymentStatus.PAID) return "already-processed";
    if (
      order.paymentStatus !== PaymentStatus.UNPAID ||
      order.status !== OrderStatus.PENDING
    ) {
      return "ignored";
    }

    if (
      session.currency?.toLowerCase() !== STRIPE_CURRENCY ||
      session.amount_total !== toMinorUnits(order.total)
    ) {
      return "invalid-payment";
    }

    const updated = await tx.order.updateMany({
      where: {
        id: order.id,
        paymentStatus: PaymentStatus.UNPAID,
        status: OrderStatus.PENDING,
        stripeSessionId: session.id,
      },
      data: {
        paymentStatus: PaymentStatus.PAID,
        status: OrderStatus.CONFIRMED,
      },
    });

    if (updated.count === 1) {
      await tx.cartItem.deleteMany({
        where: { userId: order.userId },
      });

      return "processed";
    }

    const latest = await tx.order.findUnique({
      where: { id: order.id },
      select: { paymentStatus: true },
    });
    return latest?.paymentStatus === PaymentStatus.PAID
      ? "already-processed"
      : "ignored";
  });
}

async function cancelOrderAndRestoreStock(
  session: Stripe.Checkout.Session,
): Promise<WebhookResult> {
  const orderId = session.metadata?.orderId;
  const userId = session.metadata?.userId;
  if (!orderId || !userId) return "ignored";

  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findFirst({
      where: {
        id: orderId,
        userId,
        paymentMethod: PaymentMethod.STRIPE,
        stripeSessionId: session.id,
      },
      include: { items: true },
    });

    if (!order) return "ignored";
    if (order.paymentStatus === PaymentStatus.PAID) return "already-processed";

    // This conditional transition is the idempotency guard. Stock is restored
    // only by the one webhook invocation that changes UNPAID -> FAILED.
    const cancelled = await tx.order.updateMany({
      where: {
        id: order.id,
        paymentStatus: PaymentStatus.UNPAID,
        status: OrderStatus.PENDING,
        stripeSessionId: session.id,
      },
      data: {
        paymentStatus: PaymentStatus.FAILED,
        status: OrderStatus.CANCELLED,
      },
    });

    if (cancelled.count !== 1) return "ignored";

    for (const item of order.items) {
      const restored = await tx.productVariant.updateMany({
        where: { id: item.variantId },
        data: { stock: { increment: item.quantity } },
      });

      if (restored.count !== 1) {
        // Throwing rolls back both the status change and all stock updates.
        throw new Error(
          `Could not restore stock for variant ${item.variantId}`,
        );
      }
    }

    return "processed";
  });
}

export async function paymentWebhook(req: Request, res: Response) {
  const signature = req.headers["stripe-signature"];
  if (typeof signature !== "string" || !Buffer.isBuffer(req.body)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid webhook request" });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      env.STRIPE_WEBHOOK_SECRET,
    );
  } catch {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Stripe signature" });
  }

  try {
    let result: WebhookResult = "ignored";
    const session = event.data.object as Stripe.Checkout.Session;

    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded":
        result = await markOrderPaid(session);
        break;
      case "checkout.session.expired":
      case "checkout.session.async_payment_failed":
        result = await cancelOrderAndRestoreStock(session);
        break;
      default:
        return res.status(200).json({ received: true });
    }

    if (result === "invalid-payment") {
      // A verified but mismatched payment must never confirm the order.
      console.error("Stripe payment amount/currency mismatch", {
        eventId: event.id,
        sessionId: session.id,
      });
      return res.status(400).json({
        success: false,
        message: "Payment amount or currency mismatch",
      });
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("Stripe webhook processing failed", error);
    return res
      .status(500)
      .json({ success: false, message: "Webhook processing failed" });
  }
}
