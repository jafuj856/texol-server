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
  validateProduct,
  handleValidation,
  upload.array("images", 5),
  addProduct
); // Assuming addProduct is defined in the controller
router.post("/updateById", authChecking, updateProductById);
router.delete("/:id", authChecking, deleteProduct);
//isAdmin
export default router;
