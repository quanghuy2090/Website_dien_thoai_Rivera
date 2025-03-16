import {
  createCart,
  getCart,
  removeAll,
  removeCart,
  updateCart,
} from "../controllers/cart.js";

import express from "express";
import { checkUserPermission } from "./../middlewares/checkUserPermission.js";

const routerCart = express.Router();

routerCart.post("/", checkUserPermission, createCart);
routerCart.get("/", checkUserPermission, getCart);
routerCart.put("/", checkUserPermission, updateCart);
routerCart.delete("/:productId", checkUserPermission, removeCart);
routerCart.delete("/removeAll/:id", checkUserPermission, removeAll);

export default routerCart;
