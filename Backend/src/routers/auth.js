import { Router } from "express";
import {
  signUp,
  signIn,
  getUser,
  getDetailUser,
  updateUser,
  updateUserByAdmin,
} from "../controllers/auth.js";
import { checkAdminPermission } from "../middlewares/checkAdminPermission.js";
import { checkUserPermission } from "../middlewares/checkUserPermission.js";

const routerAuth = Router();

routerAuth.post("/singup", signUp);
routerAuth.post("/singin", signIn);
routerAuth.get("/user", checkAdminPermission, getUser);
routerAuth.get("/user/:id", checkUserPermission, getDetailUser);
routerAuth.put("/user/update", checkUserPermission, updateUser);
routerAuth.put("/user/:id/update", checkAdminPermission, updateUserByAdmin);

export default routerAuth;
