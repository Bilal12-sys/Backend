import { User } from "../../models/User.modal.js";

const getProfile = (userId) => User.findById(userId).select("-password");

export default getProfile;
