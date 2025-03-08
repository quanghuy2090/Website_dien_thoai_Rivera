// checkAdminPermission.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";
dotenv.config();
const { SECRET_CODE } = process.env;

export const checkAdminPermission = async (req, res, next) => {
  try {
    // Bước 1: Check token có tồn tại không
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(403).json({
        message: "Bạn chưa đăng nhập",
      });
    }

    // Bước 2: Verify token
    const decoded = jwt.verify(token, SECRET_CODE);
    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(403).json({
        message: "Token lỗi",
      });
    }

    // Bước 3: Check role admin (role = 1)
    if (user.role !== 1) {
      return res.status(403).json({
        message: "Chỉ admin mới có quyền thực hiện hành động này",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({
      name: error.name,
      message: error.message,
    });
  }
};