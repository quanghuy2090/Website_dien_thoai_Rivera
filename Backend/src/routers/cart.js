import {
  createCart,
  getCart,
  // removeFromCart,
  updateCart,
} from "../controllers/cart.js";

import express from "express";
import { checkUserPermission } from "./../middlewares/checkUserPermission.js";

const routerCart = express.Router();

routerCart.post("/", checkUserPermission, createCart);
routerCart.get("/", checkUserPermission, getCart);
routerCart.put("/", checkUserPermission, updateCart);
// routerCart.delete("/:userId/:productId", removeFromCart);

export default routerCart;
