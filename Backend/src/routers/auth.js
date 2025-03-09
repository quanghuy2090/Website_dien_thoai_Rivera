import { Router } from "express";
import {
  signUp,
  signIn,
  getUser,
  getDetailUser,
  updateRole,
  updateUser,
} from "../controllers/auth.js";
import { checkAdminPermission } from "../middlewares/checkAdminPermission.js";
import { checkUserPermission } from "../middlewares/checkUserPermission.js";

const routerAuth = Router();

routerAuth.post("/singup", signUp);
routerAuth.post("/singin", signIn);
routerAuth.get("/user", checkAdminPermission, getUser);
routerAuth.get("/user/:id", checkUserPermission, getDetailUser);
routerAuth.put("/user/:id", checkUserPermission, updateUser);
routerAuth.put("/user/role/:id", checkAdminPermission, updateRole);
export default routerAuth;
