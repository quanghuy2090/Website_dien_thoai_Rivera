import express from "express";
import routerAuth from "./auth.js";
import routerCategory from "./category.js";
import routerProduct from "./product.js";
import routerFile from "./upload.js";
import routerCart from "./cart.js";
import routerOrder from "./order.js";
import routerColor from "./color.js";
import routerCapacity from "./capacity.js";
import routerStatistics from "./statistics.js";
const router = express.Router();

router.use("/product", routerProduct);
router.use("/category", routerCategory);
router.use("/auth", routerAuth);
router.use("/file", routerFile);
router.use("/cart", routerCart);
router.use("/order", routerOrder);
router.use("/color", routerColor);
router.use("/capacity", routerCapacity);
router.use("/statistics", routerStatistics);

export default router;
