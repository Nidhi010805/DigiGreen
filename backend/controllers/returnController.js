import prisma from "../db/prismaClient.js";

// Submit a return
export const submitReturn = async (req, res) => {
  try {
    const { packageName, category, size, weight, qrCode, uniqueBarcode } = req.body;
    let photoFile = null;
    if (req.file) photoFile = req.file.filename; // multer se aaya file

    // Create new return
    const newReturn = await prisma.returnPackaging.create({
      data: {
        user: { connect: { id: req.user.id } },
        package: {
          connectOrCreate: {
            where: { barcode: uniqueBarcode }, // unique field
            create: {
              type: "Unknown",          // default value
              material: "Unknown",      // default value
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

    // Real-time notification
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

// Get all returns for logged-in user
export const getUserReturns = async (req, res) => {
  try {
    const returns = await prisma.returnPackaging.findMany({
      where: { userId: req.user.id },
      orderBy: { scannedAt: "desc" }, // scannedAt better than createdAt
    });
    res.json({ success: true, data: returns });
  } catch (err) {
    console.error("Failed to fetch returns:", err.message);
    res.status(500).json({ success: false, message: "Failed to get returns" });
  }
};
