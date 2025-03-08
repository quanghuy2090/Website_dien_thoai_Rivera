import express from "express";
import {
  create,
  getAll,
  getDetail,
  remove,
  searchCategoryByName,
  update,
} from "../controllers/category.js";

const routerCategory = express.Router();

routerCategory.get("/", getAll);
routerCategory.get("/:id", getDetail);
routerCategory.post("/", create);
routerCategory.put("/:id", update);
routerCategory.delete("/:id", remove);
routerCategory.post("/search", searchCategoryByName);

export default routerCategory;
