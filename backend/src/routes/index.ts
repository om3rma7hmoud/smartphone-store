import express from "express";
import authRoutes from "./auth.routes.js";
import cartRoutes from "./cart.routes.js";
import brandRoutes from "./brand.routes.js";
import orderRoutes from "./order.routes.js";
import reviewRoutes from "./review.routes.js";
import addressRoutes from "./address.routes.js";
import paymentRoutes from "./payment.routes.js";
import productRoutes from "./product.routes.js";
import variantRoutes from "./variant.routes.js";
import categoryRoutes from "./category.routes.js";
import wishlistRoutes from "./wishlist.routes.js";
import userRoutes from "./user.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/cart", cartRoutes);
router.use("/users", userRoutes);
router.use("/brands", brandRoutes);
router.use("/orders", orderRoutes);
router.use("/reviews", reviewRoutes);
router.use("/payments", paymentRoutes);
router.use("/products", productRoutes);
router.use("/variants", variantRoutes);
router.use("/addresses", addressRoutes);
router.use("/wishlist", wishlistRoutes);
router.use("/categories", categoryRoutes);

export default router;
