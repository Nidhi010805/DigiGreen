import prisma from "../db/prismaClient.js";
import fetch from "node-fetch";

const seedProducts = async () => {
  try {
    const res = await fetch("https://fakestoreapi.com/products");
    const products = await res.json();

    for (const p of products) {
      await prisma.product.create({
        data: {
          id: String(p.id),
          name: p.title,
          description: p.description,
          price: Math.round(p.price),
          category: p.category,
          imageUrl: p.image,
          material: "Plastic",
          size: "Medium",
          recyclable: true,
        },
      });
    }

    console.log("✅ Products seeded successfully");
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
  } finally {
    await prisma.$disconnect();
  }
};

seedProducts();
