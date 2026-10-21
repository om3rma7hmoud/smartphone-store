import express from "express";
import { validate } from "../middlewares/validate.middleware.js";
import { protect, restrictTo } from "../middlewares/auth.middleware.js";
import * as categoryController from "../controllers/category.controller.js";
import {
  createCategorySchema,
  updateCategorySchema,
} from "../validations/category.validation.js";

const router = express.Router();

router.get("/", categoryController.getAllCategories);

router.use(protect, restrictTo("ADMIN"));

router.post(
  "/",
  validate(createCategorySchema),
  categoryController.createCategory,
);

router.patch(
  "/:id",
  validate(updateCategorySchema),
  categoryController.updateCategory,
);

router.delete("/:id", categoryController.deleteCategory);

export default router;
