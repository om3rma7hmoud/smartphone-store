import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";

import {
  getMyAddresses,
  createAddress,
  updateAddress,
  setDefaultAddress,
  deleteAddress,
} from "../controllers/address.controller.js";

const router = Router();

router.use(protect);

router.route("/").get(getMyAddresses).post(createAddress);

router.patch("/:id/default", setDefaultAddress);
router.route("/:id").patch(updateAddress).delete(deleteAddress);

export default router;
