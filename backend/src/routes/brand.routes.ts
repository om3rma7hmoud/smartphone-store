import express from "express";
import { validate } from "../middlewares/validate.middleware.js";
import * as brandController from "../controllers/brand.controller.js";
import { protect, restrictTo } from "../middlewares/auth.middleware.js";
import {
  createBrandSchema,
  updateBrandSchema,
} from "../validations/brand.validation.js";

const router = express.Router();

router.get("/", brandController.getAllBrands);

router.use(protect, restrictTo("ADMIN"));

router.post("/", validate(createBrandSchema), brandController.createBrand);

router.patch("/:id", validate(updateBrandSchema), brandController.updateBrand);

router.delete("/:id", brandController.deleteBrand);

export default router;
