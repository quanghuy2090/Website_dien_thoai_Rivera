import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        variantId: {
          type: mongoose.Schema.Types.ObjectId,
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
          min: 1,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    shippingAddress: {
      name: {
        type: String,
        // required: true,
        maxlength: 100, // Tên người nhận hàng
        trim: true,
      },
      phone: {
        type: String,
        // required: true,
        match: [/^[0-9]{10,15}$/, "Số điện thoại phải từ 10 đến 15 chữ số"], // Số điện thoại
      },
      street: {
        type: String,
        // required: true,
        maxlength: 255, // Địa chỉ cụ thể (số nhà, đường)
        trim: true,
      },
      ward: {
        type: String,
        required: true,
        maxlength: 100, // Phường/xã
        trim: true,
      },
      district: {
        type: String,
        required: true,
        maxlength: 100, // Quận/huyện
        trim: true,
      },
      city: {
        type: String,
        required: true,
        maxlength: 100, // Tỉnh/thành phố
        trim: true,
      },
    },
    status: {
      type: String,
      enum: [
        "Chưa xác nhận",
        "Đã xác nhận",
        "Đang giao hàng",
        "Đã giao hàng",
        "Hoàn thành",
        "Đã huỷ",
      ],
      default: "Chưa xác nhận",
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "Online"],
      required: true,
    },
    paymentStatus: {
      type: String,
      required: true,
      enum: ["Chưa thanh toán", "Đã thanh toán", "Không đạt"],
      default: "Chưa thanh toán",
    },

    cancelReason: {
      type: String,
      maxlength: 500,
      trim: true,
      default: null,
    },
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Index để tối ưu hóa tìm kiếm theo userId và status
orderSchema.index({ userId: 1 });
orderSchema.index({ status: 1 });

export default mongoose.model("Order", orderSchema);
