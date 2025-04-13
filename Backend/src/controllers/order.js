import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Cart from "../models/Cart.js";
import User from "../models/User.js";
import mongoose from "mongoose";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const { VNPAY_TMN_CODE, VNPAY_HASH_SECRET, VNPAY_URL, VNPAY_RETURN_URL } =
  process.env;

export const createOrderCOD = async (req, res) => {
  try {
    const userId = req.user._id;
    const { shippingAddress } = req.body;

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
      const variant = product.variants.find(
        (v) => v._id.toString() === cartItem.variantId.toString()
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
        salePrice:
          variant.salePrice !== undefined ? variant.salePrice : variant.price,
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
      paymentMethod: "COD",
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

export const createOrderOnline = async (req, res) => {
  try {
    // Kiểm tra cấu hình VNPAY
    if (
      !VNPAY_TMN_CODE ||
      !VNPAY_HASH_SECRET ||
      !VNPAY_URL ||
      !VNPAY_RETURN_URL
    ) {
      return res.status(500).json({
        message: "Cấu hình VNPAY không đầy đủ",
      });
    }

    const userId = req.user._id;
    const { shippingAddress } = req.body;

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

    // Bước 2: Chuẩn bị order items
    const orderItems = [];
    for (const cartItem of cart.items) {
      const product = cartItem.productId;
      const variant = product.variants.find(
        (v) => v._id.toString() === cartItem.variantId.toString()
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
        salePrice:
          variant.salePrice !== undefined ? variant.salePrice : variant.price,
        color: cartItem.color,
        capacity: cartItem.capacity,
      });
    }

    // Bước 3: Tính totalAmount
    const totalAmount = orderItems.reduce((sum, item) => {
      return sum + (item.salePrice || 0) * (item.quantity || 0);
    }, 0);

    // Bước 4: Lấy thông tin user
    const user = await User.findById(userId).select("userName phone");
    const finalShippingAddress = {
      ...shippingAddress,
      userName: shippingAddress.userName || user.userName,
      phone: shippingAddress.phone || user.phone,
    };

    // Bước 5: Tạo đơn hàng với Online
    const order = new Order({
      userId,
      items: orderItems,
      shippingAddress: finalShippingAddress,
      paymentMethod: "Online",
      status: "Chưa xác nhận",
      paymentStatus: "Chưa thanh toán",
      totalAmount: Number(totalAmount.toFixed(2)),
    });

    // Bước 6: Tạo URL thanh toán VNPAY
    const vnpParams = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: VNPAY_TMN_CODE,
      vnp_Amount: order.totalAmount * 100,
      vnp_CurrCode: "VND",
      vnp_TxnRef: order._id.toString(),
      vnp_OrderInfo: `Thanh toán đơn hàng ${order._id}`,
      vnp_OrderType: "250000",
      vnp_Locale: "vn",
      vnp_ReturnUrl: VNPAY_RETURN_URL, // Đảm bảo dùng http://localhost:3000/api/order/vnpay_return
      vnp_IpAddr: req.ip || "127.0.0.1",
      vnp_CreateDate: new Date()
        .toISOString()
        .replace(/[-:T]/g, "")
        .slice(0, 14),
    };

    const sortedParams = Object.keys(vnpParams)
      .sort()
      .reduce((result, key) => {
        result[key] = vnpParams[key];
        return result;
      }, {});

    const signData = new URLSearchParams(sortedParams).toString();
    const hmac = crypto.createHmac("sha512", VNPAY_HASH_SECRET);
    const vnp_SecureHash = hmac.update(signData).digest("hex");
    sortedParams.vnp_SecureHash = vnp_SecureHash;

    const vnpUrl = `${VNPAY_URL}?${new URLSearchParams(
      sortedParams
    ).toString()}`;

    // Bước 7: Lưu đơn hàng trước khi redirect
    await order.save();

    // Bước 8: Trả về URL thanh toán
    return res.status(200).json({
      message: "Vui lòng hoàn tất thanh toán",
      paymentUrl: vnpUrl,
      order: order,
    });
  } catch (error) {
    return res.status(500).json({
      name: error.name,
      message: error.message,
    });
  }
};

export const getAllOrder = async (req, res) => {
  try {
    const user = req.user;
    let query = {};
    if (user.role === 3) {
      query = { userId: user._id };
    }

    const orders = await Order.find(query)
      .populate({ path: "userId", select: "userName email phone" })
      .populate({
        path: "items.productId",
        select: "name images short_description variants",
        populate: [
          { path: "variants.color", select: "name" },
          { path: "variants.capacity", select: "value" },
        ],
      })
      .populate({ path: "cancelledBy", select: "userName" }) // Thêm populate cho cancelledBy
      .populate({ path: "cancelHistory.cancelledBy", select: "userName" }) // Populate cho cancelHistory
      .sort({ createdAt: -1 });
    console.log(orders);

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng nào" });
    }

    const orderDetails = orders.map((order) => {
      const items = order.items.map((item) => {
        const product = item.productId || {};
        const variant =
          product.variants?.find((v) => v._id?.equals(item.variantId)) || {};
        return {
          productId: item.productId || null,
          variantId: item.variantId || null,
          quantity: item.quantity || 0,
          price: item.price || 0,
          salePrice: item.salePrice || 0,
          color: item.color || variant.color?.name || "N/A",
          capacity: item.capacity || variant.capacity?.value || "N/A",
          productName: product.name || "N/A",
          productImage: product.images?.[0] || null,
          shortDescription: product.short_description || "",
        };
      });

      const cancelHistory = order.cancelHistory.map((entry) => ({
        cancelledAt: entry.cancelledAt,
        cancelReason: entry.cancelReason,
        cancelledBy: entry.cancelledBy ? entry.cancelledBy.userName : "N/A",
      }));

      return {
        orderId: order._id,
        userId: order.userId._id,
        userName: order.userId.userName,
        userEmail: order.userId.email,
        userPhone: order.userId.phone,
        items,
        totalAmount: order.totalAmount,
        shippingAddress: order.shippingAddress,
        status: order.status,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        cancelReason: order.cancelReason || null,
        cancelledBy: order.cancelledBy ? order.cancelledBy.userName : null,
        cancelHistory, // Thêm lịch sử hủy
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        deliveredAt: order.deliveredAt || null,
        completedAt: order.completedAt || null,
      };
    });

    return res.status(200).json({
      message: "Lấy danh sách đơn hàng thành công",
      orders: orderDetails,
    });
  } catch (error) {
    return res.status(500).json({
      name: error.name,
      message: error.message,
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;

    const order = await Order.findById(id)
      .populate({ path: "userId", select: "userName email phone" })
      .populate({
        path: "items.productId",
        select: "name images short_description variants",
        populate: [
          { path: "variants.color", select: "name" },
          { path: "variants.capacity", select: "value" },
        ],
      })
      .populate({ path: "cancelledBy", select: "userName" }) // Populate cancelledBy
      .populate({ path: "cancelHistory.cancelledBy", select: "userName" }); // Populate cancelHistory

    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    if (
      user.role === 3 &&
      order.userId._id.toString() !== user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Bạn chỉ có thể xem đơn hàng của chính mình" });
    }

    const items = order.items.map((item) => {
      const product = item.productId || {};
      const variant =
        product.variants?.find((v) => v._id?.equals(item.variantId)) || {};
      return {
        productId: item.productId || null,
        variantId: item.variantId || null,
        quantity: item.quantity || 0,
        price: item.price || 0,
        salePrice: item.salePrice || 0,
        color: item.color || variant.color?.name || "N/A",
        capacity: item.capacity || variant.capacity?.value || "N/A",
        productName: product.name || "N/A",
        productImage: product.images?.[0] || null,
        shortDescription: product.short_description || "",
      };
    });

    const cancelHistory = order.cancelHistory.map((entry) => ({
      cancelledAt: entry.cancelledAt,
      cancelReason: entry.cancelReason,
      cancelledBy: entry.cancelledBy ? entry.cancelledBy.userName : "N/A",
    }));

    const orderDetail = {
      orderId: order._id,
      userId: order.userId._id,
      userName: order.userId.userName,
      userEmail: order.userId.email,
      userPhone: order.userId.phone,
      items,
      totalAmount: order.totalAmount,
      shippingAddress: order.shippingAddress,
      status: order.status,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      cancelReason: order.cancelReason || null,
      cancelledBy: order.cancelledBy ? order.cancelledBy.userName : null,
      cancelHistory, // Thêm lịch sử hủy
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      deliveredAt: order.deliveredAt || null,
      completedAt: order.completedAt || null,
    };

    return res.status(200).json({
      message: "Lấy chi tiết đơn hàng thành công",
      order: orderDetail,
    });
  } catch (error) {
    return res.status(500).json({
      name: error.name,
      message: error.message,
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;
    const { status, cancelReason } = req.body;

    // Kiểm tra quyền - chỉ cho phép khách hàng (role 3) cập nhật đơn hàng của họ
    if (user.role !== 3) {
      return res.status(403).json({
        message: "Chỉ khách hàng mới có quyền cập nhật trạng thái đơn hàng này",
      });
    }

    const validStatuses = ["Đã nhận hàng", "Đã hủy"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Trạng thái không hợp lệ" });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    // Kiểm tra xem đơn hàng có phải của khách hàng này không
    if (order.userId._id.toString() !== user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Bạn chỉ có thể cập nhật đơn hàng của chính mình" });
    }

    const currentStatus = order.status;

    // Khách hàng chỉ có thể chuyển sang "Đã nhận hàng" từ "Đã giao hàng"
    // hoặc hủy đơn khi đơn hàng ở trạng thái "Chưa xác nhận"
    if (status === "Đã nhận hàng" && currentStatus === "Đã giao hàng") {
      order.status = "Hoàn thành";
      order.completedAt = new Date();
    } else if (status === "Đã hủy" && currentStatus === "Chưa xác nhận") {
      if (!cancelReason) {
        return res
          .status(400)
          .json({ message: "Vui lòng nhập lý do hủy đơn hàng" });
      }
      order.status = "Đã hủy";
      order.cancelReason = cancelReason;
      order.cancelledBy = user._id;
      order.cancelHistory = order.cancelHistory || [];
      order.cancelHistory.push({
        cancelledAt: new Date(),
        cancelReason: cancelReason,
        cancelledBy: user._id,
      });
    } else {
      return res.status(403).json({
        message:
          "Bạn chỉ có thể xác nhận 'Đã nhận hàng' khi đơn hàng ở trạng thái 'Đã giao hàng' hoặc hủy đơn khi đơn hàng ở trạng thái 'Chưa xác nhận'",
      });
    }

    // Lưu thông tin người cập nhật
    order.updatedBy = user._id;
    order.updatedAt = new Date();

    await order.save();

    const populatedOrder = await Order.findById(id)
      .populate({ path: "userId", select: "userName email phone" })
      .populate({
        path: "items.productId",
        select: "name images short_description variants",
        populate: [
          { path: "variants.color", select: "name" },
          { path: "variants.capacity", select: "value" },
        ],
      })
      .populate({ path: "cancelledBy", select: "userName" })
      .populate({ path: "cancelHistory.cancelledBy", select: "userName" })
      .populate({ path: "updatedBy", select: "userName" });

    const items = populatedOrder.items.map((item) => {
      const product = item.productId || {};
      const variant =
        product.variants?.find((v) => v._id?.equals(item.variantId)) || {};
      return {
        productId: item.productId || null,
        variantId: item.variantId || null,
        quantity: item.quantity || 0,
        price: item.price || 0,
        salePrice: item.salePrice || 0,
        color: item.color || variant.color?.name || "N/A",
        capacity: item.capacity || variant.capacity?.value || "N/A",
        productName: product.name || "N/A",
        productImage: product.images?.[0] || null,
        shortDescription: product.short_description || "",
      };
    });

    const cancelHistory = populatedOrder.cancelHistory.map((entry) => ({
      cancelledAt: entry.cancelledAt,
      cancelReason: entry.cancelReason,
      cancelledBy: entry.cancelledBy ? entry.cancelledBy.userName : "N/A",
    }));

    const orderDetail = {
      orderId: populatedOrder._id,
      userId: populatedOrder.userId._id,
      userName: populatedOrder.userId.userName,
      userEmail: populatedOrder.userId.email,
      userPhone: populatedOrder.userId.phone,
      items,
      totalAmount: populatedOrder.totalAmount,
      shippingAddress: populatedOrder.shippingAddress,
      status: populatedOrder.status,
      paymentMethod: populatedOrder.paymentMethod,
      paymentStatus: populatedOrder.paymentStatus,
      cancelReason: populatedOrder.cancelReason || null,
      cancelledBy: populatedOrder.cancelledBy
        ? populatedOrder.cancelledBy.userName
        : null,
      cancelHistory,
      createdAt: populatedOrder.createdAt,
      updatedAt: populatedOrder.updatedAt,
      updatedBy: populatedOrder.updatedBy
        ? populatedOrder.updatedBy.userName
        : null,
      deliveredAt: populatedOrder.deliveredAt || null,
      completedAt: populatedOrder.completedAt || null,
    };

    return res.status(200).json({
      message: "Cập nhật trạng thái đơn hàng thành công",
      order: orderDetail,
    });
  } catch (error) {
    return res.status(500).json({
      name: error.name,
      message: error.message,
    });
  }
};

export const updateOrderStatusByAdmin = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;
    const { status, cancelReason } = req.body;

    // Kiểm tra quyền admin
    if (user.role !== 1) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền thực hiện hành động này" });
    }

    const validStatuses = [
      "Chưa xác nhận",
      "Đã xác nhận",
      "Đang giao hàng",
      "Đã giao hàng",
      "Đã hủy",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Trạng thái không hợp lệ" });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    const currentStatus = order.status;

    // Admin chỉ có thể chuyển trạng thái theo thứ tự
    const statusFlow = {
      "Chưa xác nhận": ["Đã xác nhận", "Đã hủy"],
      "Đã xác nhận": ["Đang giao hàng"],
      "Đang giao hàng": ["Đã giao hàng"],
      "Đã giao hàng": [], // Admin không thể chuyển từ "Đã giao hàng" sang trạng thái khác
      "Đã nhận hàng": [], // Admin không thể chuyển từ "Đã nhận hàng" sang trạng thái khác
      "Hoàn thành": [], // Admin không thể chuyển từ "Hoàn thành" sang trạng thái khác
      "Đã hủy": [], // Admin không thể chuyển từ "Đã huỷ" sang trạng thái khác
    };

    // Kiểm tra xem trạng thái mới có hợp lệ không
    if (!statusFlow[currentStatus].includes(status)) {
      return res.status(400).json({
        message: `Không thể chuyển từ trạng thái "${currentStatus}" sang "${status}". Trạng thái hợp lệ tiếp theo là: ${statusFlow[
          currentStatus
        ].join(", ")}`,
      });
    }

    // Nếu chuyển sang trạng thái "Đã huỷ", yêu cầu nhập lý do
    if (status === "Đã hủy") {
      // Kiểm tra xem đơn hàng có ở trạng thái "Chưa xác nhận" không
      if (currentStatus !== "Chưa xác nhận") {
        return res.status(403).json({
          message:
            "Admin chỉ được hủy đơn hàng khi đơn hàng ở trạng thái 'Chưa xác nhận'",
        });
      }

      if (!cancelReason) {
        return res
          .status(400)
          .json({ message: "Vui lòng nhập lý do hủy đơn hàng" });
      }
      order.status = "Đã hủy";
      order.cancelReason = cancelReason;
      order.cancelledBy = user._id;
      order.cancelHistory = order.cancelHistory || [];
      order.cancelHistory.push({
        cancelledAt: new Date(),
        cancelReason: cancelReason,
        cancelledBy: user._id,
      });
    } else {
      order.status = status;

      // Nếu chuyển sang trạng thái "Đã giao hàng" và thanh toán là COD, tự động cập nhật trạng thái thanh toán
      if (status === "Đã giao hàng" && order.paymentMethod === "COD") {
        order.paymentStatus = "Đã thanh toán";
      }

      if (status === "Đã giao hàng") {
        order.deliveredAt = new Date();
      }
    }

    // Lưu thông tin người cập nhật
    order.updatedBy = user._id;
    order.updatedAt = new Date();

    await order.save();

    const populatedOrder = await Order.findById(id)
      .populate({ path: "userId", select: "userName email phone" })
      .populate({
        path: "items.productId",
        select: "name images short_description variants",
        populate: [
          { path: "variants.color", select: "name" },
          { path: "variants.capacity", select: "value" },
        ],
      })
      .populate({ path: "cancelledBy", select: "userName" })
      .populate({ path: "cancelHistory.cancelledBy", select: "userName" })
      .populate({ path: "updatedBy", select: "userName" });

    const items = populatedOrder.items.map((item) => {
      const product = item.productId || {};
      const variant =
        product.variants?.find((v) => v._id?.equals(item.variantId)) || {};
      return {
        productId: item.productId || null,
        variantId: item.variantId || null,
        quantity: item.quantity || 0,
        price: item.price || 0,
        salePrice: item.salePrice || 0,
        color: item.color || variant.color?.name || "N/A",
        capacity: item.capacity || variant.capacity?.value || "N/A",
        productName: product.name || "N/A",
        productImage: product.images?.[0] || null,
        shortDescription: product.short_description || "",
      };
    });

    const cancelHistory = populatedOrder.cancelHistory.map((entry) => ({
      cancelledAt: entry.cancelledAt,
      cancelReason: entry.cancelReason,
      cancelledBy: entry.cancelledBy ? entry.cancelledBy.userName : "N/A",
    }));

    const orderDetail = {
      orderId: populatedOrder._id,
      userId: populatedOrder.userId._id,
      userName: populatedOrder.userId.userName,
      userEmail: populatedOrder.userId.email,
      userPhone: populatedOrder.userId.phone,
      items,
      totalAmount: populatedOrder.totalAmount,
      shippingAddress: populatedOrder.shippingAddress,
      status: populatedOrder.status,
      paymentMethod: populatedOrder.paymentMethod,
      paymentStatus: populatedOrder.paymentStatus,
      cancelReason: populatedOrder.cancelReason || null,
      cancelledBy: populatedOrder.cancelledBy
        ? populatedOrder.cancelledBy.userName
        : null,
      cancelHistory,
      createdAt: populatedOrder.createdAt,
      updatedAt: populatedOrder.updatedAt,
      updatedBy: populatedOrder.updatedBy
        ? populatedOrder.updatedBy.userName
        : null,
      deliveredAt: populatedOrder.deliveredAt || null,
      completedAt: populatedOrder.completedAt || null,
    };

    return res.status(200).json({
      message: "Cập nhật trạng thái đơn hàng thành công",
      order: orderDetail,
    });
  } catch (error) {
    return res.status(500).json({
      name: error.name,
      message: error.message,
    });
  }
};

export const updateOrderStatusByCustomer = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;
    const { status, cancelReason } = req.body;

    // Kiểm tra quyền - chỉ cho phép khách hàng (role 3) cập nhật đơn hàng của họ
    if (user.role !== 3) {
      return res.status(403).json({
        message: "Chỉ khách hàng mới có quyền cập nhật trạng thái đơn hàng này",
      });
    }

    const validStatuses = ["Đã nhận hàng", "Đã hủy"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Trạng thái không hợp lệ" });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    // Kiểm tra xem đơn hàng có phải của khách hàng này không
    if (order.userId._id.toString() !== user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Bạn chỉ có thể cập nhật đơn hàng của chính mình" });
    }

    const currentStatus = order.status;

    // Khách hàng chỉ có thể chuyển sang "Đã nhận hàng" từ "Đã giao hàng"
    // hoặc hủy đơn khi đơn hàng ở trạng thái "Chưa xác nhận"
    if (status === "Đã nhận hàng" && currentStatus === "Đã giao hàng") {
      order.status = "Hoàn thành";
      order.completedAt = new Date();
    } else if (status === "Đã hủy" && currentStatus === "Chưa xác nhận") {
      if (!cancelReason) {
        return res
          .status(400)
          .json({ message: "Vui lòng nhập lý do hủy đơn hàng" });
      }
      order.status = "Đã hủy";
      order.cancelReason = cancelReason;
      order.cancelledBy = user._id;
      order.cancelHistory = order.cancelHistory || [];
      order.cancelHistory.push({
        cancelledAt: new Date(),
        cancelReason: cancelReason,
        cancelledBy: user._id,
      });
    } else {
      return res.status(403).json({
        message:
          "Bạn chỉ có thể xác nhận 'Đã nhận hàng' khi đơn hàng ở trạng thái 'Đã giao hàng' hoặc hủy đơn khi đơn hàng ở trạng thái 'Chưa xác nhận'",
      });
    }

    // Lưu thông tin người cập nhật
    order.updatedBy = user._id;
    order.updatedAt = new Date();

    await order.save();

    const populatedOrder = await Order.findById(id)
      .populate({ path: "userId", select: "userName email phone" })
      .populate({
        path: "items.productId",
        select: "name images short_description variants",
        populate: [
          { path: "variants.color", select: "name" },
          { path: "variants.capacity", select: "value" },
        ],
      })
      .populate({ path: "cancelledBy", select: "userName" })
      .populate({ path: "cancelHistory.cancelledBy", select: "userName" })
      .populate({ path: "updatedBy", select: "userName" });

    const items = populatedOrder.items.map((item) => {
      const product = item.productId || {};
      const variant =
        product.variants?.find((v) => v._id?.equals(item.variantId)) || {};
      return {
        productId: item.productId || null,
        variantId: item.variantId || null,
        quantity: item.quantity || 0,
        price: item.price || 0,
        salePrice: item.salePrice || 0,
        color: item.color || variant.color?.name || "N/A",
        capacity: item.capacity || variant.capacity?.value || "N/A",
        productName: product.name || "N/A",
        productImage: product.images?.[0] || null,
        shortDescription: product.short_description || "",
      };
    });

    const cancelHistory = populatedOrder.cancelHistory.map((entry) => ({
      cancelledAt: entry.cancelledAt,
      cancelReason: entry.cancelReason,
      cancelledBy: entry.cancelledBy ? entry.cancelledBy.userName : "N/A",
    }));

    const orderDetail = {
      orderId: populatedOrder._id,
      userId: populatedOrder.userId._id,
      userName: populatedOrder.userId.userName,
      userEmail: populatedOrder.userId.email,
      userPhone: populatedOrder.userId.phone,
      items,
      totalAmount: populatedOrder.totalAmount,
      shippingAddress: populatedOrder.shippingAddress,
      status: populatedOrder.status,
      paymentMethod: populatedOrder.paymentMethod,
      paymentStatus: populatedOrder.paymentStatus,
      cancelReason: populatedOrder.cancelReason || null,
      cancelledBy: populatedOrder.cancelledBy
        ? populatedOrder.cancelledBy.userName
        : null,
      cancelHistory,
      createdAt: populatedOrder.createdAt,
      updatedAt: populatedOrder.updatedAt,
      updatedBy: populatedOrder.updatedBy
        ? populatedOrder.updatedBy.userName
        : null,
      deliveredAt: populatedOrder.deliveredAt || null,
      completedAt: populatedOrder.completedAt || null,
    };

    return res.status(200).json({
      message: "Cập nhật trạng thái đơn hàng thành công",
      order: orderDetail,
    });
  } catch (error) {
    return res.status(500).json({
      name: error.name,
      message: error.message,
    });
  }
};

// API tìm kiếm đơn hàng
export const searchOrders = async (req, res) => {
  try {
    const user = req.user; // Lấy từ middleware checkOrderPermission
    const { orderId, userName } = req.query;

    // Kiểm tra nếu không có tham số tìm kiếm nào được cung cấp
    if (!orderId && !userName) {
      return res.status(400).json({
        message:
          "Vui lòng cung cấp ít nhất một tiêu chí tìm kiếm: orderId hoặc userName",
      });
    }

    // Xây dựng điều kiện tìm kiếm
    let query = {};

    // Nếu là Customer, giới hạn chỉ tìm đơn của họ
    if (user.role === 3) {
      query.userId = user._id;
    }

    // Tìm theo orderId (nếu có)
    if (orderId) {
      if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return res.status(400).json({ message: "Mã đơn hàng không hợp lệ" });
      }
      query._id = orderId;
    }

    // Tìm theo userName (nếu có)
    if (userName) {
      // Tìm kiếm gần đúng (case-insensitive) bằng regex
      query.userId = {
        $in: await mongoose
          .model("User")
          .find({ userName: { $regex: userName, $options: "i" } }, "_id")
          .distinct("_id"),
      };
    }

    // Tìm đơn hàng với điều kiện query
    const orders = await Order.find(query)
      .populate({ path: "userId", select: "userName email phone" })
      .populate({
        path: "items.productId",
        select: "name images short_description variants",
        populate: [
          { path: "variants.color", select: "name" },
          { path: "variants.capacity", select: "value" },
        ],
      })
      .populate({ path: "cancelledBy", select: "userName" })
      .populate({ path: "cancelHistory.cancelledBy", select: "userName" })
      .sort({ createdAt: -1 }); // Sắp xếp theo thời gian tạo, mới nhất trước

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy đơn hàng nào khớp với tiêu chí",
      });
    }

    // Format dữ liệu trả về
    const orderDetails = orders.map((order) => {
      const items = order.items.map((item) => {
        const product = item.productId || {};
        const variant =
          product.variants?.find((v) => v._id?.equals(item.variantId)) || {};
        return {
          productId: item.productId || null,
          variantId: item.variantId || null,
          quantity: item.quantity || 0,
          price: item.price || 0,
          salePrice: item.salePrice || 0,
          color: item.color || variant.color?.name || "N/A",
          capacity: item.capacity || variant.capacity?.value || "N/A",
          productName: product.name || "N/A",
          productImage: product.images?.[0] || null,
          shortDescription: product.short_description || "",
        };
      });

      const cancelHistory = order.cancelHistory.map((entry) => ({
        cancelledAt: entry.cancelledAt,
        cancelReason: entry.cancelReason,
        cancelledBy: entry.cancelledBy ? entry.cancelledBy.userName : "N/A",
      }));

      return {
        orderId: order._id,
        userId: order.userId._id,
        userName: order.userId.userName,
        userEmail: order.userId.email,
        userPhone: order.userId.phone,
        items,
        totalAmount: order.totalAmount,
        shippingAddress: order.shippingAddress,
        status: order.status,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        cancelReason: order.cancelReason || null,
        cancelledBy: order.cancelledBy ? order.cancelledBy.userName : null,
        cancelHistory,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        deliveredAt: order.deliveredAt || null,
        completedAt: order.completedAt || null,
      };
    });

    return res.status(200).json({
      message: "Tìm kiếm đơn hàng thành công",
      data: orderDetails,
    });
  } catch (error) {
    return res.status(500).json({
      name: error.name,
      message: error.message,
    });
  }
};

