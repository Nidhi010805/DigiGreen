import prisma from "../db/prismaClient.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

export const signup = async (req, res) => {
  const { role } = req.body;

  try {
    const { email } = req.body;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    let newUser;

   if (role === "retailer") {
  const { name, storeName, location, phone, acceptedItems, category } = req.body;

  if (!location || !location.city || !location.lat || !location.lng) {
    return res.status(400).json({ message: "Complete location is required" });
  }

  newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: "retailer",
      retailer: {
        create: {
          storeName,
          category,
          phone,
          acceptedItems, // ensure array
          location: {
            city: location.city,
            lat: location.lat,
            lng: location.lng
          },
        },
      },
    },
    include: { retailer: true },
  });


    } else {
      const { name, mobile, address } = req.body;

      newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: "user",
          userProfile: {
            create: { mobile, address },
          },
        },
        include: { userProfile: true },
      });
    }

    const token = generateToken(newUser);
    res.status(201).json({ user: newUser, token });
  } catch (error) {
    res.status(500).json({ message: "Signup failed", error: error.message });
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email },include: { retailer: true, userProfile: true }, });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(400).json({ message: "Incorrect password" });

    const token = generateToken(user);

    res.status(200).json({
      token,
      role: user.role,
      user,
        
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

export const logout = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(400).json({ message: "Token missing" });
  }

  try {
    await prisma.blacklistedToken.create({
      data: { token },
    });
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "Logout failed", error: error.message });
  }
};
