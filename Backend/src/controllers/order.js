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
      return res
        .status(400)
        .json({ message: "Giỏ hàng trống, không thể đặt hàng" });
    }

    // Tính tổng tiền của đơn hàng
    const totalPrice = cart.items.reduce((total, item) => {
      return total + item.productId.price * item.quantity;
    }, 0);

    // Tạo đơn hàng mới từ giỏ hàng
    const newOrder = new Order({
      userId,
      orderItems: cart.items.map((item) => ({
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



// Cập nhật trạng thái đơn hàng
export const updateOrder = async (req, res) => {
  const { orderId } = req.params;
  const { orderStatus, cancellationReason, cancelledByAdmin } = req.body;

  try {
    // Kiểm tra xem đơn hàng có tồn tại không
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    }


    // Các trạng thái hợp lệ
    const validStatuses = [
      "Chưa xác nhận",
      "Đã xác nhận",
      "Đang giao hàng",
      "Đã giao hàng",
      "Đã nhận hàng",
      "Hoàn thành",
      "Đã huỷ",
    ];

    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({
        message: "Trạng thái đơn hàng không hợp lệ",
      });
    }

    // Cập nhật trạng thái đơn hàng
    order.orderStatus = orderStatus;

    if (orderStatus === "Đã huỷ") {
      // Nếu trạng thái là huỷ đơn, lưu lý do huỷ
      order.cancellationReason = cancellationReason || "Không có lý do";
      order.cancelledByAdmin = cancelledByAdmin || null; // Ghi nhận admin huỷ nếu có
    }

    if(orderStatus === "Đã giao hàng" ){
        order.orderStatus = "Đã giao hàng";
        order.paymentStatus = "Đã thanh toán";
    }

    // Nếu trạng thái là "Đã nhận hàng", tự động chuyển thành "Hoàn thành"
    if (orderStatus === "Đã nhận hàng") {
      order.orderStatus = "Hoàn thành";
    }

    // Nếu không phải trạng thái huỷ, lưu đơn hàng và trả về kết quả
    await order.save();

    return res.status(200).json({
      message: "Cập nhật trạng thái đơn hàng thành công",
      order,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

