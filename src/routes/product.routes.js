import express from "express";

const router = express.Router();

// Import controllers
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";

// Define routes
router.post("/create", createProduct);
router.get("/get-all", getProducts);
router.get("/get/:id", getProductById);
router.put("/update/:id", updateProduct);
router.delete("/delete/:id", deleteProduct);

export default router;
