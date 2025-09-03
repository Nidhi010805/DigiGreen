import express from "express";
import multer from "multer";
import path from "path";
import authMiddleware from "../middleware/authMiddleware.js";
import { 
  getAllPackagingReturns,
  getPendingPackagingReturns,
  approvePackagingReturn,
  rejectPackagingReturn,
  initiatePackagingReturn,
  getMyPackagingReturns,
  submitReturn,
  getUserReturns
} from "../controllers/returnPackagingController.js";

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

// ------------------ USER ROUTES ------------------

// Submit a return (with photo upload)
router.post("/submit", authMiddleware, upload.single("photo"), submitReturn);

// Get all returns for logged-in user
router.get("/my-packaging", authMiddleware, getMyPackagingReturns);  // history (detailed)
router.get("/", authMiddleware, getUserReturns);                    // simple list


// ------------------ ADMIN ROUTES ------------------

// Get pending returns (for approval)
router.get("/pending", authMiddleware, getPendingPackagingReturns);

// Get all returns (admin view)
router.get("/all", authMiddleware, getAllPackagingReturns);

// Approve / Reject / Initiate return
router.post("/initiate", authMiddleware, initiatePackagingReturn);
router.put("/approve/:id", authMiddleware, approvePackagingReturn);
router.put("/reject/:id", authMiddleware, rejectPackagingReturn);

export default router;
