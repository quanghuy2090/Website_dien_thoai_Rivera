import { Router } from "express";
import {
  signUp,
  signIn,
  getUser,
  getDetailUser,
  updateStatus,
  updateRole,
} from "../controllers/auth.js";

const routerAuth = Router();

routerAuth.post("/singup", signUp);
routerAuth.post("/singin", signIn);
routerAuth.get("/user", getUser);
routerAuth.get("/user/:id", getDetailUser);
routerAuth.put("/user/:id", updateStatus);
routerAuth.put("/user-role/:id", updateRole);
export default routerAuth;
