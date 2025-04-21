
import { Router } from 'express';
import { loginWithGoogle } from '../controllers/google.js';
const routerGoogle = Router();
routerGoogle.post("/google-login", loginWithGoogle);

export default routerGoogle;