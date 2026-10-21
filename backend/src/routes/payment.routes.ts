import express from "express";

import { createCheckoutSession } from "../controllers/payment.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(protect);
router.post("/orders/:orderId/checkout-session", createCheckoutSession);

export default router;
