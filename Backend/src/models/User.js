import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Kiểm tra định dạng email
    },
    phone: {
      type: String,
      match: /^[0-9]{10,15}$/, // Giới hạn số điện thoại từ 10 đến 15 số
      default: null,
    },
    image: {
      type: String,
      default: null,
    },
    address: {
      type: String,
      maxlength: 255,
      default: null,
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
    },
    status: {
      type: String,
      enum: ["active", "banned"],
      default: "active",
    },
    role: {
      type: Number,
      enum: [1, 2, 3], // 1: Admin, 2: Seller, 3: Customer
      default: 3,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
