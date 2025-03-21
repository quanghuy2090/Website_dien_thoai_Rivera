// checkOrderPermission.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";
dotenv.config();
const { SECRET_CODE } = process.env;

export const checkOrderPermission = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(403).json({
        message: "Bạn chưa đăng nhập",
      });
    }

    const decoded = jwt.verify(token, SECRET_CODE);
    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(403).json({
        message: "Token lỗi",
      });
    }

    req.user = user;

    if (user.role === 2) {
      return res.status(403).json({
        message: "Seller không có quyền thực hiện hành động này",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      name: error.name,
      message: error.message,
    });
  }
};