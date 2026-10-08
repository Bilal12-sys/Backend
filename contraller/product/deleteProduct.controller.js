import { productIdSchema, Products, formatProduct } from "../../utils/Products.js";
import deleteProduct from "../../service/product/deleteProduct.service.js";

const deleteProductController = async (req, res) => {
  const { error } = productIdSchema.validate(req.params.id);
  if (error) {
    return res.status(400).json({
      status: 400,
      message: "Invalid product id",
      success: false,
    });
  }

  try {
    const product = await deleteProduct(req.params.id);

    if (!product) {
      return res.status(404).json({
        status: 404,
        message: "Product not found",
        success: false,
      });
    }

    const productIndex = Products.findIndex(
      (item) => String(item._id) === String(product._id)
    );
    if (productIndex !== -1) {
      Products.splice(productIndex, 1);
    }

    return res.status(200).json({
      status: 200,
      message: "Product deleted successfully",
      success: true,
      data: formatProduct(product),
    });
  } catch (error) {
    const status = error.name === "CastError" ? 400 : 500;
    console.error(`Error deleting product: ${error.message}`);
    return res.status(status).json({
      status,
      message: status === 400 ? "Invalid product id" : "Could not delete product",
      success: false,
    });
  }
};

export default deleteProductController;
