import express from "express";
import { createOrder, removeOrder, updateOrder } from "../controllers/order.js";
import { checkPromission } from "../middlewares/checkPromission.js";

const routerOrder = express.Router();

// Tạo đơn hàng từ giỏ hàng
routerOrder.post("/", createOrder);
routerOrder.put("/:orderId", updateOrder);
routerOrder.patch("/:orderId", removeOrder);

export default routerOrder;
