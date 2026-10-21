import jwt from "jsonwebtoken";
import type { Response } from "express";
import type { SignOptions } from "jsonwebtoken";
import { sendSuccess } from "./ApiResponse.js";

const signToken = (id: string) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign({ id }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
  });
};

export const createSendToken = (
  user: any,
  statusCode: number,
  res: Response,
) => {
  const token = signToken(user.id);

  const cookieExpiresIn = Number(process.env.JWT_COOKIE_EXPIRES_IN ?? 1);
  const cookieOptions = {
    expires: new Date(Date.now() + cookieExpiresIn * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  res.cookie("jwt", token, cookieOptions);

  const { password, ...safeUser } = user;

  sendSuccess(
    res,
    { user: safeUser, token },
    "User authenticated successfully",
    statusCode,
  );
};
