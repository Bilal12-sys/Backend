import { User } from "../../models/User.modal.js";

const GetAllUsers = () => User.find().select("-password");

export default GetAllUsers;
