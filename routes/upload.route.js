import express from "express";
import upload from "../middleware/upload.js";
import createProduct from "../contraller/product/createProduct.controller.js";
import deleteProduct from "../contraller/product/deleteProduct.controller.js";
import getProductById from "../contraller/product/getProductById.controller.js";
import getProducts from "../contraller/product/getProducts.controller.js";
import updateProduct from "../contraller/product/updateProduct.controller.js";

const Product_router = express.Router();

const uploadProductImage = (req, res, next) => {
  upload.single("image")(req, res, (error) => {
    if (error) {
      const status = error.code === "LIMIT_FILE_SIZE" ? 413 : 400;
      return res.status(status).json({
        status,
        message: error.message,
        success: false,
      });
    }

    return next();
  });
};

Product_router.get("/products", getProducts);
Product_router.get("/products/:id", getProductById);
Product_router.post("/createproduct", uploadProductImage, createProduct);
Product_router.put("/products/:id", uploadProductImage, updateProduct);
Product_router.delete("/products/:id", deleteProduct);

export default Product_router;