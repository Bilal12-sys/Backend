import getProfile from "../../service/user/Profile.service.js";

const ProfileController = async (req, res) => {
  try {
    const user = await getProfile(req.auth.userId);

    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
        success: false,
      });
    }

    return res.status(200).json({
      status: 200,
      message: `Welcome back ${user.name}`,
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(`Error fetching profile: ${error.message}`);
    return res.status(500).json({
      status: 500,
      message: "Could not fetch profile",
      success: false,
    });
  }
};

export default ProfileController;
