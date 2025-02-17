import express from "express";
import { createOrder, updateOrder } from "../controllers/order.js";

const routerOrder = express.Router();

// Tạo đơn hàng từ giỏ hàng
routerOrder.post("/", createOrder);
routerOrder.put("/:orderId", updateOrder);

export default routerOrder;
