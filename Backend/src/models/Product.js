import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
      minLength: 3,
    },
    price: {
      type: Number,
      require: true,
      min: 1,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
      require: true,
    },
    // Trang thai san pham: active(bật), banned(ẩn)
    status: {
      type: String,
      enum: ["active", "banned"],
      default: "active",
    },
    // San pham hot hay khong: yes(hot), no(khong hot)
    is_hot: {
      type: String,
      enum: ["yes", "no"],
      default: "no",
    },
    // Số lượng trong kho
    stock: {
      type: Number,
      require: true,
      min: 0,
    },
    color: {
      type: String,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      require: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// them text index tim kiem theo name
productSchema.index({ name: "text" });

export default mongoose.model("Product", productSchema);
