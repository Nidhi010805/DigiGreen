import prisma from "../db/prismaClient.js";

// Points logic
const calculatePoints = (material, size) => {
  if (material === "Plastic") return size === "Small" ? 1 : size === "Medium" ? 3 : 5;
  if (material === "Paper") return size === "Small" ? 2 : size === "Medium" ? 4 : 6;
  if (material === "Cardboard") return size === "Small" ? 3 : size === "Medium" ? 5 : 7;
  return 1;
};

// 1️⃣ User submits a return (with photo)
export const submitReturn = async (req, res) => {
  try {
    const { packageName, category, size, weight, qrCode, uniqueBarcode } = req.body;
    let photoFile = null;
    if (req.file) photoFile = req.file.filename;

    const newReturn = await prisma.returnPackaging.create({
      data: {
        user: { connect: { id: req.user.id } },
        package: {
          connectOrCreate: {
            where: { barcode: uniqueBarcode },
            create: {
              type: "Unknown",
              material: "Unknown",
              size,
              barcode: uniqueBarcode,
              recyclable: true,
              biodegradable: false,
            },
          },
        },
        packageName,
        category,
        size,
        weight: Number(weight),
        photo: photoFile,
        qrCode,
        uniqueBarcode,
        status: "initiated",
      },
    });

    const io = req.app.get("io");
    io.to(`user-${req.user.id}`).emit("newNotification", {
      message: `Your return for package "${packageName}" has been submitted.`,
      type: "Return",
      returnId: newReturn.id,
      createdAt: new Date(),
    });

    res.json({ success: true, data: newReturn });
  } catch (err) {
    console.error("Return submission failed:", err);
    res.status(500).json({ success: false, message: "Failed to submit return" });
  }
};

// 2️⃣ User simple return history
export const getUserReturns = async (req, res) => {
  try {
    const returns = await prisma.returnPackaging.findMany({
      where: { userId: req.user.id },
      orderBy: { scannedAt: "desc" },
    });
    res.json({ success: true, data: returns });
  } catch (err) {
    console.error("Failed to fetch returns:", err.message);
    res.status(500).json({ success: false, message: "Failed to get returns" });
  }
};

// 3️⃣ User initiates packaging return (by order)
export const initiatePackagingReturn = async (req, res) => {
  const userId = req.user.id;
  const { orderId } = req.body;

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { product: true },
    });

    if (!order || order.userId !== userId) {
      return res.status(404).json({ message: "Order not found or unauthorized" });
    }

    const existingReturn = await prisma.returnPackaging.findFirst({
      where: { orderId, userId },
    });

    if (existingReturn && existingReturn.status !== "rejected") {
      return res.status(400).json({ message: "Return already initiated for this order" });
    }

    if (existingReturn && existingReturn.status === "rejected") {
      await prisma.returnPackaging.delete({ where: { id: existingReturn.id } });
    }

    await prisma.returnPackaging.create({
      data: { userId, orderId, status: "pending" },
    });

    res.json({ message: "Return initiated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to initiate return" });
  }
};

// 4️⃣ Get user's detailed return history
export const getMyPackagingReturns = async (req, res) => {
  try {
    const returns = await prisma.returnPackaging.findMany({
      where: { userId: req.user.id },
      include: {
        order: { include: { product: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const formattedReturns = returns.map(r => ({
      id: r.id,
      status: r.status,
      material: r.material,
      size: r.size,
      createdAt: r.createdAt,
      product: r.order.product,
      quantity: r.order.quantity,
    }));

    res.json(formattedReturns);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch returns" });
  }
};

// 5️⃣ Retailer approves return
export const approvePackagingReturn = async (req, res) => {
  const { id } = req.params;
  const { productId } = req.body;

  if (!productId) return res.status(400).json({ message: "Product ID is required from scanner" });

  try {
    const packagingReturn = await prisma.returnPackaging.findUnique({
      where: { id },
      include: { user: true, order: true },
    });

    if (!packagingReturn) return res.status(404).json({ message: "Return not found" });
    if (packagingReturn.status === "approved") return res.status(400).json({ message: "Already approved" });

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return res.status(404).json({ message: "Product not found" });

    const quantity = packagingReturn.order.quantity || 1;
    const perUnitPoints = calculatePoints(product.material, product.size);
    const totalPoints = perUnitPoints * quantity;

    await prisma.returnPackaging.update({
      where: { id },
      data: { status: "approved", material: product.material, size: product.size },
    });

    await prisma.user.update({
      where: { id: packagingReturn.userId },
      data: { greenPoints: { increment: totalPoints } },
    });

    const message = `Your return was approved! You earned ${totalPoints} Green Points.`;

    const notification = await prisma.notification.create({
      data: { userId: packagingReturn.userId, message, type: "Return", link: "/my-returns" },
    });

    const io = req.app.get("io");
    io.to(`user-${packagingReturn.userId}`).emit("newNotification", {
      id: notification.id,
      message: notification.message,
      type: notification.type,
      link: notification.link,
      createdAt: notification.createdAt,
    });

    res.json({ message: "Return approved", pointsAdded: totalPoints });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// 6️⃣ Retailer rejects return
export const rejectPackagingReturn = async (req, res) => {
  const { id } = req.params;
  try {
    const packagingReturn = await prisma.returnPackaging.findUnique({ where: { id } });

    if (!packagingReturn) return res.status(404).json({ message: "Return not found" });
    if (packagingReturn.status !== "pending") return res.status(400).json({ message: "Already processed" });

    await prisma.returnPackaging.update({
      where: { id },
      data: { status: "rejected" },
    });

    res.json({ message: "Return rejected successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// 7️⃣ Admin - Get all returns
export const getAllPackagingReturns = async (req, res) => {
  const { status } = req.query;
  try {
    const returns = await prisma.returnPackaging.findMany({
      where: status ? { status } : {},
      include: {
        user: { select: { id: true, name: true } },
        order: { include: { product: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(returns);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch returns" });
  }
};

// 8️⃣ Admin - Get pending returns
export const getPendingPackagingReturns = async (req, res) => {
  try {
    const returns = await prisma.returnPackaging.findMany({
      where: { status: "pending" },
      include: {
        user: { select: { id: true, name: true } },
        order: { include: { product: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(returns);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch pending returns" });
  }
};
