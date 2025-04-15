import express from "express";
import {
  getTotalRevenue,
  getTopUsers,
  getTopProducts,
  getLeastSoldProducts,
  getOrderStatus,
} from "../controllers/statistics.js";
import { checkAdminPermission } from "../middlewares/checkAdminPermission.js";

const routerStatistics = express.Router();

// Tất cả các route thống kê đều yêu cầu quyền admin
routerStatistics.get("/revenue", checkAdminPermission, getTotalRevenue);
routerStatistics.get("/top-users", checkAdminPermission, getTopUsers);
routerStatistics.get("/top-products", checkAdminPermission, getTopProducts);
routerStatistics.get(
  "/least-sold-products",
  checkAdminPermission,
  getLeastSoldProducts
);
routerStatistics.get("/order-status", checkAdminPermission, getOrderStatus)

export default routerStatistics;
