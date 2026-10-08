import fs from "node:fs/promises";
import updateProduct from "../../service/product/updateProduct.service.js";
import { productIdSchema, productSchema, formatProduct, Products } from "../../utils/Products.js";

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

const updateProductController = async (req, res) => {
  try {
    const { error: idError } = productIdSchema.validate(req.params.id);
    if (idError) {
      return res.status(400).json({
        status: 400,
        message: "Invalid product id",
        success: false,
      });
    }

    const { error, value } = productSchema.validate(req.body, {
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

    if (Object.keys(value).length === 0 && !req.file) {
      return res.status(400).json({
        status: 400,
        message: "Provide product fields or a new image to update",
        success: false,
      });
    }

    const product = await updateProduct(req.params.id, value, req.file?.path);
    if (!product) {
      return res.status(404).json({
        status: 404,
        message: "Product not found",
        success: false,
      });
    }

    const productData = formatProduct(product);
    const productIndex = Products.findIndex(
      (item) => String(item._id) === String(productData._id)
    );
    if (productIndex === -1) {
      Products.unshift(productData);
    } else {
      Products[productIndex] = productData;
    }

    return res.status(200).json({
      status: 200,
      message: "Product updated successfully",
      success: true,
      data: formatProduct(product),
    });
  } catch (error) {
    const status = ["CastError", "ValidationError"].includes(error.name) ? 400 : 500;
    console.error(`Error updating product: ${error.message}`);
    return res.status(status).json({
      status,
      message:
        error.name === "ValidationError"
          ? "Validation failed"
          : status === 400
            ? "Invalid product id"
            : "Could not update product",
      success: false,
    });
  } finally {
    await removeTemporaryImage(req.file?.path);
  }
};

export default updateProductController;
