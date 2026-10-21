import express from "express";
import { getProductVariants } from "../controllers/variant.controller.js";

const router = express.Router();

router.get("/product/:slug", getProductVariants);

export default router;
