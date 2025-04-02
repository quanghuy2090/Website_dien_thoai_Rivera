import express from "express";
import {
  create,
  getAll,
  getDeletedCategories,
  getDetail,
  remove,
  restoreCategory,
  searchCategoryByName,
  update,
} from "../controllers/category.js";
import { checkAdminPermission } from "../middlewares/checkAdminPermission.js";

const routerCategory = express.Router();

routerCategory.get("/deleted", checkAdminPermission, getDeletedCategories);
routerCategory.post("/search", searchCategoryByName);
routerCategory.patch("/restore/:id", checkAdminPermission, restoreCategory);
routerCategory.get("/", checkAdminPermission, getAll);
routerCategory.get("/:id", checkAdminPermission, getDetail);
routerCategory.post("/", checkAdminPermission, create);
routerCategory.put("/:id", checkAdminPermission, update);
routerCategory.delete("/:id", checkAdminPermission, remove);

export default routerCategory;
