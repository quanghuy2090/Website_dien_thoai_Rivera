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

    // Bước 3: Kiểm tra trạng thái tài khoản
    if (user.status === "banned") {
      return res.status(403).json({
        message: "Tài khoản của bạn đã bị khóa",
      });
    }

    // Bước 4: Check role admin (role = 1)
    if (user.role !== 1) {
      return res.status(403).json({
        message: "Chỉ admin mới có quyền thực hiện hành động này",
      });
    }

    // Bước 5: Kiểm tra quyền cập nhật thông tin admin khác
    if (req.method === "PUT" && req.params.id) {
      const targetUser = await User.findById(req.params.id);
      if (!targetUser) {
        return res.status(404).json({
          message: "Không tìm thấy người dùng cần cập nhật",
        });
      }
      // Nếu targetUser là admin và không phải chính user hiện tại
      if (targetUser.role === 1 && targetUser._id.toString() !== user._id.toString()) {
        return res.status(403).json({
          message: "Admin không được phép cập nhật thông tin của admin khác",
        });
      }
    }

    // Bước 6: Lưu thông tin user vào request
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