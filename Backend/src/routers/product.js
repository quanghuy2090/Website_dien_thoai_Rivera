import express from "express";
import {
  create,
  getAll,
  getDetail,
  remove,
  searchProductByName,
  update,
} from "../controllers/product.js";

const routerProduct = express.Router();

routerProduct.get("/", getAll);
routerProduct.get("/:id", getDetail);
routerProduct.post("/", create);
routerProduct.put("/:id", update);
routerProduct.delete("/:id", remove);
// tim kiem san pham
routerProduct.post("/search", searchProductByName);

export default routerProduct;
