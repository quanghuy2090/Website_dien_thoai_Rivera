import express from "express";
import routerAuth from "./auth.js";
import routerCategory from "./category.js";
import routerProduct from "./product.js";
const router = express.Router();

router.use("/product", routerProduct);
router.use("/category", routerCategory);
router.use("/auth", routerAuth);

export default router;
