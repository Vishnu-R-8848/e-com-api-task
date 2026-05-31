// controllers/productController.js
import ProductModel from "../models/product.model.js";
import { uploadToImageKit } from "../middlewares/files.middleware.js";

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;

    // Validate textual fields
    if (!name || !description || !price || !category) {
      return res.status(400).json({ message: "All text fields are required" });
    }

    // Ensure files actually exist in multi-part payload
    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one product image is required" });
    }

    // Process array of files concurrently through ImageKit
    const uploadPromises = req.files.map((file, index) => {
      // Create a clean filename hash string
      const uniqueFileName = `${Date.now()}-${file.originalname}`;
      return uploadToImageKit(file.buffer, uniqueFileName).then(
        (uploadResult) => ({
          url: uploadResult.url,
          publicId: uploadResult.publicId,
          isPrimary: index === 0, // Automatically makes the first image primary
        }),
      );
    });

    const processedImages = await Promise.all(uploadPromises);

    // Create and save new product document populated with full asset details
    const newProduct = new ProductModel({
      name,
      description,
      price,
      category,
      images: processedImages,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Server error during creation" });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await ProductModel.find();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error during retrieval" });
  }
};
