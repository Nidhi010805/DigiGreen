import prisma from "../db/prismaClient.js";

// Redeem Logic - Cashback or Product
export const redeemPoints = async (req, res) => {
  const { type, item, pointsUsed } = req.body;

  if (!type || !item || !pointsUsed) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    if (user.greenPoints < pointsUsed) {
      return res.status(400).json({ error: "Not enough Green Points" });
    }

    let cashbackAmount = 0;

    if (type === "cashback") {
      cashbackAmount = pointsUsed * 1; // Example ₹0.1 per point

      // Deduct Points & Add cashbackEarned
      await prisma.user.update({
        where: { id: req.user.id },
        data: {
          greenPoints: { decrement: pointsUsed },
          cashbackEarned: { increment: cashbackAmount },
        },
      });
    } else {
      // Only deduct points for product redeem
      await prisma.user.update({
        where: { id: req.user.id },
        data: { greenPoints: { decrement: pointsUsed } },
      });
    }

    // Record Redeem History
    const redeemRecord = await prisma.redeemHistory.create({
      data: {
        userId: req.user.id,
        item,
        type,
        pointsUsed,
        cashbackAmount,
      },
    });

    // Notification Message
    const message = `You successfully redeemed ${pointsUsed} Green Points for ${type === "product" ? item : `₹${cashbackAmount} Cashback`}`;

    const notification = await prisma.notification.create({
      data: {
        userId: req.user.id,
        message,
        type: "Reward",
        link: "/my-rewards",
      },
    });

    // Real-Time Notification Emit
    const io = req.app.get("io");
    io.to(`user-${req.user.id}`).emit("newNotification", {
      id: notification.id,
      message: notification.message,
      type: notification.type,
      link: notification.link,
      createdAt: notification.createdAt,
    });

    res.json({
      message: "Redeem successful",
      cashbackAmount,
      redeemRecord,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Get Redeem History
export const getRedeemHistory = async (req, res) => {
  try {
    const history = await prisma.redeemHistory.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
    });
    res.json(history);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch history" });
  }
};
