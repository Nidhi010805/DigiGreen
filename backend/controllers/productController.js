import prisma from "../db/prismaClient.js";

// Sab products fetch API with image, price, description
export const getAllProducts = async (req, res) => {

  try {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        category: true,
        material: true,
        size: true,
        pointsPerUnit: true,
        price: true,
        description: true,
        imageUrl: true,
      },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products", error: error.message });
  }
};

export const getTopProducts = async (req, res) => {
  const topProducts = await prisma.order.groupBy({
    by: ['productId'],
    _count: { productId: true },
    orderBy: { _count: { productId: 'desc' } },
    take: 10,
  });

  const detailed = await Promise.all(
    topProducts.map(async (item) => {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      return {
        id: product.id,
        name: product.name,
        purchasedCount: item._count.productId,
      };
    })
  );

  res.json(detailed);
};
