import User from "../models/User.js";
import { singInValidate, singUpValidate } from "../validation/user.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// Đăng Kí
export const signUp = async (req, res) => {
  try {
    // Bước 1: Validate dữ liệu người dùng
    const { error } = singUpValidate.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({
        message: errors,
      });
    }

    // Bước 2: Kiểm tra xem email đã tồn tại hay chưa
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      return res.status(400).json({
        message: "Email này đã tồn tại",
      });
    }

    // Bước 3: Mã hóa mật khẩu
    const hashedPassword = await bcryptjs.hash(req.body.password, 10);

    // Bước 4: Khởi tạo user trong database
    const { userName, email, phone, address, password } = req.body;
    const user = await User.create({
      userName,
      email,
      phone,
      address,
      password: hashedPassword,
    });

    // Bước 5: Thông báo đăng ký thành công
    user.password = undefined;
    return res.status(201).json({
      message: "Đăng ký tài khoản thành công",
      data: user,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Email hoặc tên người dùng đã tồn tại",
      });
    }
    return res.status(500).json({
      name: error.name,
      message: error.message,
    });
  }
};

// Đăng nhập
export const signIn = async (req, res) => {
  try {
    // Bước 1: Validate dữ liệu từ client
    const { error } = singInValidate.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({
        message: errors,
      });
    }

    // Bước 2: Kiểm tra email có tồn tại hay không
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        message: "Email này chưa được đăng ký, bạn có muốn đăng ký không?",
      });
    }
    if (user.status !== "active") {
      return res.status(403).json({
        message: "Tài khoản của bạn đã bị vô hiệu hóa",
      });
    }

    // Bước 3: Kiểm tra mật khẩu
    const isMatch = await bcryptjs.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Mật khẩu không đúng",
      });
    }

    // Bước 4: Tạo JWT
    const SECRET_CODE = process.env.SECRET_CODE || "default_secret";
    if (!SECRET_CODE) {
      throw new Error("SECRET_CODE không được cấu hình");
    }
    const accessToken = jwt.sign({ _id: user._id }, SECRET_CODE, {
      expiresIn: "1d",
    });

    // Bước 5: Trả về thông báo cho người dùng
    user.password = undefined;
    return res.status(200).json({
      message: "Đăng nhập thành công",
      data: {
        user,
        accessToken,
        expiresIn: "1d",
      },
    });
  } catch (error) {
    return res.status(500).json({
      name: error.name,
      message: error.message,
    });
  }
};

export const getUser = async (req, res) => {
  try {
    const users = await User.find().limit(10).skip(0); // Ví dụ thêm phân trang
    if (users.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy người dùng",
      });
    }
    return res.status(200).json({
      message: "Danh sách người dùng",
      data: users,
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách người dùng:", error); // Log lỗi để debug
    return res.status(500).json({
      message: "Lỗi máy chủ nội bộ",
    });
  }
};

export const getDetailUser = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUser = req.user; // Lấy từ middleware checkUserPermission

    // Kiểm tra ID có hợp lệ không (MongoDB ObjectId)
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        message: "ID không hợp lệ",
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        message: "Không tìm thấy người dùng",
      });
    }

    // Middleware checkUserPermission đã xử lý quyền:
    // - Admin (role = 1) có thể xem tất cả
    // - Customer (role = 3) chỉ xem được chính mình (đã kiểm tra trong middleware)
    // - Seller (role = 2) đã bị chặn ở middleware

    return res.status(200).json({
      message: "Lấy chi tiết người dùng thành công",
      data: user,
    });
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết người dùng:", error);
    return res.status(500).json({
      message: "Lỗi máy chủ nội bộ",
      error: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const currentUser = req.user;
    const { userName, email, phone, image, address, password, status, role } =
      req.body;

    // 1. Tạo object chứa các trường cần cập nhật
    const updateData = {};

    // 2. Validate và cập nhật từng trường
    if (userName) {
      if (typeof userName !== "string" || userName.length > 100) {
        return res.status(400).json({
          message: "Tên người dùng không hợp lệ (tối đa 100 ký tự)",
        });
      }
      updateData.userName = userName.trim();
    }

    if (email) {
      if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
        return res.status(400).json({
          message: "Email không hợp lệ",
        });
      }
      // Kiểm tra email đã tồn tại chưa (trừ chính user đó)
      const emailExists = await User.findOne({
        email: email.trim().toLowerCase(),
        _id: { $ne: currentUser._id },
      });
      if (emailExists) {
        return res.status(400).json({
          message: "Email này đã được sử dụng",
        });
      }
      updateData.email = email.trim().toLowerCase();
    }

    if (phone) {
      if (!/^[0-9]{10,15}$/.test(phone)) {
        return res.status(400).json({
          message: "Số điện thoại phải từ 10 đến 15 chữ số",
        });
      }
      updateData.phone = phone;
    }

    if (image) {
      if (!/^https?:\/\/[^\s$.?#].[^\s]*$/.test(image)) {
        return res.status(400).json({
          message: "URL ảnh không hợp lệ",
        });
      }
      updateData.image = image;
    }

    if (address) {
      if (typeof address !== "string" || address.length > 255) {
        return res.status(400).json({
          message: "Địa chỉ không hợp lệ (tối đa 255 ký tự)",
        });
      }
      updateData.address = address.trim();
    }

    if (password) {
      if (typeof password !== "string" || password.length < 7) {
        return res.status(400).json({
          message: "Mật khẩu phải có ít nhất 7 ký tự",
        });
      }
      updateData.password = await bcryptjs.hash(password, 10);
    }

    // 3. Cập nhật các trường đặc biệt (chỉ admin mới được cập nhật)
    if (currentUser.role === 1) {
      if (status) updateData.status = status;
      if (role) {
        return res.status(403).json({
          message: "Admin không được cập nhật vai trò của mình",
        });
      }
    } else if (currentUser.role === 3) {
      // Customer không được cập nhật status và role
      if (status || role) {
        return res.status(403).json({
          message: "Bạn không có quyền cập nhật trạng thái và vai trò",
        });
      }
    }

    // 4. Kiểm tra xem có dữ liệu nào để cập nhật không
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        message: "Vui lòng cung cấp ít nhất một thông tin để cập nhật",
      });
    }

    // 5. Thực hiện cập nhật
    const updatedUser = await User.findByIdAndUpdate(
      currentUser._id,
      updateData,
      { new: true, runValidators: true }
    );

    // 6. Trả về kết quả
    return res.status(200).json({
      message: "Cập nhật thông tin thành công",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật thông tin:", error);
    return res.status(500).json({
      message: "Đã xảy ra lỗi. Vui lòng thử lại sau",
      error: error.message,
    });
  }
};

