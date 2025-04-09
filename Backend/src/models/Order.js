import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
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
    min: 0,
  },
  salePrice: {
    type: Number,
    required: true,
    min: 0,
  },
  color: {
    type: String,
    required: true,
  },
  capacity: {
    type: String,
    required: true,
  },
});

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: {
      type: [orderItemSchema],
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    shippingAddress: {
      userName: {
        type: String,
        maxlength: 100,
        trim: true,
      },
      phone: {
        type: String,
        match: [/^[0-9]{10,15}$/, "Số điện thoại phải từ 10 đến 15 chữ số"],
      },
      street: {
        type: String,
        maxlength: 255,
        trim: true,
      },
      ward: {
        type: String,
        required: true,
        maxlength: 100,
        trim: true,
      },
      district: {
        type: String,
        required: true,
        maxlength: 100,
        trim: true,
      },
      city: {
        type: String,
        required: true,
        maxlength: 100,
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
        "Đã nhận hàng",
        "Hoàn thành",
        "Đã hủy",
      ],
      default: "Chưa xác nhận",
    },
    deliveredAt: {
      type: Date,
      default: null, // Thời điểm chuyển sang "Đã giao hàng"
    },
    completedAt: {
      type: Date,
      default: null,
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "Online"],
      required: true,
    },
    paymentStatus: {
      type: String,
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
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    cancelHistory: [
      {
        cancelledAt: {
          type: Date,
          default: Date.now, // Thời điểm hủy
        },
        cancelReason: {
          type: String,
          maxlength: 500,
          trim: true,
          required: true, // Bắt buộc phải có lý do hủy
        },
        cancelledBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true, // Người thực hiện hủy
        },
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Middleware pre('save') chỉ cập nhật name/phone, không tính totalAmount nữa

orderSchema.pre("save", async function (next) {
  const order = this;
  // Điền name và phone từ User nếu thiếu

  if (!order.shippingAddress.userName || !order.shippingAddress.phone) {
    const user = await mongoose.model("User").findById(order.userId).exec();
    if (user) {
      if (!order.shippingAddress.userName)
        order.shippingAddress.userName = user.name;
      if (!order.shippingAddress.phone)
        order.shippingAddress.phone = user.phone;
    }
  }
  next();
});

// Index để tối ưu hóa tìm kiếm
orderSchema.index({ userId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ "cancelHistory.cancelledAt": -1 });
orderSchema.index({ updatedBy: 1 });

export default mongoose.model("Order", orderSchema);
