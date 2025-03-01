import express from "express";
import routerAuth from "./auth.js";
import routerCategory from "./category.js";
import routerProduct from "./product.js";
import routerFile from "./upload.js";
import routerCart from "./cart.js";
const router = express.Router();

router.use("/product", routerProduct);
router.use("/category", routerCategory);
router.use("/auth", routerAuth);
router.use("/file", routerFile);
router.use("/cart", routerCart);
export default router;
