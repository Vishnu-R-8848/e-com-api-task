// src/middlewares/files.middleware.js
import Multer from "multer";
import ImageKit from "@imagekit/nodejs";
import dotenv from "dotenv";

dotenv.config();

// 🔥 THE CLASSIC MODERN INITIALIZATION
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// Configure Multer memory allocation
const storage = Multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

export const upload = Multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});
// src/middlewares/files.Middleware.js

// Export the asynchronous cloud delivery executor loop used by your controller
export const uploadToImageKit = async (fileBuffer, fileName) => {
  return new Promise(async (resolve, reject) => {
    try {
      // 🔥 MODERN FIXED SYNTAX: Call .files.upload right on your instance instance
      const response = await imagekit.files.upload({
        file: fileBuffer, // Streams the Multer memory buffer directly
        fileName: fileName,
        folder: "/products", // This creates a folder on the IMAGEKIT DASHBOARD cloud, not your laptop!
      });

      // Resolve the clean cloud URL metadata straight back to your database controller
      resolve({
        url: response.url,
        publicId: response.fileId,
      });
    } catch (error) {
      console.error("ImageKit cloud delivery channel failed:", error);
      reject(error);
    }
  });
};