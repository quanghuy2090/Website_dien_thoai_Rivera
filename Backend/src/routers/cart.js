import {
  addToCart,
  getCart,
  removeFromCart,
  updateCart,
} from "../controllers/cart.js";

import express from "express";

const routerCart = express.Router();

routerCart.post("/", addToCart);
routerCart.get("/:userId", getCart);
routerCart.put("/:userId", updateCart);
routerCart.delete("/:userId/:productId", removeFromCart);

export default routerCart;
