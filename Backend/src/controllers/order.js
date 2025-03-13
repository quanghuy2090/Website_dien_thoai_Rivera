import Order from "../models/Order.js"; // Model Order
import Cart from "../models/Cart.js"; // Model Cart
import Product from "../models/Product.js"; // Model Product

export const createOrder = async (req, res) => {
  try {
    // Bước 1: Lấy thông tin user từ middleware checkUserPermission
    const user = req.user;
    const userId = user._id;

    // Bước 2: Lấy thông tin giỏ hàng của user
    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "variants",
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        message: "Giỏ hàng trống, không thể tạo đơn hàng",
      });
    }

    // Bước 3: Lấy thông tin địa chỉ giao hàng từ body request
    const { shippingAddress } = req.body;
    if (!shippingAddress) {
      return res.status(400).json({
        message: "Vui lòng cung cấp địa chỉ giao hàng",
      });
    }

    // Bước 4: Tạo danh sách items cho đơn hàng và tính tổng tiền
    let totalAmount = 0;
    const orderItems = [];

    for (const cartItem of cart.items) {
      const product = cartItem.productId;
      const variant = product.variants.find((v) =>
        v._id.equals(cartItem.variantId)
      );

      if (!variant) {
        return res.status(400).json({
          message: `Không tìm thấy biến thể cho sản phẩm ${product.name}`,
        });
      }

      // Kiểm tra số lượng tồn kho
      if (variant.stock < cartItem.quantity) {
        return res.status(400).json({
          message: `Sản phẩm ${product.name} (biến thể ${variant.sku}) không đủ hàng`,
        });
      }

      const itemTotal = variant.price * cartItem.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        productId: cartItem.productId,
        variantId: cartItem.variantId,
        quantity: cartItem.quantity,
        price: variant.price,
      });
    }

    // Bước 5: Tạo đơn hàng mới với thanh toán COD
    const newOrder = new Order({
      userId,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod: "COD",
      paymentStatus: "Chưa thanh toán", // COD mặc định chưa thanh toán
      status: "Chưa xác nhận", // Trạng thái ban đầu
    });

    // Bước 6: Lưu đơn hàng
    const savedOrder = await newOrder.save();

    // Bước 7: Cập nhật số lượng tồn kho và xóa giỏ hàng
    for (const item of orderItems) {
      await Product.updateOne(
        { _id: item.productId, "variants._id": item.variantId },
        { $inc: { "variants.$.stock": -item.quantity } }
      );
    }

    // Xóa giỏ hàng sau khi tạo đơn hàng thành công
    await Cart.findOneAndUpdate(
      { userId },
      { $set: { items: [] } },
      { new: true }
    );

    // Bước 8: Trả về kết quả
    return res.status(201).json({
      message: "Đơn hàng đã được tạo thành công",
      order: savedOrder,
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
      .populate("userId", "userName email phone address").populate("orderItems.productId", "name price images") // Lấy thông tin user đặt đơn
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
    const orders = await Order.find({ userId }).populate(
      "userId",
      "userName email phone address"
    ).populate("orderItems.productId", "name price images");

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
      return res.status(404).json({ success: false, message: "Đơn hàng không tồn tại" });
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

