// routes/userRoutes.js
import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import multer from "multer";
import fs from "fs";
import path from "path";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();
const prisma = new PrismaClient();

// ------------------- MULTER SETUP -------------------
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only images are allowed"));
  },
});

// ------------------- GET PROFILE -------------------
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        userProfile: true,
        retailer: true, // ✅ include retailer info
      },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    // fetch stats
    const [
      totalReturns,
      totalOrders,
      totalApproved,
      totalRejected,
      cashbackData,
    ] = await Promise.all([
      prisma.returnPackaging.count({ where: { userId: req.user.id } }),
      prisma.order.count({ where: { userId: req.user.id } }),
      prisma.returnPackaging.count({
        where: { userId: req.user.id, status: "approved" },
      }),
      prisma.returnPackaging.count({
        where: { userId: req.user.id, status: "rejected" },
      }),
      prisma.redeemHistory.aggregate({
        _sum: { cashbackAmount: true },
        where: { userId: req.user.id, type: "cashback" },
      }),
    ]);

    const cashbackEarned = cashbackData._sum.cashbackAmount || 0;

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      greenPoints: user.greenPoints || 0,
      profilePhoto: user.profilePhoto || null,
      mobile: user.userProfile?.mobile || null,
      address: user.userProfile?.address || null,
      retailer: user.retailer || null,
      totalReturns,
      totalOrders,
      totalApproved,
      totalRejected,
      cashbackEarned,
    });
  } catch (error) {
    console.error("Profile API Error:", error);
    res.status(500).json({ error: "Something went wrong", details: error.message });
  }
});

// ------------------- UPDATE PROFILE -------------------
router.put("/update", authMiddleware, async (req, res) => {
  try {
    const { name, email, mobile, address } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { name, email },
    });

    await prisma.userProfile.upsert({
      where: { userId: req.user.id },
      update: { mobile, address },
      create: { userId: req.user.id, mobile, address },
    });

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Update API Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ------------------- CHANGE PASSWORD -------------------
router.post("/change-password", authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ error: "Current password is incorrect" });

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashed },
    });

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Password Change Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ------------------- UPLOAD PHOTO -------------------
router.post(
  "/upload-photo",
  authMiddleware,
  upload.single("photo"),
  async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ error: "No photo uploaded" });

      const updatedUser = await prisma.user.update({
        where: { id: req.user.id },
        data: { profilePhoto: req.file.filename },
      });

      res.json({ message: "Photo uploaded successfully", user: updatedUser });
    } catch (error) {
      console.error("Upload Photo Error:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

// ------------------- REMOVE PHOTO -------------------
router.delete("/remove-photo", authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (user?.profilePhoto) {
      const filePath = path.join("uploads", user.profilePhoto);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await prisma.user.update({
      where: { id: req.user.id },
      data: { profilePhoto: null },
    });

    res.json({ message: "Profile photo removed" });
  } catch (error) {
    console.error("Remove Photo Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ------------------- DELETE ACCOUNT -------------------
router.delete("/delete-account", authMiddleware, async (req, res) => {
  try {
    await prisma.userProfile.deleteMany({ where: { userId: req.user.id } });
    await prisma.user.delete({ where: { id: req.user.id } });

    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Delete Account Error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
