import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
    },
    imgUrl: {
      type: String,
    },
  },
  { timestamps: true },
);

const ProductModel = mongoose.model("Product", productSchema);

export default ProductModel;
