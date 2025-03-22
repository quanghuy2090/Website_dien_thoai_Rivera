import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Cart from "../models/Cart.js";
import User from "../models/User.js";
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
    if (!VNPAY_TMN_CODE || !VNPAY_HASH_SECRET || !VNPAY_URL || !VNPAY_RETURN_URL) {
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
        salePrice: variant.salePrice !== undefined ? variant.salePrice : variant.price,
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

    const vnpUrl = `${VNPAY_URL}?${new URLSearchParams(sortedParams).toString()}`;

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

    // Bước 1: Xác định điều kiện lọc đơn hàng dựa trên role
    let query = {};
    if (user.role === 3) {
      // Customer chỉ xem đơn hàng của chính mình
      query = { userId: user._id };
    }

    // Bước 2: Tìm tất cả đơn hàng và populate thông tin cần thiết
    const orders = await Order.find(query)
      .populate({
        path: "userId",
        select: "userName email phone", // Populate thông tin user
      })
      .populate({
        path: "items.productId",
        select: "name images short_description variants", // Populate thêm variants
        populate: [
          { path: "variants.color", select: "name" }, // Populate màu sắc
          { path: "variants.capacity", select: "value" }, // Populate dung lượng
        ],
      })
      .sort({ createdAt: -1 }); // Sắp xếp theo thời gian tạo, mới nhất trước

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy đơn hàng nào",
      });
    }

    // Bước 3: Xử lý dữ liệu trả về
    const orderDetails = orders.map((order) => {
      const items = order.items.map((item) => {
        const product = item.productId;
        const variant = product?.variants.find((v) =>
          v._id.equals(item.variantId)
        );

        return {
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          price: item.price,
          salePrice: item.salePrice,
          color: item.color || variant?.color?.name || "N/A",
          capacity: item.capacity || variant?.capacity?.value || "N/A",
          productName: product?.name || "N/A",
          productImage: product?.images?.[0] || null,
          shortDescription: product?.short_description || "",
        };
      });

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
        cancelledBy: order.cancelledBy || null,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      };
    });

    // Bước 4: Trả về kết quả
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
      .populate({
        path: "userId",
        select: "userName email phone",
      })
      .populate({
        path: "items.productId",
        select: "name images short_description variants",
        populate: [
          { path: "variants.color", select: "name" },
          { path: "variants.capacity", select: "value" },
        ],
      });

    if (!order) {
      return res.status(404).json({
        message: "Không tìm thấy đơn hàng",
      });
    }

    if (user.role === 3 && order.userId._id.toString() !== user._id.toString()) {
      return res.status(403).json({
        message: "Bạn chỉ có thể xem đơn hàng của chính mình",
      });
    }

    const items = order.items.map((item) => {
      const product = item.productId;
      const variant = product?.variants.find((v) => v._id.equals(item.variantId));

      return {
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        price: item.price,
        salePrice: item.salePrice,
        color: item.color || variant?.color?.name || "N/A",
        capacity: item.capacity || variant?.capacity?.value || "N/A",
        productName: product?.name || "N/A",
        productImage: product?.images?.[0] || null,
        shortDescription: product?.short_description || "",
      };
    });

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
      cancelledBy: order.cancelledBy || null,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
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
    const user = req.user; // Lấy từ middleware checkOrderPermission
    const { id } = req.params; // orderId
    const { status, cancelReason } = req.body; // Trạng thái mới và lý do hủy (nếu có)

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

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Trạng thái không hợp lệ",
      });
    }

    // Tìm đơn hàng
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        message: "Không tìm thấy đơn hàng",
      });
    }

    // Kiểm tra quyền truy cập
    if (user.role === 3 && order.userId._id.toString() !== user._id.toString()) {
      return res.status(403).json({
        message: "Bạn chỉ có thể cập nhật đơn hàng của chính mình",
      });
    }

    // Logic cập nhật trạng thái
    const currentStatus = order.status;

    // Customer (role = 3)
    if (user.role === 3) {
      if (status === "Đã nhận hàng" && currentStatus === "Đã giao hàng") {
        order.status = "Hoàn thành"; // Chuyển trực tiếp sang Hoàn thành
      } else if (status === "Đã huỷ" && currentStatus === "Chưa xác nhận") {
        if (!cancelReason) {
          return res.status(400).json({
            message: "Vui lòng cung cấp lý do hủy đơn",
          });
        }
        order.status = "Đã huỷ";
        order.cancelReason = cancelReason;
        order.cancelledBy = user._id; // Lưu ID của user hủy đơn
      } else {
        return res.status(403).json({
          message: "Bạn chỉ có thể xác nhận 'Đã nhận hàng' hoặc hủy đơn khi 'Chưa xác nhận'",
        });
      }
    }

    // Admin (role = 1)
    if (user.role === 1) {
      if (status === "Đã huỷ") {
        if (!cancelReason) {
          return res.status(400).json({
            message: "Vui lòng cung cấp lý do hủy đơn",
          });
        }
        order.status = "Đã huỷ";
        order.cancelReason = cancelReason;
        order.cancelledBy = user._id; // Lưu ID của admin hủy đơn
      } else if (status === "Đã nhận hàng") {
        return res.status(400).json({
          message: "Admin không thể chuyển sang trạng thái 'Đã nhận hàng'",
        });
      } else {
        order.status = status;
        if (status === "Đã giao hàng") {
          order.deliveredAt = new Date(); // Ghi lại thời điểm giao hàng
        }
      }
    }

    // Lưu đơn hàng
    await order.save();

    // Populate để trả về thông tin chi tiết
    const populatedOrder = await Order.findById(id)
      .populate({
        path: "userId",
        select: "userName email phone",
      })
      .populate({
        path: "items.productId",
        select: "name images short_description variants",
        populate: [
          { path: "variants.color", select: "name" },
          { path: "variants.capacity", select: "value" },
        ],
      })
      .populate({
        path: "cancelledBy",
        select: "userName", // Populate thông tin admin/user hủy đơn
      });

    const items = populatedOrder.items.map((item) => {
      const product = item.productId;
      const variant = product?.variants.find((v) => v._id.equals(item.variantId));
      return {
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        price: item.price,
        salePrice: item.salePrice,
        color: item.color || variant?.color?.name || "N/A",
        capacity: item.capacity || variant?.capacity?.value || "N/A",
        productName: product?.name || "N/A",
        productImage: product?.images?.[0] || null,
        shortDescription: product?.short_description || "",
      };
    });

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
      cancelledBy: populatedOrder.cancelledBy ? populatedOrder.cancelledBy.userName : null,
      createdAt: populatedOrder.createdAt,
      updatedAt: populatedOrder.updatedAt,
      deliveredAt: populatedOrder.deliveredAt || null,
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