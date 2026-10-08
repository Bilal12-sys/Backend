import { User } from "../../models/User.modal.js";

const registerUser = async (name, email, password, phone) => {
  return await User.create({ name, email, password, phone });
};

export default registerUser;
