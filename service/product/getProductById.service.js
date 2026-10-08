import { Product } from "../../models/Product.modal.js";
import { productIdSchema } from "../../utils/Products.js";

const getProductById = (productId) => {
  const { error } = productIdSchema.validate(productId);
  if (error) {
    throw error;
  }

  return Product.findById(productId);
};

export default getProductById;
