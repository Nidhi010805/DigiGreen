import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { submitReturn, getUserReturns } from "../controllers/returnController.js";
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

// Submit a return
router.post("/submit", authMiddleware, upload.single("photo"), submitReturn);

// Get user returns
router.get("/", authMiddleware, getUserReturns);

export default router;
