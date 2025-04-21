import express from "express";
import {
  createCapacity,
  deleteCapacity,
  getAllCapacities,
  getCapacityDetail,
  getDeletedCapacity,
  restoreCapacity,
  updateCapacity,
} from "../controllers/capacity.js";
import { checkAdminPermission } from "../middlewares/checkAdminPermission.js";

const routerCapacity = express.Router();
routerCapacity.get("/deleted", checkAdminPermission, getDeletedCapacity)
routerCapacity.post("/", checkAdminPermission, createCapacity);
routerCapacity.get("/", checkAdminPermission, getAllCapacities);
routerCapacity.get("/:id", checkAdminPermission, getCapacityDetail);
routerCapacity.put("/:id", checkAdminPermission, updateCapacity);
routerCapacity.delete("/:id", checkAdminPermission, deleteCapacity);
routerCapacity.patch("/restore/:id", checkAdminPermission, restoreCapacity)
export default routerCapacity;
