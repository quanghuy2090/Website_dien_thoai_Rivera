import User from "../models/User.js";
import { singInValidate, singUpValidate } from "../validation/user.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const { SECRET_CODE } = process.env;

export const signUp = async (req, res) => {
  try {
    //Buoc 1: Validate du lieu nguoi dung
    const { error } = singUpValidate.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({
        message: errors,
      });
    }
    //Buoc 2: Kiem tra xem email da ton tai hay chua
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      return res.status(400).json({
        message: "Email nay da ton tai ",
      });
    }

    // Buoc 3: Ma hoa password

    const hashedPassword = await bcryptjs.hash(req.body.password, 10);

    //Buoc 4: khoi tao user trong db
    const user = await User.create({
      ...req.body,
      password: hashedPassword,
    });

    // buoc 5:Thong bao cho nguoi dung dang ki thanh cong
    //xoa mat khau di
    user.password = undefined;
    return res.status(200).json({
      message: "Dang ki thanh cong Account",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      name: error.name,
      message: error.message,
    });
  }
};

export const signIn = async (req, res) => {
  try {
    // Buoc 1: Validate data tu phia client
    const { error } = singInValidate.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({
        message: errors,
      });
    }

    // Buoc 2: Kiem tra email da ton tai hay chua
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        message: "Email nay chua duoc dang ky, ban co muon dang ky khong",
      });
    }
    if (user.status !== "active") {
      return res
        .status(403)
        .json({ message: "Tài khoản của bạn đã bị vô hiệu hóa" });
    }

    //Buoc 3: Kiem tra password
    const isMatch = await bcryptjs.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Mat khau khong dung",
      });
    }

    //Buoc 4: Tao JWT
    const accessToken = jwt.sign({ _id: user._id }, SECRET_CODE, {
      expiresIn: "1d",
    });

    //Buoc 5: tra ra thong bao cho nguoi dung
    user.password = undefined;
    return res.status(200).json({
      message: "Dang nhap thanh cong",
      user,
      accessToken,
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

export const remove = async (req, res) => {
  try {
    const data = await User.findByIdAndDelete(req.params.id);
    if (!data) {
      return res.status(404).json({
        message: "Xoa user khong thanh cong",
      });
    }
    return res.status(200).json({
      message: "Xoa user thanh cong",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
};

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


