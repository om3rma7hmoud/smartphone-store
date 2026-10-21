import type { FilterProduct, SortKey } from "../types";

export const PRICE_FLOOR = 0;
export const PRICE_CEILING = 150000;

export const emptyFilters: FilterProduct = {
  brands: [],
  rams: [],
  storages: [],
  os: [],
  min: PRICE_FLOOR,
  max: PRICE_CEILING,
  category: "all",
  dealsOnly: false,
};

export function filtersToParams(
  filters: FilterProduct,
  query: string,
  sort: SortKey,
) {
  const params = new URLSearchParams();

  if (query.trim()) {
    params.set("q", query.trim());
  }

  if (filters.category !== "all") {
    params.set("category", filters.category);
  }

  if (filters.brands.length) {
    params.set("brand", filters.brands.join(","));
  }

  if (filters.rams.length) {
    params.set("ram", filters.rams.join(","));
  }

  if (filters.storages.length) {
    params.set("storage", filters.storages.join(","));
  }

  if (filters.os.length) {
    params.set("os", filters.os.join(","));
  }

  if (filters.min > PRICE_FLOOR) {
    params.set("min", String(filters.min));
  }

  if (filters.max < PRICE_CEILING) {
    params.set("max", String(filters.max));
  }

  if (filters.dealsOnly) {
    params.set("deals", "1");
  }

  if (sort !== "newest") {
    params.set("sort", sort);
  }

  return params;
}

export function fromParams(params: URLSearchParams): FilterProduct {
  const category = params.get("category");

  return {
    ...emptyFilters,

    brands: params.get("brand") ? params.get("brand")!.split(",") : [],

    rams: params.get("ram") ? params.get("ram")!.split(",") : [],

    storages: params.get("storage") ? params.get("storage")!.split(",") : [],

    os: params.get("os") ? params.get("os")!.split(",") : [],

    category:
      category === "smartphones" || category === "accessories"
        ? category
        : "all",

    min: params.get("min") ? Number(params.get("min")) : PRICE_FLOOR,

    max: params.get("max") ? Number(params.get("max")) : PRICE_CEILING,

    dealsOnly: params.get("deals") === "1",
  };
}
