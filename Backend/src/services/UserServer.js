const User = require("../models/UserModel");
const bcryptjs = require("bcryptjs");
const { genneralAccessToken, genneralRefreshToken } = require("./JWTService");

const createUser = (newUser) => {
  return new Promise(async (resolve, reject) => {
    const { name, email, password, confirmPassword, phone } = newUser;
    try {
      const checkUser = await User.findOne({
        email: email,
      });
      if (checkUser !== null) {
        resolve({
          status: "OK",
          message: "The email is already",
        });
      }
      const hash = bcryptjs.hashSync(password, 10);
      console.log(hash);
      const createdUser = await User.create({
        name,
        email,
        password: hash,
        confirmPassword: hash,
        phone,
      });
      if (createdUser) {
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: createdUser,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

const loginUser = (userLogin) => {
  return new Promise(async (resolve, reject) => {
    const { name, email, password, confirmPassword, phone } = userLogin; // Chỉ cần email và password cho login
    try {
      // Tìm user theo email
      const checkUser = await User.findOne({ email });
      if (!checkUser) {
        return resolve({
          status: "ERROR",
          message: "The user is not defined",
        });
      }

      // So sánh mật khẩu
      const comparePassword = bcryptjs.compareSync(
        password,
        checkUser.password
      );
      if (!comparePassword) {
        return resolve({
          status: "ERROR",
          message: "The password or user is incorrect",
        });
      }
      const access_token = await genneralAccessToken({
        id: checkUser.id,
        isAdmin: checkUser.isAdmin,
      });
      const refresh_token = await genneralRefreshToken({
        id: checkUser.id,
        isAdmin: checkUser.isAdmin,
      });
      // Nếu thành công
      return resolve({
        status: "SUCCESS",
        message: "Login successful",
        data: checkUser,
        access_token,
        refresh_token,
      });
    } catch (error) {
      // Xử lý lỗi
      return reject({
        status: "ERROR",
        message: "An error occurred during login",
        error: error.message,
      });
    }
  });
};

const updateUser = async (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Tìm user theo id
      const checkUser = await User.findOne({ _id: id });
      // Nếu user không tồn tại
      if (checkUser === null) {
        resolve({
          status: "Ok",
          message: "The user is not defined",
        });
      }
      // Cập nhật user
      const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });

      console.log("updateUser", updatedUser);

      // Trả về thành công
      resolve({
        status: "ok",
        message: "success",
        data: updatedUser,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteUser = async (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Tìm user theo id
      const checkUser = await User.findOne({ _id: id });
      // Nếu user không tồn tại
      if (checkUser === null) {
        resolve({
          status: "Ok",
          message: "The user is not defined",
        });
      }
      await User.findByIdAndDelete(id);
      // Trả về thành công
      resolve({
        status: "Ok",
        message: "Delete user success",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllUser = async (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const allUser = await User.find();
      // Trả về thành công
      resolve({
        status: "Ok",
        message: "GetAll user success",
        data: allUser,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getDetailsUser = async (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Tìm user theo id
      const user = await User.findOne({ _id: id });
      // Nếu user không tồn tại
      if (user === null) {
        resolve({
          status: "Ok",
          message: "The user is not defined",
        });
      }
      // Trả về thành công
      resolve({
        status: "Ok",
        message: "Get Detail user success",
        data: user,
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  getAllUser,
  getDetailsUser,
};
