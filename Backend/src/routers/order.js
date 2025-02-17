import express from "express";
import { createOrder } from "../controllers/order.js";

const routerOrder = express.Router();

// Tạo đơn hàng từ giỏ hàng
routerOrder.post("/", createOrder);

export default routerOrder;
