import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    // Check if token is blacklisted
    const blacklisted = await prisma.blacklistedToken.findFirst({
      where: { token },
    });
    if (blacklisted) {
      return res.status(401).json({ error: "Token is invalid or expired" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) {
      return res.status(401).json({ error: "User Not Found" });
    }

    req.user = { id: user.id, role: user.role }; 
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid Token" });
  }
};

export default authMiddleware;
