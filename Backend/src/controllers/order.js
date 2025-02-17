import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

// Tạo đơn hàng từ giỏ hàng
export const createOrder = async (req, res) => {
  const { userId, paymentMethod, shippingAddress } = req.body;

  try {
    // Lấy giỏ hàng của user
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Giỏ hàng trống, không thể đặt hàng" });
    }

    // Tính tổng tiền của đơn hàng
    const totalPrice = cart.items.reduce((total, item) => {
      return total + item.productId.price * item.quantity;
    }, 0);

    // Tạo đơn hàng mới từ giỏ hàng
    const newOrder = new Order({
      userId,
      orderItems: cart.items.map(item => ({
        productId: item.productId._id,
        quantity: item.quantity,
        price: item.productId.price,
      })),
      shippingAddress,
      paymentMethod,
      totalPrice,
      orderStatus: "Chưa xác nhận",
    });

    // Lưu đơn hàng vào database
    await newOrder.save();

    // Xóa giỏ hàng sau khi tạo đơn hàng thành công
    await Cart.findOneAndDelete({ userId });

    // Trả về thông tin đơn hàng
    res.status(201).json({
      message: "Đơn hàng đã được tạo thành công",
      order: newOrder,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
