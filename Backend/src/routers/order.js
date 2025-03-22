import express from "express";
import {
  createOrderCOD,
  createOrderOnline,
  getAllOrder,
  getOrderById,
  updateOrderStatus,
} from "../controllers/order.js";
import { checkUserPermission } from "./../middlewares/checkUserPermission.js";
import { handleVnpayReturn } from "../controllers/vnpay.js";
import { checkOrderPermission } from "../middlewares/checkOrderPermission.js";

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
routerOrder.get("/:id", checkOrderPermission, getOrderById);
routerOrder.put("/status/:id", checkOrderPermission, updateOrderStatus);

export default routerOrder;
