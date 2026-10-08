// Import All things
import "dotenv/config";
import express from "express";
import cors from "cors";
import dbConnect from "./config/db.js";
import userRouter from "./routes/User.route.js";
import Product_router from "./routes/upload.route.js";

// Connect MongoBD
dbConnect();

const app = express();
app.use(cors());
app.use(express.json());

// Port from env or 2000
const PORT = process.env.PORT || 2000;

// Home Api
app.get("/", (req, res) => {
  res.status(200).json({ status: 200, message: "My Backend Server", success: true });
});

// All Router
app.use("/api/auth", userRouter);
app.use("/api", Product_router);


// Listen app in Port 1000 or 2000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
