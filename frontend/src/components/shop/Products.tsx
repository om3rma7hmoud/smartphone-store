import { SearchIcon } from "lucide-react";
import ProductCard from "../ui/ProductCard";
import EmptyState from "../ui/EmptyState";
import type { Product } from "../../types";

interface ProductsProps {
  isLoading: boolean;
  PER_PAGE: number;
  query: string;
  results: Product[];
  visible: Product[];
}

function Products({
  isLoading,
  PER_PAGE,
  results,
  visible,
  query,
}: ProductsProps) {
  return (
    <div className="mt-6">
      {isLoading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({
            length: Math.min(PER_PAGE, Math.max(results.length, 3)),
          }).map((_, i) => (
            <div key={i} className="border-line border bg-white">
              <div className="bg-surface-muted aspect-square animate-pulse" />
              <div className="space-y-2.5 p-4">
                <div className="bg-surface-sunken h-2.5 w-16 animate-pulse" />
                <div className="bg-surface-sunken h-3.5 w-2/3 animate-pulse" />
                <div className="bg-surface-sunken h-3 w-24 animate-pulse" />
                <div className="bg-surface-muted h-9 w-full animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : visible.length === 0 ? (
        <EmptyState
          icon={<SearchIcon size={20} />}
          title="No products match your filters"
          description={
            query
              ? `We couldn't find anything for “${query}”. Try a different term or reset your filters.`
              : "Try widening your price range or removing a filter to see more products."
          }
          primaryAction={{ label: "Reset filters", to: "/shop" }}
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Products;
