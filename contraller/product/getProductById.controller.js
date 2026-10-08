import getProductById from "../../service/product/getProductById.service.js";
import { formatProduct, productIdSchema } from "../../utils/Products.js";

const getProductByIdController = async (req, res) => {
  const { error } = productIdSchema.validate(req.params.id);
  if (error) {
    return res.status(400).json({
      status: 400,
      message: "Invalid product id",
      success: false,
    });
  }

  try {
    const product = await getProductById(req.params.id);

    if (!product) {
      return res.status(404).json({
        status: 404,
        message: "Product not found",
        success: false,
      });
    }

    return res.status(200).json({
      status: 200,
      message: "Product fetched successfully",
      success: true,
      data: formatProduct(product),
    });
  } catch (error) {
    const status = error.name === "CastError" ? 400 : 500;
    console.error(`Error fetching product: ${error.message}`);
    return res.status(status).json({
      status,
      message: status === 400 ? "Invalid product id" : "Could not fetch product",
      success: false,
    });
  }
};

export default getProductByIdController;
