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
