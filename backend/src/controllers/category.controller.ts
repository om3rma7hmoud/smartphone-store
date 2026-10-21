import type { NextFunction, Request, Response } from "express";
import { prisma } from "../config/db.js";
import ApiError from "../utils/ApiError.js";
import catchAsync from "../utils/catchAsync.js";
import { sendSuccess } from "../utils/ApiResponse.js";

export const getAllCategories = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const categories = await prisma.category.findMany();
    sendSuccess(res, categories, "Categories fetched successfully!");
  },
);

export const createCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const existing = await prisma.category.findUnique({
      where: { slug: req.body.slug },
    });
    if (existing)
      return next(
        new ApiError("A category with this name has already exists", 409),
      );

    const category = await prisma.category.create({ data: req.body });
    sendSuccess(res, category, "Category created successfully", 201);
  },
);

export const updateCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;

    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) return next(new ApiError("Category not found", 404));

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: req.body,
    });
    sendSuccess(res, updatedCategory, "Category updated successfully");
  },
);

export const deleteCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;

    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) return next(new ApiError("Category not found", 404));

    await prisma.category.delete({ where: { id } });
    sendSuccess(res, null, "Category deleted successfully");
  },
);
