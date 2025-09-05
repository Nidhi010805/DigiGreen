// routes/userRoutes.js
import express from "express";
import { PrismaClient } from "@prisma/client";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();
const prisma = new PrismaClient();

// GET /profile
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
      cashbackData
    ] = await Promise.all([
      prisma.returnPackaging.count({ where: { userId: req.user.id } }),
      prisma.order.count({ where: { userId: req.user.id } }),
      prisma.returnPackaging.count({ where: { userId: req.user.id, status: "approved" } }),
      prisma.returnPackaging.count({ where: { userId: req.user.id, status: "rejected" } }),
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
      retailer: user.retailer || null, // ✅ include retailer object
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

export default router;
