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
} from "../controllers/order.js";
import { checkUserPermission } from "./../middlewares/checkUserPermission.js";
import { handleVnpayReturn } from "../controllers/vnpay.js";
import { checkOrderPermission } from "../middlewares/checkOrderPermission.js";
import { checkAdminPermission } from "../middlewares/checkAdminPermission.js";

const routerOrder = express.Router();

// Tạo đơn hàng từ giỏ hàng
routerOrder.post("/cod", checkUserPermission, createOrderCOD);
routerOrder.post("/online", checkUserPermission, createOrderOnline);
// Route xử lý phản hồi từ VNPAY
routerOrder.get("/vnpay_return", async (req, res) => {
  try {
    const result = await handleVnpayReturn(req.query);
    return res.status(result.status).json(result.data);
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi xử lý phản hồi từ VNPAY",
      error: error.message,
    });
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

export default routerOrder;
