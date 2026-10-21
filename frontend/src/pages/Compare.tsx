import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { GitCompareIcon, XIcon } from "lucide-react";

import EmptyState from "../components/ui/EmptyState";
import { useCompareStore } from "../store/compareStore";
import { cheapestVariant, formatEGP } from "../utils/format";
import { StarRating } from "../components/ui/StartRating";
import type { Product } from "../types";
import { getProductById } from "../api/products.api";

function Compare() {
  const { productIds, toggle, clear } = useCompareStore();
  const [items, setItems] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      setItems([]);

      if (productIds.length === 0) {
        return;
      }

      setIsLoading(true);

      try {
        for (const id of productIds) {
          try {
            const product = await getProductById(id);

            if (!cancelled) {
              setItems((currentItems) => [...currentItems, product]);
            }
          } catch {
            continue;
          }
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, [productIds]);

  if (productIds.length === 0) {
    return (
      <div className="max-w-shell mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <EmptyState
          icon={<GitCompareIcon size={20} />}
          title="Nothing to compare yet"
          description="Add up to three smartphones from the catalogue and see their specs side by side."
          primaryAction={{
            label: "Browse smartphones",
            to: "/shop?category=smartphones",
          }}
        />
      </div>
    );
  }

  if (isLoading && items.length === 0) {
    return (
      <div className="max-w-shell mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-ink-400 text-sm">Loading comparison...</p>
      </div>
    );
  }

  const rows: Array<{
    label: string;
    render: (product: Product) => ReactNode;
  }> = [
    {
      label: "Price",
      render: (p) => (
        <span className="text-ink text-[15px] font-semibold">
          From {formatEGP(cheapestVariant(p).price)}
        </span>
      ),
    },
    { label: "Screen size", render: (p) => p.screenSize ?? "—" },
    { label: "Screen type", render: (p) => p.screenType ?? "—" },
    { label: "Processor", render: (p) => p.processor ?? "—" },
    { label: "Battery", render: (p) => p.battery ?? "—" },
    { label: "Camera", render: (p) => p.camera ?? "—" },
    { label: "Operating system", render: (p) => p.os ?? "—" },
    {
      label: "RAM",
      render: (p) =>
        [...new Set(p.variants.map((v) => v.ram).filter(Boolean))].join(
          " · ",
        ) || "—",
    },
    {
      label: "Storage",
      render: (p) =>
        [...new Set(p.variants.map((v) => v.storage).filter(Boolean))].join(
          " · ",
        ) || "—",
    },
    {
      label: "Rating",
      render: (p) => (
        <span className="inline-flex items-center gap-2">
          <StarRating rating={p.rating} />
          <span className="text-ink-600 text-[13.5px]">
            {p.rating} ({p.reviewCount})
          </span>
        </span>
      ),
    },
  ];

  return (
    <div className="max-w-shell mx-auto px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="border-line flex flex-wrap items-end justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-ink text-[30px] font-semibold tracking-tight sm:text-[36px]">
            Compare
          </h1>
          <p className="text-ink-400 mt-2 text-[15px]">
            {items.length} of 3 products selected. Specifications shown for the
            base configuration.
          </p>
        </div>

        <button
          type="button"
          onClick={clear}
          className="text-ink-400 ease-premium hover:text-ink text-[13.5px] font-medium transition-colors duration-150"
        >
          Clear comparison
        </button>
      </div>

      {items.length > 0 && (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-180 border-collapse text-left">
            <thead>
              <tr>
                <th scope="col" className="w-45 p-0 align-bottom" />

                {items.map((p) => (
                  <th key={p.id} scope="col" className="p-0 align-bottom">
                    <div className="border-line relative border bg-white p-4">
                      <button
                        type="button"
                        onClick={() => toggle(p.id)}
                        aria-label={`Remove ${p.name}`}
                        className="text-ink-300 ease-premium hover:text-ink absolute top-2 right-2 p-1 transition-colors duration-150"
                      >
                        <XIcon size={15} />
                      </button>

                      <Link to={`/product/${p.slug}`} className="block">
                        <img
                          src={p.images?.[0]?.url}
                          alt={p.images?.[0]?.altText ?? p.name}
                          className="bg-surface-muted mx-auto h-32 w-32 object-cover"
                        />

                        <p className="text-ink-400 mt-3 text-[11px] font-semibold tracking-widest uppercase">
                          {p.brand?.name ?? "Unknown brand"}
                        </p>

                        <p className="text-ink mt-1 text-[15px] font-semibold">
                          {p.name}
                        </p>
                      </Link>

                      <button
                        type="button"
                        onClick={() => console.log("Add to cart:", p.id)}
                        className="bg-ink ease-premium hover:bg-ink-800 mt-3 h-10 w-full text-[13px] font-medium text-white transition-colors duration-150"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {rows.map((row) => (
                <tr key={row.label} className="align-top">
                  <th
                    scope="row"
                    className="border-line text-ink-400 border-b py-4 pr-6 text-[13px] font-medium"
                  >
                    {row.label}
                  </th>

                  {items.map((p) => (
                    <td
                      key={p.id}
                      className="border-line text-ink border-b px-4 py-4 text-[14px] leading-relaxed"
                    >
                      {row.render(p)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {items.length < 3 && (
        <p className="text-ink-400 mt-6 text-[13.5px]">
          You can add {3 - items.length} more{" "}
          {3 - items.length === 1 ? "product" : "products"} —{" "}
          <Link
            to="/shop"
            className="text-ink font-medium underline-offset-4 hover:underline"
          >
            continue browsing
          </Link>
          .
        </p>
      )}
    </div>
  );
}

export default Compare;
