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
    const users = await User.find();
    if (!users || users.length === 0) {
      return res.status(404).json({
        message: "ko co user"
      });
    }
    return res.status(200).json({
      data: users,
    })
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
}



export const getDetailUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        message: "ko co user"
      })
    }
    return res.status(200).json({
      message: "lay chi tiet user thanh cong",
      data: user
    })
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!["active", "banned"].includes(status)) {
      return res.status(400).json({ message: "Trang thai ko hop le" });
    }
    const updateUser = await User.findByIdAndUpdate(id, { status }, { new: true })
    if (!updateUser) {
      return res.status(404).json({ message: "user ko ton tai" });
    }
    res.status(200).json({ message: "Cập nhật trạng thái thành công", user: updateUser })

  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi. Vui lòng thử lại sau." });
  }
};

export const updateRole = async (req, res) => {
  try {
    const { id } = req.params;

    const { role } = req.body;

    if (![1, 2, 3].includes(role)) {
      return res.status(400).json({ message: "Vai trò không hợp lệ" })
    }
    const user = await User.findByIdAndUpdate(id, { role }, { new: true });

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    res.status(200).json({
      message: "Cập nhật vai trò thành công",
      user,
    })
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi. Vui lòng thử lại sau." });
  }
};


