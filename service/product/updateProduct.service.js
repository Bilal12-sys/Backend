import { Product } from "../../models/Product.modal.js";
import cloudinary from "../../config/cloudinary.js";
import uploadToCloudinary from "../../utils/uploadtocloudinary.js";
import { productIdSchema, productSchema } from "../../utils/Products.js";

const updateProduct = async (productId, productData, imagePath) => {
  const { error: idError } = productIdSchema.validate(productId);
  if (idError) {
    throw idError;
  }

  const { error, value } = productSchema.validate(productData, {
    abortEarly: false,
    convert: true,
  });
  if (error) {
    throw error;
  }

  const product = await Product.findById(productId);
  if (!product) {
    return null;
  }

  let uploadedImage;
  const previousCloudinaryId = product.cloudinaryId;

  try {
    if (imagePath) {
      uploadedImage = await uploadToCloudinary(imagePath);
      value.image = uploadedImage.secure_url;
      value.cloudinaryId = uploadedImage.public_id;
    }

    Object.assign(product, value);
    await product.save();
  } catch (error) {
    if (uploadedImage?.public_id) {
      try {
        await cloudinary.uploader.destroy(uploadedImage.public_id, {
          resource_type: "image",
        });
      } catch (cleanupError) {
        console.error(`Could not remove uploaded Cloudinary image: ${cleanupError.message}`);
      }
    }

    throw error;
  }

  if (uploadedImage && previousCloudinaryId) {
    try {
      await cloudinary.uploader.destroy(previousCloudinaryId, {
        resource_type: "image",
      });
    } catch (error) {
      console.error(`Could not remove previous Cloudinary image: ${error.message}`);
    }
  }

  return product;
};

export default updateProduct;
