
import prisma from "../db/prismaClient.js";
import fetch from "node-fetch";

const seedProducts = async () => {
  try {
    // 🔹 Get product data from FakeStore API
    const res = await fetch("https://fakestoreapi.com/products?limit=20");
    const products = await res.json();

    let index = 0;
    for (const p of products) {
      // Product create
      const createdProduct = await prisma.product.create({
        data: {
          id: String(p.id), // Prisma expects String id
          name: p.title,
          description: p.description,
          category: p.category,
          imageUrl: p.image,
          recyclable: true,
          price: Math.round(p.price),
          pointsPerUnit: Math.floor(p.price / 10)
        },
      });

      // Package create (linked to product)
      await prisma.package.create({
        data: {
          productId: createdProduct.id,
          type: ["Box", "Wrapper", "Bottle", "Jar"][index % 4],
          material: ["Cardboard", "Paper", "Plastic", "Glass"][index % 4],
          size: ["Small", "Medium", "Large", "500ml"][index % 4],
          recyclable: true,
          biodegradable: index % 2 === 0, // alternate biodegradable
          barcode: `${Math.floor(100000000000 + Math.random() * 900000000000)}`,
        },
      });

      index++;
    }

    console.log("✅ Products + Packages seeded successfully");
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
  } finally {
    await prisma.$disconnect();
  }
};

seedProducts();
