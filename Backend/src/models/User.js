import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      maxlength: 100,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      match: [/^[0-9]{10,15}$/, "Số điện thoại phải từ 10 đến 15 chữ số"],
      default: null,
    },
    image: {
      type: String,
      default: null,
      match: [/^https?:\/\/[^\s$.?#].[^\s]*$/, "URL ảnh không hợp lệ"],
    },
    address: {
      type: String,
      maxlength: 255,
      default: null,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 7,
    },
    status: {
      type: String,
      enum: ["active", "banned"],
      default: "active",
    },
    role: {
      type: Number,
      enum: [1, 2, 3, 4], // 1: Admin, 2: Seller, 3: Customer, 4: Shipper
      default: 3,
    },
    googleLogin: { type: Boolean, default: false },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // ==== Trường riêng cho shipper ====
    isShipperAvailable: {
      type: Boolean,
      default: true, // true: có thể giao hàng, false: đang nghỉ
    },
    startedShipperAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model("User", userSchema);
