import prisma from "../db/prismaClient.js";

// ✅ Fetch all products with their packages
export const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        packages: {  // Relation name = packages
          select: {
            id: true,
            type: true,
            material: true,
            size: true,
            recyclable: true,
            biodegradable: true,
            barcode: true,
          },
        },
      },
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products", error: error.message });
  }
};

// ✅ Fetch top 10 products based on order count
export const getTopProducts = async (req, res) => {
  try {
    const topProducts = await prisma.order.groupBy({
      by: ["productId"],
      _count: { productId: true },
      orderBy: { _count: { productId: "desc" } },
      take: 10,
    });

    const detailed = await Promise.all(
      topProducts.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          include: {
            packages: {
              select: {
                id: true,
                type: true,
                material: true,
                size: true,
                recyclable: true,
                biodegradable: true,
                barcode: true,
              },
            },
          },
        });
        return {
          ...product,
          purchasedCount: item._count.productId,
        };
      })
    );

    res.json(detailed);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch top products", error: error.message });
  }
};
