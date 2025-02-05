import express from "express";
import {
  create,
  getAll,
  getDetail,
  remove,
  searchProductByName,
  update,
} from "../controllers/product.js";
import { checkPromission } from "../middlewares/checkPromission.js";

const routerProduct = express.Router();

routerProduct.get("/", getAll);
routerProduct.get("/:id", getDetail);
routerProduct.post("/", checkPromission, create);
routerProduct.put("/:id", checkPromission, update);
routerProduct.delete("/:id", checkPromission, remove);
// tim kiem san pham
routerProduct.post("/search", searchProductByName);

export default routerProduct;
