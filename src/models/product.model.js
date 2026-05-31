import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: [0, "Price cannot be negative"],
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Electronics",
        "Clothing",
        "Books",
        "Home",
        "Beauty",
        "Sports",
        "Toys",
        "Other",
      ],
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        publicId: {
          type: String,
          required: true,
        },
        isPrimary: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  { timestamps: true },
);

const ProductModel = mongoose.model("Product", productSchema);

export default ProductModel;