// API lọc đơn hàng theo trạng thái
export const filterOrders = async (req, res) => {
  try {
    const user = req.user;
    const { status } = req.query;

    // Danh sách trạng thái hợp lệ
    const validStatuses = [
      "Chưa xác nhận",
      "Đã xác nhận",
      "Đang giao hàng",
      "Đã giao hàng",
      "Đã nhận hàng",
      "Hoàn thành",
      "Đã hủy",
    ];

    // Kiểm tra nếu không có tham số status
    if (!status) {
      return res.status(400).json({
        message: "Vui lòng cung cấp trạng thái để lọc đơn hàng",
      });
    }

    // Chuyển status thành mảng nếu là chuỗi đơn (hỗ trợ lọc nhiều trạng thái)
    const statusArray = Array.isArray(status) ? status : [status];

    // Kiểm tra xem các trạng thái có hợp lệ không
    const invalidStatuses = statusArray.filter(
      (s) => !validStatuses.includes(s)
    );
    if (invalidStatuses.length > 0) {
      return res.status(400).json({
        message: `Trạng thái không hợp lệ: ${invalidStatuses.join(", ")}`,
      });
    }

    // Xây dựng điều kiện lọc
    let query = { status: { $in: statusArray } };

    // Nếu là Customer, giới hạn chỉ lọc đơn của họ
    if (user.role === 3) {
      query.userId = user._id;
    }

    // Tìm đơn hàng với điều kiện query
    const orders = await Order.find(query)
      .populate({ path: "userId", select: "userName email phone" })
      .populate({
        path: "items.productId",
        select: "name images short_description variants",
        populate: [
          { path: "variants.color", select: "name" },
          { path: "variants.capacity", select: "value" },
        ],
      })
      .populate({ path: "cancelledBy", select: "userName" })
      .populate({ path: "cancelHistory.cancelledBy", select: "userName" })
      .sort({ createdAt: -1 }); // Sắp xếp theo thời gian tạo, mới nhất trước

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy đơn hàng nào khớp với trạng thái",
      });
    }

    // Format dữ liệu trả về
    const orderDetails = orders.map((order) => {
      const items = order.items.map((item) => {
        const product = item.productId || {};
        const variant =
          product.variants?.find((v) => v._id?.equals(item.variantId)) || {};
        return {
          productId: item.productId || null,
          variantId: item.variantId || null,
          quantity: item.quantity || 0,
          price: item.price || 0,
          salePrice: item.salePrice || 0,
          color: item.color || variant.color?.name || "N/A",
          capacity: item.capacity || variant.capacity?.value || "N/A",
          productName: product.name || "N/A",
          productImage: product.images?.[0] || null,
          shortDescription: product.short_description || "",
        };
      });

      const cancelHistory = order.cancelHistory.map((entry) => ({
        cancelledAt: entry.cancelledAt,
        cancelReason: entry.cancelReason,
        cancelledBy: entry.cancelledBy ? entry.cancelledBy.userName : "N/A",
      }));

      return {
        orderId: order._id,
        userId: order.userId._id,
        userName: order.userId.userName,
        userEmail: order.userId.email,
        userPhone: order.userId.phone,
        items,
        totalAmount: order.totalAmount,
        shippingAddress: order.shippingAddress,
        status: order.status,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        cancelReason: order.cancelReason || null,
        cancelledBy: order.cancelledBy ? order.cancelledBy.userName : null,
        cancelHistory,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        deliveredAt: order.deliveredAt || null,
        completedAt: order.completedAt || null,
      };
    });

    return res.status(200).json({
      message: "Lọc đơn hàng thành công",
      data: orderDetails,
    });
  } catch (error) {
    return res.status(500).json({
      name: error.name,
      message: error.message,
    });
  }
};
