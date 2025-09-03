import prisma from "../db/prismaClient.js";

// 🔹 Green Points Calculation Logic
function calculateGreenPoints({ material, size, weight, itemsCount }) {
  let points = 0;

  // 1. Material factor (per kg)
  const materialFactors = {
    plastic: 20, // ₹20/kg
    cardboard: 15,
    glass: 10,
    metal: 25,
    unknown: 5,
  };
  const factor = materialFactors[material?.toLowerCase()] || materialFactors.unknown;

  // 2. Base points from weight (kg)
  points += factor * (weight || 0);

  // 3. Size bonus
  const sizeBonus = {
    small: 2,
    medium: 5,
    large: 10,
  };
  points += sizeBonus[size?.toLowerCase()] || 0;

  // 4. Loyalty multiplier (more returns → more rewards)
  if (itemsCount > 20) points *= 1.5;
  else if (itemsCount > 5) points *= 1.2;

  return Math.round(points * 100) / 100; // round 2 decimals
}

// ------------------------ Submit Return ------------------------
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
        scannedAt: new Date(),
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

// ------------------------ User Returns ------------------------
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

// ------------------------ Approve Return (Reward Logic) ------------------------
export const approveReturn = async (req, res) => {
  try {
    const { id } = req.params;

    const returnRequest = await prisma.returnPackaging.findUnique({
      where: { id },
      include: { package: true },
    });
    if (!returnRequest) return res.status(404).json({ success: false, message: "Return not found" });

    if (returnRequest.status === "approved") {
      return res.status(400).json({ success: false, message: "Already approved" });
    }

    // ✅ Approve return
    const updated = await prisma.returnPackaging.update({
      where: { id },
      data: { status: "approved" },
    });

    // ✅ User ke total approved returns count
    const itemsCount = await prisma.returnPackaging.count({
      where: { userId: updated.userId, status: "approved" },
    });

    // ✅ Calculate reward
    const points = calculateGreenPoints({
      material: returnRequest.package?.material || "unknown",
      size: returnRequest.size,
      weight: returnRequest.weight,
      itemsCount,
    });

    // ✅ Update user wallet
    await prisma.user.update({
      where: { id: updated.userId },
      data: { greenPoints: { increment: points } },
    });

    res.json({
      success: true,
      message: `Return approved – Earned ${points} Green Points`,
      reward: { points, value: `₹${points}` },
      data: updated,
    });
  } catch (err) {
    console.error("Approve return failed:", err);
    res.status(500).json({ success: false, message: "Failed to approve return" });
  }
};

// ------------------------ Reject Return ------------------------
export const rejectReturn = async (req, res) => {
  try {
    const { id } = req.params;

    const returnRequest = await prisma.returnPackaging.findUnique({ where: { id } });
    if (!returnRequest) return res.status(404).json({ success: false, message: "Return not found" });

    if (returnRequest.status === "rejected") {
      return res.status(400).json({ success: false, message: "Already rejected" });
    }

    const updated = await prisma.returnPackaging.update({
      where: { id },
      data: { status: "rejected" },
    });

    res.json({ success: true, message: "Return rejected", data: updated });
  } catch (err) {
    console.error("Reject return failed:", err);
    res.status(500).json({ success: false, message: "Failed to reject return" });
  }
};

// ------------------------ Pending Returns ------------------------
export const getPendingReturns = async (req, res) => {
  try {
    const pending = await prisma.returnPackaging.findMany({
      where: { status: "initiated" },
      orderBy: { scannedAt: "desc" },
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    res.json({ success: true, data: pending });
  } catch (err) {
    console.error("Fetch pending returns failed:", err);
    res.status(500).json({ success: false, message: "Failed to fetch pending returns" });
  }
};
