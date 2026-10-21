import type { NextFunction, Request, Response } from "express";
import { prisma } from "../config/db.js";
import ApiError from "../utils/ApiError.js";
import catchAsync from "../utils/catchAsync.js";
import { sendSuccess } from "../utils/ApiResponse.js";

export const getAllBrands = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const brands = await prisma.brand.findMany();
    sendSuccess(res, brands, "Brands fetched successfully!");
  },
);

export const createBrand = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const existing = await prisma.brand.findUnique({
      where: { slug: req.body.slug },
    });
    if (existing)
      return next(
        new ApiError("A brand with this name has already exists", 409),
      );

    const brand = await prisma.brand.create({ data: req.body });
    sendSuccess(res, brand, "Brand created successfully", 201);
  },
);

export const updateBrand = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;

    const brand = await prisma.brand.findUnique({ where: { id } });
    if (!brand) return next(new ApiError("Brand not found", 404));

    const updatedBrand = await prisma.brand.update({
      where: { id },
      data: req.body,
    });
    sendSuccess(res, updatedBrand, "Brand updated successfully");
  },
);

export const deleteBrand = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;

    const brand = await prisma.brand.findUnique({ where: { id } });
    if (!brand) return next(new ApiError("Brand not found", 404));

    await prisma.brand.delete({ where: { id } });
    sendSuccess(res, null, "Brand deleted successfully");
  },
);
