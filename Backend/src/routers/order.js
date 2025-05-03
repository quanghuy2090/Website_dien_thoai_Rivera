import express from "express";
import {
  createOrderCOD,
  createOrderOnline,
  filterOrders,
  getAllOrder,
  getOrderById,
  searchOrders,
  updateOrderStatusByAdmin,
  updateOrderStatusByCustomer,
  getCancelledOrdersByAdmin,
  getCancelledOrdersByCustomer,
} from "../controllers/order.js";
import { checkUserPermission } from "./../middlewares/checkUserPermission.js";
import { handleVnpayReturn } from "../controllers/vnpay.js";
import { checkOrderPermission } from "../middlewares/checkOrderPermission.js";
import { checkAdminPermission } from "../middlewares/checkAdminPermission.js";
import Order from "../models/Order.js";

const routerOrder = express.Router();

// Tạo đơn hàng từ giỏ hàng
routerOrder.post("/cod", checkUserPermission, createOrderCOD);
routerOrder.post("/online", checkUserPermission, createOrderOnline);
// Route xử lý phản hồi từ VNPAY
routerOrder.get("/vnpay_return", async (req, res) => {
  try {
    const result = await handleVnpayReturn(req.query);
    console.log("result", result);

    // Nếu thanh toán thành công, chuyển hướng về trang lịch sử đơn hàng
    if (result.status === 200) {
      return res.redirect(
        `http://localhost:5173/history?success=true&orderId=${
          result.data.orderId
        }&message=${encodeURIComponent(
          "Đặt hàng thành công! Cảm ơn bạn đã mua hàng."
        )}`
      );
    } else {
      // Nếu thanh toán thất bại hoặc hủy, xóa đơn hàng và chuyển hướng về trang lịch sử đơn hàng với thông báo lỗi
      if (result.data.orderId) {
        await Order.findByIdAndDelete(result.data.orderId);
      }
      return res.redirect(
        `http://localhost:5173/history?success=false&message=${encodeURIComponent(
          result.data.message
        )}`
      );
    }
  } catch (error) {
    // Nếu có lỗi, cũng xóa đơn hàng nếu có
    if (error.orderId) {
      await Order.findByIdAndDelete(error.orderId);
    }
    return res.redirect(
      `http://localhost:5173/history?success=false&message=${encodeURIComponent(
        "Lỗi xử lý phản hồi từ VNPAY"
      )}`
    );
  }
});

routerOrder.get("/", checkUserPermission, getAllOrder);
routerOrder.get("/search", checkOrderPermission, searchOrders);
routerOrder.get("/filter", checkOrderPermission, filterOrders);
routerOrder.get("/:id", checkOrderPermission, getOrderById);
// Route mới cho admin cập nhật trạng thái đơn hàng
routerOrder.put(
  "/admin/status/:id",
  checkAdminPermission,
  updateOrderStatusByAdmin
);
// Route mới cho khách hàng cập nhật trạng thái đơn hàng
routerOrder.put(
  "/customer/status/:id",
  checkUserPermission,
  updateOrderStatusByCustomer
);

// API lấy danh sách đơn hàng đã hủy cho admin
routerOrder.get(
  "/cancelled/admin",
  checkAdminPermission,
  getCancelledOrdersByAdmin
);

// API lấy danh sách đơn hàng đã hủy cho khách hàng
routerOrder.get(
  "/cancelled/customer",
  checkUserPermission,
  getCancelledOrdersByCustomer
);

export default routerOrder;
