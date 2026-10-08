import { Product } from "../../models/Product.modal.js";

const getProducts = () => Product.find().sort({ createdAt: -1 });

export default getProducts;
