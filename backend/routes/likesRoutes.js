import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import prisma from "../db/prismaClient.js";

const router = express.Router();

// ✅ Add to Likes
router.post("/add", authMiddleware, async (req, res) => {
  const { productId } = req.body;
  const userId = req.user.id;

  try {
    const existing = await prisma.like.findFirst({
      where: { userId, productId }
    });

    if (existing) {
      return res.status(400).json({ message: "Already liked" });
    }

    await prisma.like.create({
      data: { userId, productId }
    });

    res.json({ message: "Added to Likes" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Remove from Likes
router.delete("/remove/:productId", authMiddleware, async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.id;

  try {
    const existing = await prisma.like.findFirst({
      where: { userId, productId }
    });

    if (!existing) {
      return res.status(404).json({ message: "Like not found" });
    }

    await prisma.like.delete({
      where: { id: existing.id }
    });

    res.json({ message: "Removed from Likes" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get My Likes
router.get("/my", authMiddleware, async (req, res) => {
  const userId = req.user.id;

  try {
    const likes = await prisma.like.findMany({
      where: { userId },
      include: { product: true }
    });
    res.json(likes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