export const updateUserByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUser = req.user;
    const { userName, email, phone, image, address, password, status, role } =
      req.body;

    // 1. Kiểm tra ID hợp lệ
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        message: "ID không hợp lệ",
      });
    }

    // 2. Kiểm tra user có tồn tại không
    const userToUpdate = await User.findById(id);
    if (!userToUpdate) {
      return res.status(404).json({
        message: "Không tìm thấy người dùng",
      });
    }

    // 3. Kiểm tra quyền cập nhật
    if (userToUpdate.role === 1) {
      return res.status(403).json({
        message: "Không thể cập nhật thông tin của admin khác",
      });
    }

    // 4. Tạo object chứa các trường cần cập nhật
    const updateData = {};

    // 5. Validate và cập nhật từng trường
    if (userName) {
      if (typeof userName !== "string" || userName.length > 100) {
        return res.status(400).json({
          message: "Tên người dùng không hợp lệ (tối đa 100 ký tự)",
        });
      }
      updateData.userName = userName.trim();
    }

    if (email) {
      if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
        return res.status(400).json({
          message: "Email không hợp lệ",
        });
      }
      // Kiểm tra email đã tồn tại chưa (trừ chính user đó)
      const emailExists = await User.findOne({
        email: email.trim().toLowerCase(),
        _id: { $ne: id },
      });
      if (emailExists) {
        return res.status(400).json({
          message: "Email này đã được sử dụng",
        });
      }
      updateData.email = email.trim().toLowerCase();
    }

    if (phone) {
      if (!/^[0-9]{10,15}$/.test(phone)) {
        return res.status(400).json({
          message: "Số điện thoại phải từ 10 đến 15 chữ số",
        });
      }
      updateData.phone = phone;
    }

    if (image) {
      if (!/^https?:\/\/[^\s$.?#].[^\s]*$/.test(image)) {
        return res.status(400).json({
          message: "URL ảnh không hợp lệ",
        });
      }
      updateData.image = image;
    }

    if (address) {
      if (typeof address !== "string" || address.length > 255) {
        return res.status(400).json({
          message: "Địa chỉ không hợp lệ (tối đa 255 ký tự)",
        });
      }
      updateData.address = address.trim();
    }

    if (password) {
      if (typeof password !== "string" || password.length < 7) {
        return res.status(400).json({
          message: "Mật khẩu phải có ít nhất 7 ký tự",
        });
      }
      updateData.password = await bcryptjs.hash(password, 10);
    }

    // 6. Cập nhật các trường đặc biệt
    if (status) updateData.status = status;
    if (role) {
      // Chỉ cho phép cập nhật role thành 2 hoặc 3
      if (role !== 2 && role !== 3) {
        return res.status(400).json({
          message: "Vai trò không hợp lệ",
        });
      }
      updateData.role = role;
    }

    // 7. Kiểm tra xem có dữ liệu nào để cập nhật không
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        message: "Vui lòng cung cấp ít nhất một thông tin để cập nhật",
      });
    }

    // 8. Thực hiện cập nhật
    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    // 9. Trả về kết quả
    return res.status(200).json({
      message: "Cập nhật thông tin người dùng thành công",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật thông tin:", error);
    return res.status(500).json({
      message: "Đã xảy ra lỗi. Vui lòng thử lại sau",
      error: error.message,
    });
  }
};
