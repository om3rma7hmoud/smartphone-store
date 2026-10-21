import { prisma } from "../config/db.js";

export async function syncProductMinPrice(productId: string) {
  const cheapest = await prisma.productVariant.findFirst({
    where: { productId },
    orderBy: { price: "asc" },
  });

  await prisma.product.update({
    where: { id: productId },
    data: { minPrice: cheapest?.price ?? null },
  });
}
