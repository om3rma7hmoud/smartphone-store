import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";
import ApiError from "../utils/ApiError.js";
import catchAsync from "../utils/catchAsync.js";

export const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return next(
        new ApiError(
          "You are not logged in! Please log in to get access.",
          401,
        ),
      );
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
      iat?: number;
    };

    // Check if user still exists
    const currentUser = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!currentUser) {
      return next(
        new ApiError(
          "The user belonging to this token does no longer exist.",
          401,
        ),
      );
    }

    if (
      currentUser.passwordChangedAt &&
      decoded.iat !== undefined &&
      decoded.iat < Math.floor(currentUser.passwordChangedAt.getTime() / 1000)
    ) {
      return next(
        new ApiError("Your password has changed. Please log in again.", 401),
      );
    }

    // Grant access to protected route
    req.user = currentUser;
    next();
  },
);

export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role || "")) {
      return next(
        new ApiError("You do not have permission to perform this action", 403),
      );
    }
    next();
  };
};
