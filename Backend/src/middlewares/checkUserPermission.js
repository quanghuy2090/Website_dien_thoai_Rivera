// checkUserPermission.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";
dotenv.config();
const { SECRET_CODE } = process.env;

export const checkUserPermission = async (req, res, next) => {
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

    req.user = user;

    // Bước 3: Check quyền theo role
    // Admin (role = 1) có thể xem/sửa tất cả
    // Customer (role = 3) chỉ xem/sửa chính mình
    // Seller (role = 2) không có quyền
    if (user.role === 2) {
      return res.status(403).json({
        message: "Seller không có quyền thực hiện hành động này",
      });
    }

    if (user.role === 3) {
      // Customer chỉ được thao tác với chính mình
      const requestedUserId = req.params.id; // Giả sử id nằm trong params
      if (requestedUserId && requestedUserId !== user._id.toString()) {
        return res.status(403).json({
          message: "Bạn chỉ có thể xem/thay đổi thông tin của chính mình",
        });
      }
    }

    next();
  } catch (error) {
    return res.status(500).json({
      name: error.name,
      message: error.message,
    });
  }
};