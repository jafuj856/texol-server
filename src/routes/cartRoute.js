import express from "express";
import {
  getCart,
  productAddToCart,
  removeFromCart,
} from "../controllers/cartController.js";
import { authChecking } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authChecking, productAddToCart);
router.get("/", authChecking, getCart);
router.put("/", authChecking, removeFromCart);

export default router;
