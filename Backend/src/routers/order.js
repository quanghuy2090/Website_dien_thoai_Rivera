import express from "express";
import {
  createOrder,
  getAllOrders,
  getAllOrdersByUser,
  getOrderDetails,
  removeOrder,
  updateOrder,
} from "../controllers/order.js";

const routerOrder = express.Router();

// Tạo đơn hàng từ giỏ hàng
routerOrder.post("/", createOrder);
routerOrder.put("/update/:orderId", updateOrder);
routerOrder.put("/remove/:orderId", removeOrder);
routerOrder.get("/", getAllOrders);
routerOrder.get("/:userId", getAllOrdersByUser);
routerOrder.get("/detail/:orderId", getOrderDetails);

export default routerOrder;
