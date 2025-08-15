import express from "express";
import { getNotifications, markAsRead, deleteNotification } from "../controllers/notificationController.js";
import verifyToken from "../middleware/authMiddleware.js";
import prisma from "../db/prismaClient.js"; // ✅ Isko zarur import karo

const router = express.Router();

router.get("/", verifyToken, getNotifications);
router.patch("/:id/read", verifyToken, markAsRead);
router.delete("/:id", verifyToken, deleteNotification);

router.patch("/mark-all", verifyToken, async (req, res) => {
  const userId = req.user.id;

  try {
    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
    res.json({ message: "All notifications marked as read" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to mark all as read" });
  }
});

export default router;
