import express from "express";
import {
  addProduct,
  getAllProducts,
  updateProductById,
} from "../controllers/productcontroller.js";
import { authCheking, isAdmin } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.get("/", getAllProducts);

router.post("/", authCheking, upload.array("images", 5), addProduct); // Assuming addProduct is defined in the controller
router.post("/updateById", authCheking, updateProductById);
//isAdmin
export default router;
