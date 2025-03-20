import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
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
    default: 1,
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

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: {
      type: [cartItemSchema],
      default: [],
    },
    totalPrice: { // Tổng giá trị giỏ hàng trước giảm giá
      type: Number,
      default: 0,
      min: 0,
    },
    totalSalePrice: { // Tổng giá trị sau giảm giá
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Tính toán totalPrice và totalSalePrice trước khi save
cartSchema.pre("save", function (next) {
  const cart = this;

  // Tính tổng giá trị dựa trên items
  cart.totalPrice = cart.items.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  cart.totalSalePrice = cart.items.reduce((sum, item) => {
    return sum + item.salePrice * item.quantity;
  }, 0);

  // Làm tròn 2 chữ số sau dấu phẩy
  cart.totalPrice = Number(cart.totalPrice.toFixed(2));
  cart.totalSalePrice = Number(cart.totalSalePrice.toFixed(2));

  next();
});



export default mongoose.model("Cart", cartSchema);
