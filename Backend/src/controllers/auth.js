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
    // Lấy query params để hỗ trợ phân trang động
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .limit(limit)
      .skip(skip)
      .populate("updatedBy", "userName email"); // Populate thông tin người cập nhật

    if (users.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy người dùng",
      });
    }

    const totalUsers = await User.countDocuments(); // Tổng số user để hỗ trợ phân trang
    return res.status(200).json({
      message: "Danh sách người dùng",
      data: {
        users,
        pagination: {
          total: totalUsers,
          page,
          limit,
          totalPages: Math.ceil(totalUsers / limit),
        },
      },
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách người dùng:", error);
    return res.status(500).json({
      message: "Lỗi máy chủ nội bộ",
      error: error.message, // Thêm chi tiết lỗi
    });
  }
};

export const getDetailUser = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUser = req.user;

    // Kiểm tra ID có hợp lệ không
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        message: "ID không hợp lệ",
      });
    }

    // Kiểm tra quyền: Customer chỉ xem được chính mình
    if (currentUser.role === 3 && currentUser._id.toString() !== id) {
      return res.status(403).json({
        message: "Bạn chỉ có thể xem thông tin của chính mình",
      });
    }

    const user = await User.findById(id).populate(
      "updatedBy",
      "userName email"
    );
    if (!user) {
      return res.status(404).json({
        message: "Không tìm thấy người dùng",
      });
    }

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

    const updateData = {};

    if (userName) {
      if (typeof userName !== "string" || userName.length > 100) {
        return res
          .status(400)
          .json({ message: "Tên người dùng không hợp lệ (tối đa 100 ký tự)" });
      }
      updateData.userName = userName.trim();
    }

    if (email) {
      if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
        return res.status(400).json({ message: "Email không hợp lệ" });
      }
      updateData.email = email.trim().toLowerCase();
    }

    if (phone !== undefined) {
      if (phone === null) updateData.phone = null;
      else if (!/^[0-9]{10,15}$/.test(phone)) {
        return res
          .status(400)
          .json({ message: "Số điện thoại phải từ 10 đến 15 chữ số" });
      } else updateData.phone = phone;
    }

    if (image !== undefined) {
      if (image === null) updateData.image = null;
      else if (!/^https?:\/\/[^\s$.?#].[^\s]*$/.test(image)) {
        return res.status(400).json({ message: "URL ảnh không hợp lệ" });
      } else updateData.image = image;
    }

    if (address) {
      if (typeof address !== "string" || address.length > 255) {
        return res
          .status(400)
          .json({ message: "Địa chỉ không hợp lệ (tối đa 255 ký tự)" });
      }
      updateData.address = address.trim();
    }

    if (password) {
      if (typeof password !== "string" || password.length < 7) {
        return res
          .status(400)
          .json({ message: "Mật khẩu phải có ít nhất 7 ký tự" });
      }
      updateData.password = await bcryptjs.hash(password, 10);
    }

    if (currentUser.role === 1) {
      if (status) {
        if (!["active", "banned"].includes(status)) {
          return res.status(400).json({ message: "Trạng thái không hợp lệ" });
        }
        updateData.status = status;
      }
      if (role) {
        if (![1, 2, 3].includes(role)) {
          return res.status(400).json({ message: "Vai trò không hợp lệ" });
        }
        if (currentUser._id.toString() === req.params.id) {
          return res
            .status(403)
            .json({ message: "Admin không được cập nhật vai trò của mình" });
        }
        updateData.role = role;
      }
    } else if (status || role) {
      return res
        .status(403)
        .json({
          message: "Bạn không có quyền cập nhật trạng thái hoặc vai trò",
        });
    }

    if (Object.keys(updateData).length === 0) {
      return res
        .status(400)
        .json({
          message: "Vui lòng cung cấp ít nhất một thông tin để cập nhật",
        });
    }

    // Ghi lại người thực hiện cập nhật
    updateData.updatedBy = currentUser._id;

    const updatedUser = await User.findByIdAndUpdate(
      currentUser._id,
      updateData,
      { new: true, runValidators: true }
    ).populate("updatedBy", "userName email"); // Populate để lấy thông tin người cập nhật

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
    const currentUser = req.user;
    const userId = req.params.id;
    const { userName, email, phone, image, address, password, status, role } =
      req.body;

    if (currentUser.role !== 1) {
      return res.status(403).json({
        message: "Chỉ admin mới có quyền thực hiện hành động này",
      });
    }

    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({
        message: "Không tìm thấy người dùng",
      });
    }

    if (
      targetUser.role === 1 &&
      targetUser._id.toString() !== currentUser._id.toString()
    ) {
      return res.status(403).json({
        message: "Admin không thể cập nhật thông tin của admin khác",
      });
    }

    const updateData = {};

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
      updateData.email = email.trim().toLowerCase();
    }

    if (phone !== undefined) {
      if (phone === null) updateData.phone = null;
      else if (!/^[0-9]{10,15}$/.test(phone)) {
        return res.status(400).json({
          message: "Số điện thoại phải từ 10 đến 15 chữ số",
        });
      } else updateData.phone = phone;
    }

    if (image !== undefined) {
      if (image === null) updateData.image = null;
      else if (!/^https?:\/\/[^\s$.?#].[^\s]*$/.test(image)) {
        return res.status(400).json({
          message: "URL ảnh không hợp lệ",
        });
      } else updateData.image = image;
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

    if (status) {
      if (!["active", "banned"].includes(status)) {
        return res.status(400).json({
          message: "Trạng thái không hợp lệ",
        });
      }
      if (targetUser._id.toString() === currentUser._id.toString()) {
        return res.status(403).json({
          message: "Admin không được phép thay đổi trạng thái của chính mình",
        });
      }
      updateData.status = status;
      if (status === "banned") {
        updateData.lastToken = null;
      }
    }

    if (role) {
      if (![1, 2, 3].includes(role)) {
        return res.status(400).json({
          message: "Vai trò không hợp lệ",
        });
      }
      if (role === 1) {
        return res.status(403).json({
          message: "Không thể chuyển vai trò thành admin",
        });
      }
      if (targetUser.role === 1) {
        return res.status(403).json({
          message: "Không thể thay đổi vai trò của admin",
        });
      }
      updateData.role = role;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        message: "Vui lòng cung cấp ít nhất một thông tin để cập nhật",
      });
    }

    // Ghi lại người thực hiện cập nhật
    updateData.updatedBy = currentUser._id;

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).populate("updatedBy", "userName email"); // Populate để lấy thông tin người cập nhật

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
