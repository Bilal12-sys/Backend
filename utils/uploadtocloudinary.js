import cloudinary from "../config/cloudinary.js";

const uploadToCloudinary = (filePath) => {
  return cloudinary.uploader.upload(filePath, {
    folder: "my-store",
    resource_type: "image",
  });
};

export default uploadToCloudinary;