import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import prisma from "../db/prismaClient.js";

const router = express.Router();

// Add to cart
router.post("/add", authMiddleware, async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id;

  try {
    const existing = await prisma.cart.findUnique({
      where: { userId_productId: { userId, productId } }
    });

    if (existing) {
      await prisma.cart.update({
        where: { userId_productId: { userId, productId } },
        data: { quantity: existing.quantity + quantity }
      });
    } else {
      await prisma.cart.create({
        data: { userId, productId, quantity }
      });
    }

    res.json({ message: "Added to cart" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user's cart
router.get("/my", authMiddleware, async (req, res) => {
  const userId = req.user.id;

  try {
    const cart = await prisma.cart.findMany({
      where: { userId },
      include: { product: true }
    });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove cart item
router.delete("/remove/:id", authMiddleware, async (req, res) => {
  try {
    await prisma.cart.delete({
      where: { id: req.params.id }
    });
    res.json({ message: "Removed from cart" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
