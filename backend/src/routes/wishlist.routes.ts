import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { addToWishlistSchema } from "../validations/wishlist.validation.js";
import {
  addProductToWishlist,
  getWishlist,
  removeProductFromWishlist,
} from "../controllers/wishlist.controller.js";

const router = express.Router();

router.use(protect);

router.get("/", getWishlist);

router.post("/", validate(addToWishlistSchema), addProductToWishlist);

router.delete("/:productId", removeProductFromWishlist);

export default router;
