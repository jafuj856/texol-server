import express from "express";
import {
  addProduct,
  deleteProduct,
  getAllProducts,
  updateProductById,
} from "../controllers/productcontroller.js";
import { authChecking, isAdmin } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";
import {
  handleValidation,
  validateProduct,
} from "../middlewares/productMidlewarE.js";

const router = express.Router();
router.get("/", getAllProducts);
router.post(
  "/",
  authChecking,
  upload.array("images", 5),
  validateProduct,
  handleValidation,
  addProduct
);
router.put(
  "/updateById",
  authChecking,
  isAdmin,
  upload.array("images", 5),
  updateProductById
);
router.delete("/:id", authChecking, isAdmin, deleteProduct);
//isAdmin
export default router;
