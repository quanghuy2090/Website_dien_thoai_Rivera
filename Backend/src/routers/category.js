import express from "express";
import {
  create,
  getAll,
  getDetail,
  remove,
  searchCategoryByName,
  update,
} from "../controllers/category.js";
import { checkAdminPermission } from "../middlewares/checkAdminPermission.js";

const routerCategory = express.Router();

routerCategory.get("/", checkAdminPermission, getAll);
routerCategory.get("/:id", getDetail);
routerCategory.post("/", checkAdminPermission, create);
routerCategory.put("/:id", checkAdminPermission, update);
routerCategory.delete("/:id", checkAdminPermission, remove);
routerCategory.post("/search", searchCategoryByName);

export default routerCategory;
