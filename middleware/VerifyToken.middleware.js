import jwt from "jsonwebtoken";

const VerifyToken = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(401).json({
      status: 401,
      message: "Token is required",
      success: false,
    });
  }

  const Token = authorization.split(" ")[1];

  if (!Token) {
    return res.status(401).json({
      status: 401,
      message: "Token is required",
      success: false,
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
    const payload = jwt.verify(Token, process.env.JWT_SECRET);

    if (typeof payload === "string" || typeof payload.sub !== "string") {
      return res.status(401).json({
        status: 401,
        message: "Invalid token",
        success: false,
      });
    }

    req.auth = {
      userId: payload.sub,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      status: 401,
      message: "Invalid or expired token",
      success: false,
    });
  }
};

export default VerifyToken;