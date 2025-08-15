import express from "express";
import { getAllProducts, getTopProducts } from "../controllers/productController.js";

const router = express.Router();

router.get("/all", getAllProducts);
router.get("/top-products", getTopProducts);

export default router;
