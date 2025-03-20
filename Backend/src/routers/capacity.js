import express from "express";
import {
  createCapacity,
  deleteCapacity,
  getAllCapacities,
  getCapacityDetail,
  updateCapacity,
} from "../controllers/capacity.js";
import { checkAdminPermission } from "../middlewares/checkAdminPermission.js";

const routerCapacity = express.Router();

routerCapacity.post("/", checkAdminPermission, createCapacity);
routerCapacity.get("/", checkAdminPermission, getAllCapacities);
routerCapacity.get("/:id", checkAdminPermission, getCapacityDetail);
routerCapacity.put("/:id", checkAdminPermission, updateCapacity);
routerCapacity.delete("/:id", checkAdminPermission, deleteCapacity);

export default routerCapacity;
