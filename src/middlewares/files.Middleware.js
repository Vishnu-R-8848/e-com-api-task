// middleware/files.middleware.js
import Multer from "multer";
import ImageKit from "@imagekit/nodejs";

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

// Export the primary Multer multi-part form-data parser
export const upload = Multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Export the asynchronous cloud delivery executor loop used by your controller
export const uploadToImageKit = async (fileBuffer, fileName) => {
  return new Promise((resolve, reject) => {
    imagekit.upload(
      {
        file: fileBuffer,
        fileName: fileName,
        folder: "/products",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          url: result.url,
          publicId: result.fileId, // Matches your product schema
        });
      }
    );
  });
};