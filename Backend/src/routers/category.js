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
import { checkCategoryPermission } from "../middlewares/checkCategoryPermission.js";

const routerCategory = express.Router();

routerCategory.get("/deleted", checkCategoryPermission, getDeletedCategories);
routerCategory.post("/search", searchCategoryByName);
routerCategory.patch("/restore/:id", checkCategoryPermission, restoreCategory);
routerCategory.get("/", checkCategoryPermission, getAll);
routerCategory.get("/:id", checkCategoryPermission, getDetail);
routerCategory.post("/", checkCategoryPermission, create);
routerCategory.put("/:id", checkCategoryPermission, update);
routerCategory.delete("/:id", checkCategoryPermission, remove);

export default routerCategory;
