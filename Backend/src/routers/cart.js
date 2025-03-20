import {
  createCart,
  getAllCart,
  removeAllCart,
  removeCart,
  updateCart,
} from "../controllers/cart.js";

import express from "express";
import { checkUserPermission } from "./../middlewares/checkUserPermission.js";

const routerCart = express.Router();

routerCart.post("/", checkUserPermission, createCart);
routerCart.get("/", checkUserPermission, getAllCart);
routerCart.put("/", checkUserPermission, updateCart);
routerCart.delete("/", checkUserPermission, removeCart);
routerCart.delete("/removeAll/", checkUserPermission, removeAllCart);

export default routerCart;
