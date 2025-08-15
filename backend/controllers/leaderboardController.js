import prisma from "../db/prismaClient.js";

export const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await prisma.user.findMany({
      where: { role: "user" },  // Sirf normal users show honge
      orderBy: { greenPoints: "desc" },
      select: {
        id: true,
        name: true,
        profilePhoto: true,
        greenPoints: true,
        cashbackEarned: true,
        profilePhoto: true,
      },
      take: 20,  // Top 20 users
    });

    res.json(leaderboard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
};
