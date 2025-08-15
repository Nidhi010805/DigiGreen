import prisma from "../db/prismaClient.js";

export const createOrder = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || quantity < 1) {
      return res.status(400).json({ message: "Product and valid quantity required" });
    }

    const order = await prisma.order.create({
      data: {
        userId: req.user.id,
        productId,
        quantity,
      },
    });

    const message = `Your order for Product ID ${productId} with quantity ${quantity} has been placed successfully.`;

    // Save Notification to DB
    const notification = await prisma.notification.create({
      data: {
        userId: req.user.id,
        message,
        type: "Order",         
        link: "/user/orders",   
      },
    });

    // Emit real-time notification to that user
    const io = req.app.get("io");
    io.to(`user-${req.user.id}`).emit("newNotification", {
      id: notification.id,
      message: notification.message,
      type: notification.type,
      link: notification.link,
      createdAt: notification.createdAt,
    });

    res.json({ message: "Order placed successfully", order });
  } catch (err) {
    console.error("Order creation failed:", err.message);
    res.status(500).json({ message: "Order failed" });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: {
        product: true,
        returnPackaging: true,   // Yahan relation include karo
      },
      orderBy: { orderedAt: "desc" },
    });

    const ordersWithReturnFlag = orders.map(order => ({
      ...order,
      isReturnInitiated: order.returnPackaging 
        && (order.returnPackaging.status === "pending" || order.returnPackaging.status === "initiated"),
    }));

    res.json(ordersWithReturnFlag);
  } catch (err) {
    console.error("Failed to fetch orders:", err.message);
    res.status(500).json({ message: "Failed to get orders" });
  }
};

