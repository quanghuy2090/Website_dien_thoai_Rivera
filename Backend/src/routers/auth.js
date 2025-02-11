import { Router } from "express";
import { signUp, signIn, getUser, remove } from "../controllers/auth.js";

const routerAuth = Router();

routerAuth.post("/singup", signUp);
routerAuth.post("/singin", signIn);
routerAuth.get("/user", getUser);
routerAuth.delete("/user/:id", remove)
export default routerAuth;
