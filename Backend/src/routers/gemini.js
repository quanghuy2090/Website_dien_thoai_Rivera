import express from "express";
import { explainProduct, generateContent } from "../controllers/gemini.js";


const routerGemini = express.Router();

routerGemini.post("/generate", generateContent);
routerGemini.post("/explain/:productId", explainProduct)

export default routerGemini;
