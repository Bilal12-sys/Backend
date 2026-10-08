import Joi from "joi";
import bcrypt from "bcryptjs";
import registerUser from "../../service/user/Register.service.js";
import { User } from "../../models/User.modal.js";
import { Users } from "../../utils/Users.js";
import SendEmail from "../../helper/Sender.js";

const registerSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phone: Joi.number().optional(),
});

const RegisterController = async (req, res) => {
  const { error } = registerSchema.validate(req.body, {
    abortEarly: false,
  });

  const { name, email, password, phone } = req.body;

  if (error) {
    return res.status(400).json({ status: 400, message: "Validation failed", success: false, errors: error.message });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ status: 409, message: "Email already exists", success: false });
    }

    const hashpassword = await bcrypt.hash(password, 10);
    const createdUser = await registerUser(name, email, hashpassword, phone);
    const userData = createdUser.toObject();
    delete userData.password;

    res.status(201).json({
      status: 201,
      message: "User created successfully",
      success: true,
      total: Users.length,
      data: userData,
    });

    await SendEmail(userData);
  } catch (error) {
    console.error(`Error in RegisterController: ${error.message}`);
    res.status(500).json({
      status: 500,
      message: "Internal server error",
      success: false,
    });
  }
};

export default RegisterController;
