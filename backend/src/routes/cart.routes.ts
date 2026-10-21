import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import * as cartController from "../controllers/cart.controller.js";
import {
  addToCartSchema,
  updateCartItemSchema,
} from "../validations/cart.validation.js";

const router = express.Router();

router.use(protect);

router.get("/", cartController.getCart);

router.post("/", validate(addToCartSchema), cartController.addItem);

router.patch("/:id", validate(updateCartItemSchema), cartController.updateItem);

router.delete("/:id", cartController.deleteItem);

export default router;
