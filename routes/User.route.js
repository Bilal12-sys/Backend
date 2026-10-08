import express from "express";
import GetAllUsersController from "../contraller/user/GetAllusers.controller.js";
import LoginController from "../contraller/user/Login.controller.js";
import ProfileController from "../contraller/user/Profile.controller.js";
import RegisterController from "../contraller/user/Register.controller.js";
import VerifyToken from "../middleware/VerifyToken.middleware.js";

const userRouter = express.Router();

userRouter.get("/users", GetAllUsersController);

userRouter.post("/Register", RegisterController);
userRouter.post("/Login", LoginController);
userRouter.get("/Profile", VerifyToken, ProfileController);

export default userRouter;