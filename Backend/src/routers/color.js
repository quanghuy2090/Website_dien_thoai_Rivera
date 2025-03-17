import express from "express";
import {
  createColor,
  deleteColor,
  getAllColors,
  getColorDetail,
  updateColor,
} from "../controllers/color.js";
import { checkAdminPermission } from "../middlewares/checkAdminPermission.js";

const routerColor = express.Router();

routerColor.post("/", checkAdminPermission, createColor);
routerColor.get("/", checkAdminPermission, getAllColors);
routerColor.get("/:id", checkAdminPermission, getColorDetail);
routerColor.put("/:id", checkAdminPermission, updateColor);
routerColor.delete("/:id", checkAdminPermission, deleteColor);

export default routerColor;
