import prisma from "../db/prismaClient.js";

// ---------------- Green Points Calculation ----------------
function calculateGreenPoints({ material, size, weight, itemsCount }) {
  let points = 0;

  const materialFactors = {
    plastic: 20,
    cardboard: 15,
    glass: 10,
    metal: 25,
    unknown: 5,
  };
  const factor = materialFactors[material?.toLowerCase()] || materialFactors.unknown;
  points += factor * (weight || 0);

  const sizeBonus = { small: 2, medium: 5, large: 10 };
  points += sizeBonus[size?.toLowerCase()] || 0;

  if (itemsCount > 20) points *= 1.5;
  else if (itemsCount > 5) points *= 1.2;

  return Math.round(points * 100) / 100;
}

// ---------------- OTP Helpers ----------------
function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit OTP
}

// 1️⃣ Generate OTP (demo mode – no email)
export const sendReturnOTP = async (req, res) => {
  try {
    const { id } = req.params;

    const returnRequest = await prisma.returnPackaging.findUnique({
      where: { id },
      include: { user: true },
    });
    if (!returnRequest) {
      return res.status(404).json({ success: false, message: "Return not found" });
    }

    const otp = generateOTP();
    const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 min

    await prisma.returnPackaging.update({
      where: { id },
      data: { otpCode: otp, otpExpiry: expiry },
    });

    console.log(`Generated OTP for ReturnID ${id}:`, otp);

    // 🟢 Demo ke liye OTP frontend me bhej rahe
    res.json({ success: true, message: "OTP generated", otp });
  } catch (err) {
    console.error("Send OTP failed:", err);
    res.status(500).json({ success: false, message: "Failed to generate OTP" });
  }
};

