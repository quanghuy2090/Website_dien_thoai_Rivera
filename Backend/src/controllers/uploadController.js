import pkg from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from 'multer-storage-cloudinary';

import dotenv from "dotenv";
dotenv.config();
const { v2: cloudinary } = pkg;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});
const storage = new CloudinaryStorage({
    cloudinary,
    allowedFormats: ["jpg", "png"],
    params: {
        folder: "nodejs"
    }
});
const uploadCloudinary = multer({ storage })

export default uploadCloudinary;
