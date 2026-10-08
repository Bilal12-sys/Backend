import Joi from "joi";
import jwt from "jsonwebtoken";
import loginUser from "../../service/user/Login.service.js";
import LoginEmail from "../../helper/loginSender.js";

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const LoginController = async (req, res) => {
  const { error, value } = loginSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res.status(400).json({
      status: 400,
      message: "Validation failed",
      success: false,
      errors: error.details.map((err) => err.message),
    });
  }

  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is not configured");
    return res.status(500).json({
      status: 500,
      message: "Authentication service is unavailable",
      success: false,
    });
  }

  try {
    const user = await loginUser(value.email, value.password);

    if (!user) {
      return res.status(401).json({
        status: 401,
        message: "Invalid email or password",
        success: false,
      });
    }

    const token = jwt.sign(
      { email: user.email },
      process.env.JWT_SECRET,
      { subject: user._id.toString(), expiresIn: "1h" }
    );
    await LoginEmail(user);

    return res.status(200).json({
      status: 200,
      message: "Login successful",
      success: true,
      token,
      UserData: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error(`Error in LoginController: ${error.message}`);
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
      success: false,
    });
  }
};

export default LoginController;
