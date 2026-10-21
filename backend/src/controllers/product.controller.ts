import type { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync.js";
import {
  buildPaginationOptions,
  buildProductOrderBy,
  buildProductWhere,
} from "../utils/productFilteration.js";
import { prisma } from "../config/db.js";
import { sendSuccess } from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import { syncProductMinPrice } from "../utils/syncProductMinPrice.js";

export const getAllProducts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const where = buildProductWhere(req.query);
    const orderBy = buildProductOrderBy(req.query.sort as string);
    const { skip, take, page, limit } = buildPaginationOptions(req.query);

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take,
        include: { variants: true, brand: true, category: true, images: true },
      }),
      prisma.product.count({ where }),
    ]);

    sendSuccess(
      res,
      {
        products,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      "Products fetched successfully",
    );
  },
);

export const getProductBySlug = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const slug = req.params.slug as string;

    const product = await prisma.product.findUnique({
      where: { slug },
      include: { variants: true, brand: true, category: true, images: true },
    });

    if (!product) return next(new ApiError("Product not found", 404));

    sendSuccess(res, product, "Product fetched successfully");
  },
);

export const getProductById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;

    const product = await prisma.product.findUnique({
      where: { id },
      include: { variants: true, brand: true, category: true, images: true },
    });

    if (!product) return next(new ApiError("Product not found", 404));

    sendSuccess(res, product, "Product fetched successfully");
  },
);

export const getRelatedProducts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) return next(new ApiError("This product is not found", 404));

    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        brandId: product.brandId,
        id: { not: id },
        isPublished: true,
      },
      take: 8,
      include: {
        variants: true,
        brand: true,
        category: true,
        images: true,
      },
    });

    sendSuccess(res, relatedProducts, "Fetched successfully");
  },
);

export const createProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { variants, ...productData } = req.body;

    const existing = await prisma.product.findUnique({
      where: { slug: productData.slug },
    });

    if (existing)
      return next(new ApiError("A product with this slug already exists", 409));

    const product = await prisma.product.create({
      data: {
        ...productData,
        variants: {
          create: variants,
        },
      },
      include: { variants: true },
    });

    await syncProductMinPrice(product.id);

    sendSuccess(res, product, "Product created successfully", 201);
  },
);

export const updateProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return next(new ApiError("Product not found", 404));

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: req.body,
    });
    sendSuccess(res, updatedProduct, "Product updated successfully");
  },
);

export const deleteProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return next(new ApiError("Product not found", 404));

    await prisma.product.delete({ where: { id } });
    sendSuccess(res, null, "", 204);
  },
);
