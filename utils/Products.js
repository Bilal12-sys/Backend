import Joi from "joi";

export const Products = [];

export const productSchema = Joi.object({
  title: Joi.string().trim().min(1).max(150),
  price: Joi.number().positive(),
  description: Joi.string().allow(""),
  stock: Joi.number().integer().min(0),
  category: Joi.string().trim().min(1).max(100),
}).unknown(false);

export const newProductSchema = productSchema.fork(
  ["title", "price", "stock", "category"],
  (schema) => schema.required()
);

export const productIdSchema = Joi.string().hex().length(24).required();

export const formatProduct = (product) =>
  typeof product.toObject === "function" ? product.toObject() : product;
