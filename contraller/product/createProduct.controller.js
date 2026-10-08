import fs from "node:fs/promises";
import createProduct from "../../service/product/createProduct.service.js";
import { newProductSchema, Products, formatProduct } from "../../utils/Products.js";

const removeTemporaryImage = async (imagePath) => {
  if (!imagePath) {
    return;
  }

  try {
    await fs.unlink(imagePath);
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error(`Could not remove temporary image ${imagePath}: ${error.message}`);
    }
  }
};

const createProductController = async (req, res) => {
  try {
    const { error, value } = newProductSchema.validate(req.body, {
      abortEarly: false,
      convert: true,
    });

    if (error) {
      return res.status(400).json({
        status: 400,
        message: "Validation failed",
        success: false,
        errors: error.details.map((detail) => detail.message),
      });
    }

    if (!req.file) {
      return res.status(400).json({
        status: 400,
        message: "Title, price, stock, category, and an image are required",
        success: false,
      });
    }

    const product = await createProduct(value, req.file.path);
    const productData = formatProduct(product);
    Products.unshift(productData);

    return res.status(201).json({
      status: 201,
      message: "Product created successfully",
      success: true,
      data: productData,
    });
  } catch (error) {
    console.error(`Error creating product: ${error.message}`);
    const status = error.name === "ValidationError" ? 400 : 500;
    return res.status(status).json({
      status,
      message: status === 400 ? "Validation failed" : "Could not create product",
      success: false,
    });
  } finally {
    await removeTemporaryImage(req.file?.path);
  }
};

export default createProductController;
