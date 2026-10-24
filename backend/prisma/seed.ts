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
  images?: { url: string; altText?: string | null; order?: number }[];
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
  console.log("Starting SAFE catalog import (no customer/order deletion)...");

  const brandIds = new Map<string, string>();
  for (const brand of brands) {
    const row = await prisma.brand.upsert({
      where: { slug: brand.slug },
      update: { name: brand.name, logoUrl: brand.logoUrl ?? null },
      create: {
        name: brand.name,
        slug: brand.slug,
        logoUrl: brand.logoUrl ?? null,
      },
    });
    brandIds.set(brand.name, row.id);
  }

  const categoryIds = new Map<string, string>();
  for (const category of categories) {
    const row = await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name, type: category.type as CategoryType },
      create: {
        name: category.name,
        slug: category.slug,
        type: category.type as CategoryType,
      },
    });
    categoryIds.set(category.name, row.id);
  }

  let created = 0;
  let updated = 0;

  for (const product of products as SeedProduct[]) {
    const brandId = brandIds.get(product.brand);
    const categoryId = categoryIds.get(product.category);
    if (!brandId) throw new Error(`Brand not found: ${product.brand}`);
    if (!categoryId) throw new Error(`Category not found: ${product.category}`);

    const minPrice = product.variants.length
      ? Math.min(...product.variants.map((v) => v.price))
      : null;

    const existing = await prisma.product.findUnique({
      where: { slug: product.slug },
    });
    const saved = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        description: product.description,
        brandId,
        categoryId,
        minPrice,
        screenSize: product.screenSize ?? null,
        screenType: product.screenType ?? null,
        processor: product.processor ?? null,
        battery: product.battery ?? null,
        camera: product.camera ?? null,
        os: product.os ?? null,
        releaseYear: product.releaseYear ?? null,
        isPublished: product.isPublished ?? true,
        tags: product.tags as ProductTag[],
      },
      create: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        brandId,
        categoryId,
        minPrice,
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
      },
    });
    if (existing) updated++;
    else created++;

    // Upsert variants by globally unique SKU. Existing stock is preserved on reruns.
    for (const v of product.variants) {
      const currentVariant = await prisma.productVariant.findUnique({
        where: { sku: v.sku },
      });
      if (currentVariant) {
        await prisma.productVariant.update({
          where: { sku: v.sku },
          data: {
            productId: saved.id,
            color: v.color,
            colorHex: v.colorHex ?? null,
            storage: v.storage ?? null,
            ram: v.ram ?? null,
            price: v.price,
            compareAtPrice: v.compareAtPrice ?? null,
            // Keep live inventory; seed stock is only used when creating a variant.
          },
        });
      } else {
        await prisma.productVariant.create({
          data: {
            productId: saved.id,
            color: v.color,
            colorHex: v.colorHex ?? null,
            storage: v.storage ?? null,
            ram: v.ram ?? null,
            sku: v.sku,
            price: v.price,
            compareAtPrice: v.compareAtPrice ?? null,
            stock: v.stock,
          },
        });
      }
    }

    for (const image of product.images ?? []) {
      const found = await prisma.productImage.findFirst({
        where: { productId: saved.id, url: image.url },
      });
      if (!found) {
        await prisma.productImage.create({
          data: {
            productId: saved.id,
            url: image.url,
            altText: image.altText ?? null,
            order: image.order ?? 0,
          },
        });
      }
    }
  }

  console.log(
    `Catalog import finished. Created ${created} products, updated ${updated} products.`,
  );
  console.log(
    "Preserved users, addresses, orders, order items, carts, wishlists, and reviews.",
  );
  console.log(
    "Existing variant stock was preserved; initial stock was set only for newly created variants.",
  );
}

seed()
  .catch((error) => {
    console.error("Catalog import failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
