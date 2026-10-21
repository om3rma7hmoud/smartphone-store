import express from "express";

import { protect } from "../middlewares/auth.middleware.js";
import {
  createOrder,
  getMyOrderById,
  getMyOrders,
} from "../controllers/order.controller.js";

const router = express.Router();

router.use(protect);

router.route("/").post(createOrder).get(getMyOrders);
router.get("/:id", getMyOrderById);

export default router;
