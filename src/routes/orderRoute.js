import express from "express";
import { authChecking, isAdmin } from "../middlewares/authMiddleware.js";
import {
  createOrder,
  getMyOrders,
  updateOrderStatus,
} from "../controllers/orederController.js";

const router = express.Router();

router.post("/", authChecking, createOrder);
router.get("/myOrder", authChecking, getMyOrders);
router.get("/changeOrderStatus", authChecking, isAdmin, updateOrderStatus);

export default router;
