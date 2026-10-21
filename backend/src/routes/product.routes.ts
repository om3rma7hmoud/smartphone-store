import express from "express";
import { validate } from "../middlewares/validate.middleware.js";
import { protect, restrictTo } from "../middlewares/auth.middleware.js";
import * as productController from "../controllers/product.controller.js";
import {
  createProductSchema,
  updateProductSchema,
} from "../validations/product.validation.js";

const router = express.Router();

router.get("/", productController.getAllProducts);
router.get("/:slug", productController.getProductBySlug);
router.get("/id/:id", productController.getProductById);
router.get("/:id/related", productController.getRelatedProducts);

router.use(protect, restrictTo("ADMIN"));

router.post(
  "/",
  validate(createProductSchema),
  productController.createProduct,
);

router.patch(
  "/:id",
  validate(updateProductSchema),
  productController.updateProduct,
);

router.delete("/:id", productController.deleteProduct);

export default router;
