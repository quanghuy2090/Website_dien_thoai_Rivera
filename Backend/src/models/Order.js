import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderItems: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["COD", "Credit Card", "Bank Transfer"],
    },
    paymentStatus: {
      type: String,
      required: true,
      enum: ["Chưa thanh toán", "Đã thanh toán"],
      default: "Chưa thanh toán",
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    orderStatus: {
      type: String,
      required: true,
      enum: ["Chưa xác nhận", "Đã xác nhận", "Đang giao hàng", "Đã giao hàng", "Hoàn thành", "Đã huỷ"],
      default: "Chưa xác nhận",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Order", orderSchema);
