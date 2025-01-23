import express from "express";
import {
  create,
  getAll,
  getDetail,
  remove,
  update,
} from "../controllers/product.js";
import { checkPromission } from "../middlewares/checkPromission.js";

const routerProduct = express.Router();

routerProduct.get("/", getAll);
routerProduct.get("/:id", getDetail);
routerProduct.post("/", create);
routerProduct.put("/:id", update);
routerProduct.delete("/:id", remove);

export default routerProduct;
