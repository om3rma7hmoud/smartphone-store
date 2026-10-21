import { prisma } from "../config/db.js";

export async function syncProductRating(productId: string) {
  const result = await prisma.review.aggregate({
    where: { productId },
    _avg: { rating: true },
    _count: { rating: true },
  });

  await prisma.product.update({
    where: { id: productId },
    data: {
      rating: result._avg.rating ?? 0,
      reviewCount: result._count.rating,
    },
  });
}
