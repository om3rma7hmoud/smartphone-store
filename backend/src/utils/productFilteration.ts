// brand=apple&category=phones&minPrice=5000&maxPrice=20000&ram=8GB&storage=128GB&os=android&sort=price_asc&page=1&limit=20&search=iphone`

export function buildProductWhere(query: Record<string, any>) {
  const { brand, category, minPrice, maxPrice, ram, storage, os, search } =
    query;

  const where: Record<string, any> = {
    isPublished: true,
  };

  if (brand) {
    where.brand = {
      slug: brand,
    };
  }

  if (category) {
    where.category = {
      slug: category,
    };
  }

  if (os) {
    where.os = {
      equals: os,
      mode: "insensitive",
    };
  }

  if (search) {
    where.name = {
      contains: search,
      mode: "insensitive",
    };
  }

  if (minPrice || maxPrice || ram || storage) {
    const variantWhere: Record<string, any> = {};

    if (minPrice || maxPrice) {
      variantWhere.price = {};

      if (minPrice) {
        variantWhere.price.gte = Number(minPrice);
      }

      if (maxPrice) {
        variantWhere.price.lte = Number(maxPrice);
      }
    }

    if (ram) {
      variantWhere.ram = ram;
    }

    if (storage) {
      variantWhere.storage = storage;
    }

    where.variants = {
      some: variantWhere,
    };
  }

  return where;
}

export function buildProductOrderBy(sort?: string) {
  switch (sort) {
    case "price_asc":
      return { minPrice: "asc" as const };
    case "price_desc":
      return { minPrice: "desc" as const };
    case "rating":
      return { rating: "desc" as const };
    default:
      return { createdAt: "desc" as const };
  }
}

export function buildPaginationOptions(query: Record<string, any>) {
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  return { skip, take: limit, page, limit };
}
