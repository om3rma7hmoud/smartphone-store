import {
  PrismaClient,
  CategoryType,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  Role,
  ProductTag,
} from "@prisma/client";

import cart from "./seed/cart.json";
import users from "./seed/users.json";
import brands from "./seed/brands.json";
import orders from "./seed/orders.json";
import reviews from "./seed/reviews.json";
import products from "./seed/products.json";
import wishlist from "./seed/wishlist.json";
import addresses from "./seed/addresses.json";
import categories from "./seed/categories.json";

const prisma = new PrismaClient();

const seed = async () => {
  console.log("Starting database seed...");

  // ============================================================
  // CLEAN DATABASE
  // ============================================================

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.review.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.address.deleteMany();
  await prisma.category.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.user.deleteMany();

  console.log("Database cleaned.");

  // ============================================================
  // BRANDS
  // ============================================================

  const brandMap = new Map<string, string>();

  for (const brand of brands) {
    const created = await prisma.brand.create({
      data: {
        name: brand.name,
        slug: brand.slug,
        logoUrl: brand.logoUrl ?? null,
      },
    });

    brandMap.set(brand.name, created.id);
  }

  console.log(`Created ${brands.length} brands.`);

  // ============================================================
  // CATEGORIES
  // ============================================================

  const categoryMap = new Map<string, string>();

  for (const category of categories) {
    const created = await prisma.category.create({
      data: {
        name: category.name,
        slug: category.slug,
        type: category.type as CategoryType,
      },
    });

    categoryMap.set(category.name, created.id);
  }

  console.log(`Created ${categories.length} categories.`);

  // ============================================================
  // PRODUCTS + VARIANTS + IMAGES
  // ============================================================

  const productMap = new Map<string, string>();
  const variantMap = new Map<string, string>();

  for (const product of products) {
    const brandId = brandMap.get(product.brand);
    const categoryId = categoryMap.get(product.category);

    if (!brandId) {
      throw new Error(`Brand not found: ${product.brand}`);
    }

    if (!categoryId) {
      throw new Error(`Category not found: ${product.category}`);
    }

    // Calculate minimum variant price
    const minPrice = product.variants.length
      ? Math.min(...product.variants.map((variant) => variant.price))
      : null;

    const createdProduct = await prisma.product.create({
      data: {
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

        // These will be updated after creating reviews
        rating: 0,
        reviewCount: 0,

        tags: product.tags as ProductTag[],

        // display is optional and doesn't exist
        // in the current products.json
      },
    });

    productMap.set(product.slug, createdProduct.id);

    // ------------------------------------------------------------
    // IMAGES
    // ------------------------------------------------------------

    if (product.images?.length) {
      await prisma.productImage.createMany({
        data: product.images.map((image) => ({
          productId: createdProduct.id,
          url: image.url,
          altText: image.altText ?? null,
          order: image.order ?? 0,
        })),
      });
    }

    // ------------------------------------------------------------
    // VARIANTS
    // ------------------------------------------------------------

    for (const variant of product.variants) {
      const createdVariant = await prisma.productVariant.create({
        data: {
          productId: createdProduct.id,

          color: variant.color,
          colorHex: variant.colorHex ?? null,

          storage: variant.storage ?? null,
          ram: variant.ram ?? null,

          sku: variant.sku,

          price: variant.price,
          compareAtPrice: variant.compareAtPrice ?? null,

          stock: variant.stock,
        },
      });

      variantMap.set(variant.sku, createdVariant.id);
    }
  }

  console.log(`Created ${products.length} products.`);

  // ============================================================
  // USERS
  // ============================================================

  const userMap = new Map<string, string>();

  for (const user of users) {
    const createdUser = await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,

        // Passwords in users.json are already bcrypt hashes
        password: user.password,

        phone: user.phone ?? null,
        role: user.role as Role,
        isVerified: user.isVerified,
      },
    });

    userMap.set(user.email, createdUser.id);
  }

  console.log(`Created ${users.length} users.`);

  // ============================================================
  // ADDRESSES
  // ============================================================

  const userAddresses = new Map<string, string[]>();

  for (const address of addresses) {
    const userId = userMap.get(address.userEmail);

    if (!userId) {
      throw new Error(`User not found: ${address.userEmail}`);
    }

    const createdAddress = await prisma.address.create({
      data: {
        userId,

        fullName: address.fullName,
        phone: address.phone,

        city: address.city,
        area: address.area,
        street: address.street,

        isDefault: address.isDefault,
      },
    });

    const existing = userAddresses.get(address.userEmail) ?? [];

    existing.push(createdAddress.id);

    userAddresses.set(address.userEmail, existing);
  }

  console.log(`Created ${addresses.length} addresses.`);

  // ============================================================
  // REVIEWS
  // ============================================================

  for (const review of reviews) {
    const userId = userMap.get(review.userEmail);
    const productId = productMap.get(review.productSlug);

    if (!userId) {
      throw new Error(`User not found: ${review.userEmail}`);
    }

    if (!productId) {
      throw new Error(`Product not found: ${review.productSlug}`);
    }

    await prisma.review.create({
      data: {
        userId,
        productId,

        rating: review.rating,
        comment: review.comment,
      },
    });
  }

  console.log(`Created ${reviews.length} reviews.`);

  // ============================================================
  // UPDATE PRODUCT RATINGS
  // ============================================================

  const productRatings = new Map<
    string,
    {
      total: number;
      count: number;
    }
  >();

  for (const review of reviews) {
    const current = productRatings.get(review.productSlug) ?? {
      total: 0,
      count: 0,
    };

    current.total += review.rating;
    current.count += 1;

    productRatings.set(review.productSlug, current);
  }

  for (const [productSlug, data] of productRatings) {
    const productId = productMap.get(productSlug);

    if (!productId) {
      throw new Error(`Product not found: ${productSlug}`);
    }

    const averageRating = Number((data.total / data.count).toFixed(1));

    await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        rating: averageRating,
        reviewCount: data.count,
      },
    });
  }

  console.log("Updated product ratings.");

  // ============================================================
  // WISHLIST
  // ============================================================

  for (const item of wishlist) {
    const userId = userMap.get(item.userEmail);
    const productId = productMap.get(item.productSlug);

    if (!userId) {
      throw new Error(`User not found: ${item.userEmail}`);
    }

    if (!productId) {
      throw new Error(`Product not found: ${item.productSlug}`);
    }

    await prisma.wishlistItem.create({
      data: {
        userId,
        productId,
      },
    });
  }

  console.log(`Created ${wishlist.length} wishlist items.`);

  // ============================================================
  // CART
  // ============================================================

  for (const item of cart) {
    const userId = userMap.get(item.userEmail);
    const variantId = variantMap.get(item.sku);

    if (!userId) {
      throw new Error(`User not found: ${item.userEmail}`);
    }

    if (!variantId) {
      throw new Error(`Variant not found: ${item.sku}`);
    }

    const variant = await prisma.productVariant.findUnique({
      where: {
        id: variantId,
      },
    });

    if (!variant) {
      throw new Error(`Variant not found: ${item.sku}`);
    }

    await prisma.cartItem.create({
      data: {
        userId,

        productId: variant.productId,
        variantId,

        quantity: item.quantity,
      },
    });
  }

  console.log(`Created ${cart.length} cart items.`);

  // ============================================================
  // ORDERS
  // ============================================================

  for (const order of orders) {
    const userId = userMap.get(order.userEmail);

    if (!userId) {
      throw new Error(`User not found: ${order.userEmail}`);
    }

    const addressesForUser = userAddresses.get(order.userEmail);

    if (!addressesForUser?.length) {
      throw new Error(`No address found for user: ${order.userEmail}`);
    }

    const addressId =
      addressesForUser[order.addressIndex] ?? addressesForUser[0];

    // ----------------------------------------------------------
    // Resolve variants and calculate totals
    // ----------------------------------------------------------

    let subtotal = 0;

    const orderItemsData = [];

    for (const item of order.items) {
      const variantId = variantMap.get(item.sku);

      if (!variantId) {
        throw new Error(`Variant not found: ${item.sku}`);
      }

      const variant = await prisma.productVariant.findUnique({
        where: {
          id: variantId,
        },
        include: {
          product: true,
        },
      });

      if (!variant) {
        throw new Error(`Variant not found: ${item.sku}`);
      }

      const unitPrice = Number(variant.price);

      subtotal += unitPrice * item.quantity;

      orderItemsData.push({
        productId: variant.productId,
        variantId: variant.id,

        productName: variant.product.name,

        variantInfo: [variant.color, variant.storage, variant.ram]
          .filter(Boolean)
          .join(", "),

        unitPrice: variant.price,

        quantity: item.quantity,
      });
    }

    const shippingFee = order.shippingFee;

    const total = subtotal + shippingFee;

    // ----------------------------------------------------------
    // Create order
    // ----------------------------------------------------------

    await prisma.order.create({
      data: {
        userId,
        addressId,

        status: order.status as OrderStatus,
        paymentMethod: order.paymentMethod as PaymentMethod,
        paymentStatus: order.paymentStatus as PaymentStatus,

        subtotal,
        shippingFee,
        total,

        items: {
          create: orderItemsData,
        },
      },
    });
  }

  console.log(`Created ${orders.length} orders.`);

  // ============================================================
  // DONE
  // ============================================================

  console.log("Database seed completed successfully.");
};

// ============================================================
// RUN SEED
// ============================================================

seed()
  .catch((error) => {
    console.error("Seed failed:");
    console.error(error);

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
