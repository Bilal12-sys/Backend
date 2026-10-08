import multer from "multer";
import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";

const assetsDirectory = fileURLToPath(new URL("../assets/", import.meta.url));

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    fs.mkdir(assetsDirectory, { recursive: true }, (error) => {
      callback(error, assetsDirectory);
    });
  },
  filename: (req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    callback(null, `${Date.now()}-${randomUUID()}${extension}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (/^image\/(jpeg|png|gif|webp|avif)$/.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed"));
    }
  },
});

export default upload;