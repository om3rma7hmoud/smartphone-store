import { PrismaClient, CategoryType, ProductTag } from "@prisma/client";
import brands from "./seed/brands.json";
import categories from "./seed/categories.json";
import products from "./seed/products.json";

type SeedProduct = {
  name: string;
  slug: string;
  description: string;
  brand: string;
  category: string;
  screenSize?: string | null;
  screenType?: string | null;
  processor?: string | null;
  battery?: string | null;
  camera?: string | null;
  os?: string | null;
  releaseYear?: number | null;
  isPublished?: boolean;
  tags: string[];
  images?: {
    url: string;
    altText?: string | null;
    order?: number;
  }[];
  variants: {
    color: string;
    colorHex?: string | null;
    storage?: string | null;
    ram?: string | null;
    sku: string;
    price: number;
    compareAtPrice?: number | null;
    stock: number;
  }[];
};

const prisma = new PrismaClient();

async function seed() {
  console.log("Starting product catalog seed...");

  // Destructive reset: remove all customer/admin and transactional data too.
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.review.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();

  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.brand.deleteMany();

  const brandIds = new Map<string, string>();
  for (const brand of brands) {
    const row = await prisma.brand.create({
      data: {
        name: brand.name,
        slug: brand.slug,
        logoUrl: brand.logoUrl ?? null,
      },
    });
    brandIds.set(brand.name, row.id);
  }

  const categoryIds = new Map<string, string>();
  for (const category of categories) {
    const row = await prisma.category.create({
      data: {
        name: category.name,
        slug: category.slug,
        type: category.type as CategoryType,
      },
    });
    categoryIds.set(category.name, row.id);
  }

  for (const product of products as SeedProduct[]) {
    const brandId = brandIds.get(product.brand);
    const categoryId = categoryIds.get(product.category);
    if (!brandId) throw new Error(`Brand not found: ${product.brand}`);
    if (!categoryId) throw new Error(`Category not found: ${product.category}`);

    await prisma.product.create({
      data: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        brandId,
        categoryId,
        minPrice: product.variants.length
          ? Math.min(...product.variants.map((v) => v.price))
          : null,
        screenSize: product.screenSize ?? null,
        screenType: product.screenType ?? null,
        processor: product.processor ?? null,
        battery: product.battery ?? null,
        camera: product.camera ?? null,
        os: product.os ?? null,
        releaseYear: product.releaseYear ?? null,
        isPublished: product.isPublished ?? true,
        rating: 0,
        reviewCount: 0,
        tags: product.tags as ProductTag[],
        images: {
          create: (product.images ?? []).map((image) => ({
            url: image.url,
            altText: image.altText ?? null,
            order: image.order ?? 0,
          })),
        },
        variants: {
          create: product.variants.map((variant) => ({
            color: variant.color,
            colorHex: variant.colorHex ?? null,
            storage: variant.storage ?? null,
            ram: variant.ram ?? null,
            sku: variant.sku,
            price: variant.price,
            compareAtPrice: variant.compareAtPrice ?? null,
            stock: variant.stock,
          })),
        },
      },
    });
  }

  console.log(
    `Created ${brands.length} brands, ${categories.length} categories, and ${products.length} products.`,
  );
  console.log(
    "No users, orders, carts, reviews, wishlists, or addresses were created.",
  );
}

seed()
  .catch((error) => {
    console.error("Catalog seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
