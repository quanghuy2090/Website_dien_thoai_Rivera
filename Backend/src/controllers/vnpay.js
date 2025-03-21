import Order from "../models/Order.js";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const { VNPAY_HASH_SECRET } = process.env;

export const handleVnpayReturn = async (vnpParams) => {
  // Tách vnp_SecureHash ra để kiểm tra
  const secureHash = vnpParams.vnp_SecureHash;
  delete vnpParams.vnp_SecureHash;
  delete vnpParams.vnp_SecureHashType;

  // Sắp xếp các tham số theo thứ tự alphabet
  const sortedParams = Object.keys(vnpParams)
    .sort()
    .reduce((result, key) => {
      result[key] = vnpParams[key];
      return result;
    }, {});

  // Tạo chuỗi ký để kiểm tra
  const signData = new URLSearchParams(sortedParams).toString();
  const hmac = crypto.createHmac("sha512", VNPAY_HASH_SECRET);
  const calculatedHash = hmac.update(signData).digest("hex");

  // Kiểm tra tính toàn vẹn của dữ liệu
  if (calculatedHash !== secureHash) {
    return {
      status: 400,
      data: { message: "Dữ liệu không hợp lệ, chữ ký không khớp" },
    };
  }

  // Lấy mã đơn hàng từ vnp_TxnRef
  const orderId = vnpParams.vnp_TxnRef;

  // Tìm đơn hàng trong database
  const order = await Order.findById(orderId);
  if (!order) {
    return {
      status: 404,
      data: { message: "Không tìm thấy đơn hàng" },
    };
  }

  // Kiểm tra trạng thái giao dịch từ VNPAY
  const transactionStatus = vnpParams.vnp_TransactionStatus;

  if (transactionStatus === "00") {
    // Thanh toán thành công
    order.paymentStatus = "Đã thanh toán";
    order.status = "Chưa xác nhận"; // Có thể tùy chỉnh trạng thái
    await order.save();

    return {
      status: 200,
      data: {
        message: "Thanh toán thành công",
        orderId: order._id,
        transactionNo: vnpParams.vnp_TransactionNo,
      },
    };
  } else {
    // Thanh toán thất bại
    order.paymentStatus = "Không đạt";
    await order.save();

    return {
      status: 400,
      data: {
        message: "Thanh toán thất bại",
        orderId: order._id,
        responseCode: vnpParams.vnp_ResponseCode,
      },
    };
  }
};