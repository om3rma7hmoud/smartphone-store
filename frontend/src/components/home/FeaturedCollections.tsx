import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import ProductCard from "../ui/ProductCard";
import type { Product } from "../../types";

const collections = [
  {
    key: "new",
    label: "New Arrivals",
    blurb: "Just landed in the NOVA catalogue.",
  },
  {
    key: "bestseller",
    label: "Best Sellers",
    blurb: "What Egypt is buying this month.",
  },
  {
    key: "deal",
    label: "Limited Deals",
    blurb: "Price drops running while stock lasts.",
  },
] as const;

type CollectionKey = (typeof collections)[number]["key"];

function FeaturedCollections({ products }: { products: Product[] }) {
  const [active, setActive] = useState<CollectionKey>("new");
  const activeMeta = collections.find((c) => c.key === active)!;

  const items = products.filter((p) => p.tags.includes(active)).slice(0, 4);

  return (
    <section className="border-line bg-surface-muted border-y">
      <div className="max-w-shell mx-auto px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-ink text-[26px] font-semibold tracking-[-0.02em] sm:text-[30px]">
              Featured collections
            </h2>
            <p className="text-ink-400 mt-2 text-[15px]">{activeMeta.blurb}</p>
          </div>
          <div
            className="nova-scroll-x border-line flex gap-1 overflow-x-auto border bg-white p-1"
            role="tablist"
            aria-label="Featured collections"
          >
            {collections.map((c) => (
              <button
                key={c.key}
                type="button"
                role="tab"
                aria-selected={active === c.key}
                onClick={() => setActive(c.key)}
                className={`ease-premium relative px-4 py-2 text-[13.5px] font-medium whitespace-nowrap transition-colors duration-150 ${
                  active === c.key
                    ? "text-white"
                    : "text-ink-600 hover:text-ink"
                }`}
              >
                {active === c.key && (
                  <motion.span
                    layoutId="collection-pill"
                    className="bg-ink absolute inset-0"
                    transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                  />
                )}
                <span className="relative">{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
            className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </motion.div>
        </AnimatePresence>

        <div className="mt-8">
          <Link
            to="/shop"
            className="border-line-strong text-ink ease-premium hover:border-ink inline-flex h-11 items-center border bg-white px-6 text-[14px] font-medium transition-colors duration-150"
          >
            Browse the full catalogue
          </Link>
        </div>
      </div>
    </section>
  );
}

export default FeaturedCollections;
