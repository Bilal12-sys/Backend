import { Product } from "../../models/Product.modal.js";
import cloudinary from "../../config/cloudinary.js";
import uploadToCloudinary from "../../utils/uploadtocloudinary.js";
import { newProductSchema } from "../../utils/Products.js";
import Joi from "joi";

const createProduct = async (productData, imagePath) => {
  const { error, value } = newProductSchema.validate(productData, {
    abortEarly: false,
    convert: true,
  });
  if (error) {
    throw error;
  }

  const { error: imagePathError } = Joi.string().required().validate(imagePath);
  if (imagePathError) {
    throw imagePathError;
  }

  let uploadedImage;

  try {
    uploadedImage = await uploadToCloudinary(imagePath);
    const product = await Product.create({
      ...value,
      image: uploadedImage.secure_url,
      cloudinaryId: uploadedImage.public_id,
    });

    return product;
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
};

export default createProduct;
