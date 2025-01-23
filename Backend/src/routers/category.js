import express from "express";
import {
  create,
  getAll,
  getDetail,
  remove,
  update,
} from "../controllers/category.js";
import { checkPromission } from "../middlewares/checkPromission.js";

const routerCategory = express.Router();

routerCategory.get("/", getAll);
routerCategory.get("/:id", getDetail);
routerCategory.post("/", checkPromission, create);
routerCategory.put("/:id", checkPromission, update);
routerCategory.delete("/:id", checkPromission, remove);

export default routerCategory;
