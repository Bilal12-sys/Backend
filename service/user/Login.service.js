import bcrypt from "bcryptjs";
import { User } from "../../models/User.modal.js";

const loginUser = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return null;
  }

  return user;
};

export default loginUser;
