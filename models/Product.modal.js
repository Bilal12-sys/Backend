import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    description: {
      type: String,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      required: true,
    },

    cloudinaryId: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Product = mongoose.model("Products", productSchema);