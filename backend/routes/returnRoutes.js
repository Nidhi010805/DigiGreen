import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  submitReturn,
  getUserReturns,
  rejectReturn,
  getPendingReturns,
  getReturnsByStatus,
  sendReturnOTP,
  verifyReturnOTP,
 getRetailerHistory
} from "../controllers/returnController.js";
import multer from "multer";
import path from "path";

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// 📦 User submits return
router.post("/submit", authMiddleware, upload.single("photo"), submitReturn);

// 📦 User ke sare returns
router.get("/", authMiddleware, getUserReturns);
// 🔑 OTP based approval
router.post("/:id/send-otp", authMiddleware, sendReturnOTP);
router.post("/:id/verify-otp", authMiddleware, verifyReturnOTP);
// ⏳ Pending returns
router.get("/pending/all", authMiddleware, getPendingReturns);

// 📦 Returns by status
router.get("/:status/all", authMiddleware, getReturnsByStatus);


// ❌ Reject return
router.patch("/:id/reject", authMiddleware, rejectReturn);

router.get("/history", authMiddleware, getRetailerHistory);



export default router;
