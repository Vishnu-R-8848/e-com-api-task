import express from "express";
import authMiddleware from "../middlewares/auth.Middleware.js";
import { upload } from "../middlewares/files.middleware.js";
import {
  createProduct,
  getProducts,
} from "../controllers/product.controller.js";

const router = express.Router();

router.post(
  "/create",
  authMiddleware,
  upload.array("images", 5),
  createProduct,
);
router.get("/get-all", authMiddleware, getProducts);

export default router;
