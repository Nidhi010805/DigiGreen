import express from "express";
import { 
  getAllPackagingReturns,
  getPendingPackagingReturns,
  approvePackagingReturn,
  rejectPackagingReturn,
  initiatePackagingReturn,
  getMyPackagingReturns // ✅ Added for user return history
} from "../controllers/returnPackagingController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/pending", authMiddleware, getPendingPackagingReturns);
router.get("/all", authMiddleware, getAllPackagingReturns);
router.get("/my-packaging", authMiddleware, getMyPackagingReturns); // ✅ User's return history route

router.post("/initiate", authMiddleware, initiatePackagingReturn);  
router.put("/approve/:id", authMiddleware, approvePackagingReturn);
router.put("/reject/:id", authMiddleware, rejectPackagingReturn);

export default router;