// 2️⃣ Verify OTP + Approve Return
export const verifyReturnOTP = async (req, res) => {
  try {
    const { id } = req.params;
    const { otp } = req.body;

    // 🔹 Fetch return request with package & user details
    const returnRequest = await prisma.returnPackaging.findUnique({
      where: { id },
      include: { user: true, package: true },
    });

    if (!returnRequest) {
      return res.status(404).json({ success: false, message: "Return not found" });
    }

    if (!returnRequest.otpCode || !returnRequest.otpExpiry) {
      return res.status(400).json({ success: false, message: "OTP not generated" });
    }

    if (new Date() > new Date(returnRequest.otpExpiry)) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    if (returnRequest.otpCode !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    // 🔹 Fetch retailer who is approving
    const retailer = await prisma.retailer.findUnique({
      where: { userId: req.user.id },
    });
    if (!retailer) {
      return res.status(404).json({ success: false, message: "Retailer not found" });
    }

    // ✅ Approve return + assign retailer
    const approved = await prisma.returnPackaging.update({
      where: { id },
      data: {
        status: "approved",
        otpCode: null,
        otpExpiry: null,
        retailerId: retailer.id,
      },
    });

    // ✅ Calculate points
    const itemsCount = await prisma.returnPackaging.count({
      where: { userId: returnRequest.userId, status: "approved" },
    });

    const points = calculateGreenPoints({
      material: returnRequest.package?.material || "unknown",
      size: returnRequest.size,
      weight: returnRequest.weight,
      itemsCount,
    });

    // ✅ Update user's green points
    await prisma.user.update({
      where: { id: returnRequest.userId },
      data: { greenPoints: { increment: points } },
    });

    res.json({
      success: true,
      message: `Return approved via OTP – Earned ${points} Green Points`,
      reward: { points, value: `₹${points}` },
      data: approved,
    });

  } catch (err) {
    console.error("Verify OTP failed:", err);
    res.status(500).json({ success: false, message: "OTP verification failed" });
  }
};



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
        // ✅ remove retailerId
        // retailerId: null, 
        // 🔹 only connect later when retailer approves
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
      include: { 
        package: true, 
      },
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
    const { otp } = req.body; // 🔹 OTP aayega frontend se

    const returnRequest = await prisma.returnPackaging.findUnique({
      where: { id: Number(id) }, // ✅ ensure number
      include: { package: true },
    });
    if (!returnRequest) {
      return res.status(404).json({ success: false, message: "Return not found" });
    }

    if (returnRequest.status === "approved") {
      return res.status(400).json({ success: false, message: "Already approved" });
    }

    // 🔹 OTP verify karo (agar OTP flow use kar rahe ho)
    if (returnRequest.otp && returnRequest.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }
// ✅ Pehle retailer ka record nikal lo
const retailer = await prisma.retailer.findUnique({
  where: { userId: req.user.id },
});
if (!retailer) {
  return res.status(404).json({ success: false, message: "Retailer not found" });
}



   const updated = await prisma.returnPackaging.update({
  where: { id: Number(id) },
  data: { 
    status: "approved", 
    retailerId: retailer.id,
    otpCode: null,
    otpExpiry: null, // ✅ clear OTP expiry
  },
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


export const rejectReturn = async (req, res) => {
  try {
    // ✅ Role check
    if (req.user.role !== "retailer") {
      return res.status(403).json({ success: false, message: "Only retailers can reject returns" });
    }

    const { id } = req.params;

    // Step 1: Get the return
    const returnRequest = await prisma.returnPackaging.findUnique({ where: { id } });
    if (!returnRequest) 
      return res.status(404).json({ success: false, message: "Return not found" });

    if (returnRequest.status === "rejected") {
      return res.status(400).json({ success: false, message: "Already rejected" });
    }

    // Step 2: Get retailer record
    const retailer = await prisma.retailer.findUnique({ where: { userId: req.user.id } });
    if (!retailer) 
      return res.status(404).json({ success: false, message: "Retailer not found" });

    // Step 3: Update return
    const updated = await prisma.returnPackaging.update({
      where: { id },
      data: { status: "rejected", retailerId: retailer.id },
    });

    res.json({ success: true, message: "Return rejected", data: updated });
  } catch (err) {
    console.error("Reject return failed:", err);
    res.status(500).json({ success: false, message: "Failed to reject return" });
  }
};

export const getReturnsByStatus = async (req, res) => {
  try {
    const { status } = req.params;

    // Step 1: Verify role
    if (req.user.role !== "retailer") {
      return res.status(403).json({ message: "Only retailers can view these returns" });
    }

    // Step 2: Get retailer record
    const retailer = await prisma.retailer.findUnique({ where: { userId: req.user.id } });
    if (!retailer) {
      return res.status(404).json({ message: "Retailer not found" });
    }

    // Step 3: Build query
    let where = {};
    if (status === "pending") {
      where = { status: "initiated", retailerId: null };
    } else if (status === "approved") {
      where = { status: "approved", retailerId: retailer.id };
    } else if (status === "rejected") {
      where = { status: "rejected", retailerId: retailer.id };
    } else {
      return res.status(400).json({ message: "Invalid status" });
    }

    // Step 4: Fetch returns
    const returns = await prisma.returnPackaging.findMany({
      where,
      include: { user: true, package: true },
      orderBy: { scannedAt: "desc" },
    });

    res.json({ success: true, data: returns });
  } catch (error) {
    console.error("Failed to fetch returns:", error);
    res.status(500).json({ message: "Failed to fetch returns", error: error.message });
  }
};

export const getPendingReturns = async (req, res) => {
  try {
    // ✅ Role check
    if (req.user.role !== "retailer") {
      return res.status(403).json({ success: false, message: "Only retailers can view pending returns" });
    }

    const pending = await prisma.returnPackaging.findMany({
      where: { status: "initiated", retailerId: null },
      orderBy: { scannedAt: "desc" },
      include: { 
        user: { select: { id: true, name: true, email: true } },
        package: true // ✅ include package details
      },
    });

    res.json({ success: true, data: pending });
  } catch (err) {
    console.error("Fetch pending returns failed:", err);
    res.status(500).json({ success: false, message: "Failed to fetch pending returns" });
  }
};





// ✅ Fetch retailer history
export const getRetailerHistory = async (req, res) => {
  try {
    // ✅ Role check
    if (req.user.role !== "retailer") {
      return res
        .status(403)
        .json({ success: false, message: "Only retailers can view history" });
    }

    // ✅ Get retailer record
  const retailer = await prisma.retailer.findUnique({
      where: { userId: req.user.id },
    });
    if (!retailer) {
      return res
        .status(404)
        .json({ success: false, message: "Retailer not found" });
    }

    // ✅ Fetch all approved/rejected returns for this retailer
    const history = await prisma.returnPackaging.findMany({
      where: {
        retailerId: retailer.id,
        status: { in: ["approved", "rejected"] },
      },
      include: {
        user: { select: { id: true, name: true, email: true } }, // jisne return kiya
        package: {
          select: {
            id: true,
            type: true,      // ✅ package ke type
            material: true,
            size: true,
            barcode: true,
            product: {       // ✅ product ka category lene ke liye
              select: { category: true }
            }
          },
        },
      },
      orderBy: { scannedAt: "desc" },
    });

    // ✅ Format response for frontend
    const formatted = history.map((h) => ({
      returnId: h.id,
      userName: h.user?.name || "Unknown User",
      userEmail: h.user?.email || null,
      packageName: h.packageName || h.package?.type || "Unnamed Package",
      material: h.package?.material || "Unknown",
      size: h.package?.size || h.size || "N/A",

      // ✅ category priority: package->product->returnPackaging
      category:
        h.package?.product?.category || h.category || "Other",

      barcode: h.package?.barcode || h.uniqueBarcode || "N/A",
      status: h.status,
      actionAt: h.updatedAt || null, // agar approved/rejected time store ho
      scannedAt: h.scannedAt,
    }));

    res.json({ success: true, data: formatted });
  } catch (err) {
    console.error("Failed to fetch retailer history:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch history" });
  }
};
