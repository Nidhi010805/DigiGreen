import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  submitReturn,
  getUserReturns,
  approveReturn,
  rejectReturn,
  getPendingReturns,
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


router.post("/submit", authMiddleware, upload.single("photo"), submitReturn);

// 2. Get all returns of logged-in user
router.get("/", authMiddleware, getUserReturns);


// 3. Approve a return
router.patch("/:id/approve", authMiddleware, approveReturn);

// 4. Reject a return
router.patch("/:id/reject", authMiddleware, rejectReturn);

// 5. Get all pending returns
router.get("/pending/all", authMiddleware, getPendingReturns);

export default router;
