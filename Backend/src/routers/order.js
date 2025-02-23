import express from "express";
import {
  createOrder,
  getAllOrders,
  getAllOrdersByUser,
  getOrderDetails,
  removeOrder,
  updateOrder,
} from "../controllers/order.js";
import { checkPromission } from "../middlewares/checkPromission.js";

const routerOrder = express.Router();

// Tạo đơn hàng từ giỏ hàng
routerOrder.post("/", createOrder);
routerOrder.put("/:orderId", updateOrder);
routerOrder.patch("/:orderId", removeOrder);
routerOrder.get("/", getAllOrders);
routerOrder.get("/:userId", getAllOrdersByUser);
routerOrder.get("/detail/:orderId", getOrderDetails);

export default routerOrder;
