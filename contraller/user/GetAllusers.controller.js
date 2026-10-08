import GetAllUsers from "../../service/user/GetAllusers.service.js";
import { Users } from "../../utils/Users.js";

const GetAllUsersController = async (req, res) => {
  try {
    const users = await GetAllUsers();
    Users.splice(0, Users.length, ...users.map((user) => user.toObject()));

    res.status(200).json({
      status: 200,
      message: "Users fetched successfully",
      success: true,
      total: Users.length,
      data: Users,
    });
  } catch (error) {
    console.error(`Error fetching users: ${error.message}`);
    res.status(500).json({
      status: 500,
      message: "Could not fetch users",
      success: false,
    });
  }
};

export default GetAllUsersController;
