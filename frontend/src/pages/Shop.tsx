import ShopHeader from "../components/shop/ShopHeader";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import FilterDrawer from "../components/shop/FilterDrawer";
import FilterInput from "../components/shop/FilterInput";
import FilterPanel from "../components/shop/FilterPanel";
import PagesSlider from "../components/shop/PagesSlider";
import Products from "../components/shop/Products";
import ProductsLength from "../components/shop/ProductsLength";
import type { FilterProduct, Product, SortKey } from "../types";
import { cheapestVariant } from "../utils/format";
import { useProducts } from "../hooks/useProducts";
import { useDebounce } from "../hooks/useDebounce";
import {
  emptyFilters,
  filtersToParams,
  PRICE_CEILING,
  PRICE_FLOOR,
} from "../utils/filterShop";
import { fromParams } from "../utils/filterShop";

const PER_PAGE = 6;

function matches(
  product: Product,
  filters: FilterProduct,
  query: string,
): boolean {
  const q = query.trim().toLowerCase();
  if (
    q &&
    !`${product.brand.slug} ${product.name} ${product.description}`
      .toLowerCase()
      .includes(q)
  ) {
    return false;
  }
  if (filters.category !== "all" && product.category.slug !== filters.category)
    return false;
  if (filters.brands.length && !filters.brands.includes(product.brand.name))
    return false;
  if (filters.os.length && !filters.os.includes(product.os)) return false;
  if (filters.dealsOnly && !product.variants.some((v) => v.compareAtPrice))
    return false;
  if (
    filters.rams.length &&
    !product.variants.some((v) => v.ram && filters.rams.includes(v.ram))
  )
    return false;
  if (
    filters.storages.length &&
    !product.variants.some(
      (v) => v.storage && filters.storages.includes(v.storage),
    )
  )
    return false;
  if (
    !product.variants.some(
      (v) => v.price >= filters.min && v.price <= filters.max,
    )
  )
    return false;
  return true;
}

function ShopContent() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<FilterProduct>(() =>
    fromParams(searchParams),
  );
  const { products, isLoading } = useProducts();

  const filterOptions = useMemo(
    () => ({
      brands: [...new Set(products.map((p) => p.brand.name))].sort(),
      os: [...new Set(products.map((p) => p.os).filter(Boolean))].sort(),
      rams: [
        ...new Set(
          products.flatMap((p) =>
            p.variants.map((v) => v.ram).filter((v): v is string => Boolean(v)),
          ),
        ),
      ].sort(),
      storages: [
        ...new Set(
          products.flatMap((p) =>
            p.variants
              .map((v) => v.storage)
              .filter((v): v is string => Boolean(v)),
          ),
        ),
      ].sort(),
    }),
    [products],
  );

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<SortKey>(
    (searchParams.get("sort") as SortKey) ?? "newest",
  );
  const [drawerOpen, setDrawerOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 400);

  const results = useMemo(() => {
    const list = products.filter((p) => matches(p, filters, debouncedQuery));
    const sorted = [...list];
    sorted.sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return cheapestVariant(a).price - cheapestVariant(b).price;
        case "price-desc":
          return cheapestVariant(b).price - cheapestVariant(a).price;
        case "rating":
          return b.rating - a.rating;
        default:
          return b.releaseYear - a.releaseYear || b.rating - a.rating;
      }
    });
    return sorted;
  }, [filters, sort, products, debouncedQuery]);

  const pageCount = Math.max(1, Math.ceil(results.length / PER_PAGE));
  const current = Math.min(page, pageCount);
  const visible = results.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  const chips: Array<{ label: string; clear: () => void }> = [
    ...filters.brands.map((b) => ({
      label: b,
      clear: () =>
        updateFilters({
          ...filters,
          brands: filters.brands.filter((x) => x !== b),
        }),
    })),
    ...filters.rams.map((r) => ({
      label: `${r} RAM`,
      clear: () =>
        updateFilters({
          ...filters,
          brands: filters.brands.filter((x) => x !== r),
        }),
    })),
    ...filters.storages.map((s) => ({
      label: s,
      clear: () =>
        updateFilters({
          ...filters,
          brands: filters.brands.filter((x) => x !== s),
        }),
    })),
    ...filters.os.map((o) => ({
      label: o,
      clear: () =>
        updateFilters({
          ...filters,
          brands: filters.brands.filter((x) => x !== o),
        }),
    })),
  ];
  if (filters.category !== "all") {
    chips.unshift({
      label: filters.category === "smartphones" ? "Smartphones" : "Accessories",
      clear: () => setFilters((f) => ({ ...f, category: "all" })),
    });
  }
  if (filters.max < PRICE_CEILING || filters.min > PRICE_FLOOR) {
    chips.push({
      label: `Under EGP ${filters.max.toLocaleString("en-US")}`,
      clear: () =>
        setFilters((f) => ({ ...f, min: PRICE_FLOOR, max: PRICE_CEILING })),
    });
  }
  if (filters.dealsOnly) {
    chips.push({
      label: "Discounted only",
      clear: () => setFilters((f) => ({ ...f, dealsOnly: false })),
    });
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFilters(fromParams(searchParams));
    setQuery(searchParams.get("q") ?? "");
    setSort((searchParams.get("sort") as SortKey) ?? "newest");
    setPage(1);
  }, [searchParams]);

  useEffect(() => {
    const params = filtersToParams(filters, debouncedQuery, sort);

    setSearchParams(params, { replace: true });
  }, [filters, debouncedQuery, sort, setSearchParams]);

  function updateFilters(next: FilterProduct) {
    setFilters(next);
    setPage(1);

    const params = filtersToParams(next, query, sort);
    setSearchParams(params);
  }

  function updateQuery(value: string) {
    setQuery(value);
    setPage(1);
  }

  function updateSort(value: SortKey) {
    setSort(value);
    setPage(1);

    const params = filtersToParams(filters, query, value);

    setSearchParams(params);
  }

  return (
    <div className="max-w-shell mx-auto px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <ShopHeader category={filters.category} />
      <div className="mt-8 grid lg:grid-cols-[248px_1fr] lg:gap-10">
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <FilterPanel
              filters={filters}
              options={filterOptions}
              onChange={updateFilters}
              onClear={() => updateFilters(emptyFilters)}
            />
          </div>
        </aside>
        <div>
          <FilterInput
            query={query}
            setQuery={updateQuery}
            setDrawerOpen={setDrawerOpen}
            chips={chips}
            sort={sort}
            setSort={updateSort}
          />

          <ProductsLength results={results} chips={chips} />

          <Products
            isLoading={isLoading}
            PER_PAGE={PER_PAGE}
            query={query}
            results={results}
            visible={visible}
          />

          <PagesSlider
            pageCount={pageCount}
            current={current}
            setPage={setPage}
          />
        </div>
      </div>
      <FilterDrawer
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        filters={filters}
        updateFilters={updateFilters}
        emptyFilters={emptyFilters}
        results={results}
        options={filterOptions}
      />
    </div>
  );
}

function Shop() {
  return <ShopContent />;
}

export default Shop;
