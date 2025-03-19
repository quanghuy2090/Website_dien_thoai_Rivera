import express from "express";
import {
  createProduct,
  getAllProduct,
  getDetailProduct,
  removeProduct,
  searchProductByName,
  statusProduct,
  updateProduct,
} from "../controllers/product.js";
import { checkAdminPermission } from "../middlewares/checkAdminPermission.js";

const routerProduct = express.Router();

routerProduct.get("/", getAllProduct);
routerProduct.get("/:id", getDetailProduct);
routerProduct.post("/", checkAdminPermission, createProduct);
routerProduct.put("/:id", checkAdminPermission, updateProduct);
routerProduct.delete("/:id", checkAdminPermission, removeProduct);
routerProduct.put("/status/:id", checkAdminPermission, statusProduct);
// tim kiem san pham
routerProduct.post("/search", searchProductByName);

export default routerProduct;
