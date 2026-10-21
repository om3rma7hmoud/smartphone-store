import type { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync.js";
import { prisma } from "../config/db.js";
import ApiError from "../utils/ApiError.js";
import { syncProductRating } from "../utils/syncProductRating.js";
import { sendSuccess } from "../utils/ApiResponse.js";

export const getProductReviews = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const productId = req.params.productId as string;

    const reviews = await prisma.review.findMany({
      where: { productId },
      include: { user: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
    });

    sendSuccess(res, reviews, "Reviews fetched successfully");
  },
);

export const createReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { productId, rating, comment } = req.body;
    const userId = req.user?.id as string;

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) return next(new ApiError("Product not found", 404));

    const exiting = await prisma.review.findUnique({
      where: { productId_userId: { productId, userId } },
    });

    if (exiting)
      return next(new ApiError("You have already reviewed this product", 409));

    const review = await prisma.review.create({
      data: { productId, userId, rating, comment },
    });

    await syncProductRating(productId);

    sendSuccess(res, review, "Review created successfully", 201);
  },
);

export const updateReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;

    const review = await prisma.review.findUnique({ where: { id } });

    if (!review) {
      return next(new ApiError("Review not found", 404));
    }

    if (review.userId !== req.user?.id) {
      return next(
        new ApiError("This review is not belong to you to delete it!", 403),
      );
    }

    const updatedReview = await prisma.review.update({
      where: { id },
      data: req.body,
    });

    await syncProductRating(review.productId);

    sendSuccess(res, updatedReview, "Review updated successfully");
  },
);

export const deleteReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;

    const review = await prisma.review.findUnique({ where: { id } });

    if (!review) {
      return next(new ApiError("Review not found", 404));
    }

    if (review.userId !== req.user?.id && req.user?.role === "ADMIN") {
      return next(
        new ApiError("You are not allowed to perform this action", 403),
      );
    }

    await prisma.review.delete({ where: { id } });
    await syncProductRating(review.productId);

    sendSuccess(res, null, "Review deleted successfully");
  },
);
