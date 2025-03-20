import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Cart from "../models/Cart.js";
import User from "../models/User.js"; // Import model User để lấy thông tin

export const createOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { shippingAddress, paymentMethod } = req.body;

    // Bước 1: Lấy giỏ hàng của user
    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "name variants",
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        message: "Giỏ hàng trống",
      });
    }

    // Bước 2: Kiểm tra và chuẩn bị dữ liệu cho order items
    const orderItems = [];
    for (const cartItem of cart.items) {
      const product = cartItem.productId;
      const variant = product.variants.find(v => 
        v._id.toString() === cartItem.variantId.toString()
      );

      if (!variant) {
        return res.status(400).json({
          message: `Không tìm thấy variant cho sản phẩm ${product.name}`,
        });
      }

      if (variant.stock < cartItem.quantity) {
        return res.status(400).json({
          message: `Sản phẩm ${product.name} (${variant.color}/${variant.capacity}) không đủ hàng`,
        });
      }

      orderItems.push({
        productId: product._id,
        variantId: variant._id,
        quantity: cartItem.quantity,
        price: variant.price,
        salePrice: variant.salePrice,
        color: cartItem.color,
        capacity: cartItem.capacity,
      });
    }

    // Bước 3: Tính totalAmount
    const totalAmount = orderItems.reduce((sum, item) => {
      return sum + (item.salePrice || 0) * (item.quantity || 0);
    }, 0);

    // Bước 4: Lấy thông tin user để điền name và phone nếu thiếu
    const user = await User.findById(userId).select("userName phone");
    const finalShippingAddress = {
      ...shippingAddress,
      userName: shippingAddress.userName || user.userName,
      phone: shippingAddress.phone || user.phone,
    };

    // Bước 5: Tạo đơn hàng
    const order = new Order({
      userId,
      items: orderItems,
      shippingAddress: finalShippingAddress,
      paymentMethod,
      status: "Chưa xác nhận",
      paymentStatus: "Chưa thanh toán",
      totalAmount: Number(totalAmount.toFixed(2)),
    });

    // Bước 6: Cập nhật số lượng tồn kho
    for (const item of orderItems) {
      await Product.updateOne(
        { _id: item.productId, "variants._id": item.variantId },
        { $inc: { "variants.$.stock": -item.quantity } }
      );
    }

    // Bước 7: Lưu đơn hàng và xóa giỏ hàng
    await order.save();
    await Cart.findOneAndUpdate(
      { userId },
      { $set: { items: [], totalPrice: 0, totalSalePrice: 0 } }
    );

    // Bước 8: Populate thêm thông tin để trả về đầy đủ
    const populatedOrder = await Order.findById(order._id)
      .populate("userId", "name email") // Populate thông tin user
      .populate("items.productId", "name"); // Populate tên sản phẩm

    // Bước 9: Trả về tất cả thông tin đơn hàng
    return res.status(201).json({
      message: "Tạo đơn hàng thành công",
      order: populatedOrder, // Trả về toàn bộ thông tin đơn hàng đã populate
    });

  } catch (error) {
    return res.status(500).json({
      name: error.name,
      message: error.message,
    });
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
      "Đã hủy",
    ];

    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({
        message: "Trạng thái đơn hàng không hợp lệ",
      });
    }

    // Cập nhật trạng thái đơn hàng
    order.orderStatus = orderStatus;

    if (orderStatus === "Đã hủy") {
      // Nếu trạng thái là huỷ đơn, lưu lý do huỷ
      order.cancellationReason = cancellationReason || "Không có lý do";
      order.cancelledByAdmin = cancelledByAdmin || null; // Ghi nhận admin huỷ nếu có
    }

    if (orderStatus === "Đã giao hàng") {
      order.orderStatus = "Đã giao hàng";
      order.paymentStatus = "Đã thanh toán";
    }

    // Nếu trạng thái là "Đã nhận hàng", tự động chuyển thành "Hoàn thành"
    if (orderStatus === "Đã nhận hàng") {
      order.orderStatus = "Hoàn thành";
    }
    //Nếu đang hủy không thể chuyển trạng thái
    if (order.orderStatus === "Đã hủy") {
      return res.status(400).json({
        message: "Đơn hàng  Đã hủy, không thể cập nhật trạng thái",
      });
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

// Hủy đơn hàng
export const removeOrder = async (req, res) => {
  const { orderId } = req.params;
  const { cancellationReason } = req.body; // Lý do huỷ đơn hàng

  try {
    // Kiểm tra xem đơn hàng có tồn tại không
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    }

    // Kiểm tra trạng thái đơn hàng có thể huỷ hay không
    if (
      order.orderStatus !== "Chưa xác nhận" &&
      order.orderStatus !== "Đã xác nhận"
    ) {
      return res.status(400).json({
        message:
          "Đơn hàng không thể huỷ khi không ở trạng thái 'Chưa xác nhận' hoặc 'Đã xác nhận'.",
      });
    }

    // Cập nhật trạng thái đơn hàng thành "Đã huỷ"
    order.orderStatus = "Đã hủy";

    // Lưu lý do huỷ nếu có
    order.cancellationReason = cancellationReason || "Không có lý do";

    // Lưu đơn hàng sau khi cập nhật
    await order.save();

    return res.status(200).json({
      message: "Đơn hàng đã được huỷ thành công",
      order,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

//Danh sách đơn hàng Admin
export const getAllOrders = async (req, res) => {
  try {
    // Truy vấn tất cả đơn hàng, sắp xếp theo thời gian mới nhất
    const orders = await Order.find()
      .populate("userId", "userName email phone address")
      .populate("orderItems.productId", "name price images") // Lấy thông tin user đặt đơn
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Lấy danh sách đơn hàng thành công!",
      success: true,

      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Danh sách đơn hàng theo User
export const getAllOrdersByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    // Tìm tất cả đơn hàng theo userId và populate để lấy thông tin user
    const orders = await Order.find({ userId })
      .populate("userId", "userName email phone address")
      .populate("orderItems.productId", "name price images");

    if (!orders || orders.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Không có đơn hàng nào" });
    }

    return res.status(200).json({
      message: "Lấy danh sách đơn hàng thành công!",

      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Lỗi lấy đơn hàng theo user:", error);
    return res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

//Chi tiết đơn hàng
export const getOrderDetails = async (req, res) => {
  const { orderId } = req.params;

  try {
    // Tìm đơn hàng theo ID, populate để lấy thông tin user và product
    const order = await Order.findById(orderId)
      .populate("userId", "userName email phone address") // Lấy thông tin người mua
      .populate("orderItems.productId", "name price images"); // Lấy thông tin sản phẩm

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Đơn hàng không tồn tại" });
    }

    return res.status(200).json({
      message: "Lấy chi tiết đơn hàng thành công!",
      success: true,
      order,
    });
  } catch (error) {
    console.error("Lỗi lấy chi tiết đơn hàng:", error);
    return res.status(500).json({ success: false, message: "Lỗi server" });
  }
};
