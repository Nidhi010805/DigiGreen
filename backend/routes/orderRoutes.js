import express from "express";
import { createOrder, getUserOrders } from "../controllers/orderController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/place", authMiddleware, createOrder);
router.get("/my", authMiddleware, getUserOrders);

export default router;
