import type { Request, Response, NextFunction } from "express";
import { prisma } from "../config/db.js";
import ApiError from "../utils/ApiError.js";
import catchAsync from "../utils/catchAsync.js";

export const getMyAddresses = catchAsync(
  async (req: Request, res: Response) => {
    const addresses = await prisma.address.findMany({
      where: { userId: req.user!.id },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });

    res.status(200).json({
      status: "success",
      results: addresses.length,
      data: { addresses },
    });
  },
);

export const createAddress = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { fullName, phone, city, area, street, isDefault } = req.body;

    if (!fullName || !phone || !city || !area || !street) {
      return next(
        new ApiError("Please provide all required address fields.", 400),
      );
    }

    const userId = req.user!.id;

    const address = await prisma.$transaction(async (tx) => {
      const count = await tx.address.count({ where: { userId } });
      const shouldBeDefault = Boolean(isDefault) || count === 0;

      if (shouldBeDefault) {
        await tx.address.updateMany({
          where: { userId },
          data: { isDefault: false },
        });
      }

      return tx.address.create({
        data: {
          userId,
          fullName,
          phone,
          city,
          area,
          street,
          isDefault: shouldBeDefault,
        },
      });
    });

    res.status(201).json({
      status: "success",
      data: { address },
    });
  },
);

export const updateAddress = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const addressId = req.params.id as string;
    const userId = req.user!.id;

    const existingAddress = await prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!existingAddress) {
      return next(new ApiError("Address not found.", 404));
    }

    const { fullName, phone, city, area, street, isDefault } = req.body;

    const address = await prisma.$transaction(async (tx) => {
      if (isDefault === true) {
        await tx.address.updateMany({
          where: { userId },
          data: { isDefault: false },
        });
      }

      return tx.address.update({
        where: { id: addressId },
        data: {
          ...(fullName !== undefined && { fullName }),
          ...(phone !== undefined && { phone }),
          ...(city !== undefined && { city }),
          ...(area !== undefined && { area }),
          ...(street !== undefined && { street }),
          ...(isDefault !== undefined && { isDefault }),
        },
      });
    });

    res.status(200).json({
      status: "success",
      data: { address },
    });
  },
);

export const setDefaultAddress = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const addressId = req.params.id as string;
    const userId = req.user!.id;

    const address = await prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!address) {
      return next(new ApiError("Address not found.", 404));
    }

    await prisma.$transaction([
      prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      }),
      prisma.address.update({
        where: { id: addressId },
        data: { isDefault: true },
      }),
    ]);

    res.status(200).json({
      status: "success",
      message: "Default address updated successfully.",
    });
  },
);

export const deleteAddress = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const addressId = req.params.id as string;
    const userId = req.user!.id;

    const address = await prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!address) {
      return next(new ApiError("Address not found.", 404));
    }

    await prisma.$transaction(async (tx) => {
      await tx.address.delete({
        where: { id: addressId },
      });

      if (address.isDefault) {
        const nextAddress = await tx.address.findFirst({
          where: { userId },
          orderBy: { createdAt: "asc" },
        });

        if (nextAddress) {
          await tx.address.update({
            where: { id: nextAddress.id },
            data: { isDefault: true },
          });
        }
      }
    });

    res.status(204).json({
      status: "success",
      data: null,
    });
  },
);
