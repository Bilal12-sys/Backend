import { Product } from "../../models/Product.modal.js";
import cloudinary from "../../config/cloudinary.js";
import { productIdSchema } from "../../utils/Products.js";

const deleteProduct = async (productId) => {
  const { error } = productIdSchema.validate(productId);
  if (error) {
    throw error;
  }

  const product = await Product.findByIdAndDelete(productId);

  if (product?.cloudinaryId) {
    try {
      await cloudinary.uploader.destroy(product.cloudinaryId, {
        resource_type: "image",
      });
    } catch (error) {
      console.error(`Could not remove product image from Cloudinary: ${error.message}`);
    }
  }

  return product;
};

export default deleteProduct;
