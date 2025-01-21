import express from "express";
import { createProducts, deleteProducts, getAllProducts, getProductsById, updateProducts } from "../controllers/productController";

const router = express.Router();

router.get("/products", getAllProducts);
router.get("/products/:id", getProductsById);
router.post("/products", createProducts);
router.put("/products/:id", updateProducts);
router.delete("/products/:id", deleteProducts);

export default router;