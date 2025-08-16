import express from "express";
import {
  getCart,
  productAddToCart,
  updateCartItemQty,
} from "../controllers/cartController.js";
import { authChecking } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authChecking, productAddToCart);
router.get("/", authChecking, getCart);
router.put("/", authChecking, updateCartItemQty);

export default router;
