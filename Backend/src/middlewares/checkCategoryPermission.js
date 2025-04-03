import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();
const { SECRET_CODE } = process.env;

export const checkCategoryPermission = async (req, res, next) => {
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

    // Bước 3: Kiểm tra trạng thái tài khoản
    if (user.status === "banned") {
      return res.status(403).json({
        message: "Tài khoản của bạn đã bị khóa",
      });
    }

    // Bước 4: Check role admin (role = 1)
    if (user.role !== 1) {
      return res.status(403).json({
        message: "Chỉ admin mới có quyền quản lý danh mục",
      });
    }

    // Bước 5: Lưu thông tin user vào request
    req.user = user;
    next();
  } catch (error) {
    // Phân biệt lỗi token hết hạn và token không hợp lệ
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token đã hết hạn",
      });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(403).json({
        message: "Token không hợp lệ",
      });
    }
    // Lỗi khác (nếu có)
    return res.status(500).json({
      name: error.name,
      message: "Đã xảy ra lỗi. Vui lòng thử lại sau",
    });
  }
};
