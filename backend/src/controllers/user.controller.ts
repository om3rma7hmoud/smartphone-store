import type { Request, Response, NextFunction } from "express";
import { prisma } from "../config/db.js";
import ApiError from "../utils/ApiError.js";
import catchAsync from "../utils/catchAsync.js";

export const updateMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, phone } = req.body;

    if (name === undefined && phone === undefined) {
      return next(
        new ApiError("Please provide at least one field to update.", 400),
      );
    }

    if (name !== undefined && (typeof name !== "string" || !name.trim())) {
      return next(new ApiError("Name cannot be empty.", 400));
    }

    if (phone !== undefined && phone !== null && typeof phone !== "string") {
      return next(new ApiError("Phone must be a valid string.", 400));
    }

    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(phone !== undefined && {
          phone: phone?.trim() || null,
        }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    res.status(200).json({
      status: "success",
      data: { user },
    });
  },
);
