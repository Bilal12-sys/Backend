import getProducts from "../../service/product/getProducts.service.js";
import { formatProduct, Products } from "../../utils/Products.js";

const getProductsController = async (req, res) => {
  try {
    const products = await getProducts();
    Products.splice(0, Products.length, ...products.map(formatProduct));

    return res.status(200).json({
      status: 200,
      message: "Products fetched successfully",
      success: true,
      total: Products.length,
      data: Products,
    });
  } catch (error) {
    console.error(`Error fetching products: ${error.message}`);
    return res.status(500).json({
      status: 500,
      message: "Could not fetch products",
      success: false,
    });
  }
};

export default getProductsController;
