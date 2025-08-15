import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { redeemPoints, getRedeemHistory } from "../controllers/redeemController.js";

const router = express.Router();

router.post("/redeem", authMiddleware, redeemPoints);
router.get("/history", authMiddleware, getRedeemHistory);

export default router;
