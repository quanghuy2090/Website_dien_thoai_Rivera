import { Router } from "express";
import { signUp, signIn } from "../controllers/auth.js";

const routerAuth = Router();

routerAuth.post("/singup", signUp);
routerAuth.post("/singin", signIn);

export default routerAuth;
