import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import * as reviewController from "../controllers/review.controller.js";
import {
  createReviewSchema,
  updateReviewSchema,
} from "../validations/review.validation.js";

const router = express.Router();

router.get("/:productId", reviewController.getProductReviews);

router.use(protect);

router.post("/", validate(createReviewSchema), reviewController.createReview);

router.patch(
  "/:id",
  validate(updateReviewSchema),
  reviewController.updateReview,
);

router.delete("/:id", reviewController.deleteReview);

export default router;
