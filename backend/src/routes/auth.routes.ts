import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import * as authController from "../controllers/auth.controller.js";
import { signupSchema, loginSchema } from "../validations/auth.validation.js";

const router = express.Router();

router.post("/signup", validate(signupSchema), authController.signup);
router.post("/login", validate(loginSchema), authController.login);
router.get("/logout", authController.logout);
router.get("/me", protect, authController.getMe);

router.patch("/change-password", protect, authController.changePassword);
router.post("/forgot-password", authController.forgotPassword);
router.patch("/reset-password/:token", authController.resetPassword);

export default router;
