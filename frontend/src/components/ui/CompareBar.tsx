import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useCompareStore } from "../../store/compareStore";
import { getProductById } from "../../api/products.api";
import type { Product } from "../../types";

export function CompareBar() {
  const { productIds, toggle, clear } = useCompareStore();
  const location = useLocation();
  const hidden = location.pathname === "/compare";
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function loadComparedProducts() {
      const results = await Promise.all(
        productIds.map(async (id) => {
          try {
            return (await getProductById(id)) as Product;
          } catch {
            return null;
          }
        }),
      );

      if (!cancelled) {
        setProducts(results.filter((product): product is Product => product !== null));
      }
    }

    void loadComparedProducts();
    return () => {
      cancelled = true;
    };
  }, [productIds]);

  return (
    <AnimatePresence>
      {productIds.length > 0 && !hidden && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.26, ease: [0.23, 1, 0.32, 1] }}
          className="border-line fixed inset-x-0 bottom-0 z-50 border-t bg-white/95 backdrop-blur"
        >
          <div className="max-w-shell mx-auto flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
            <div className="nova-scroll-x flex items-center gap-3 overflow-x-auto">
              <span className="text-ink-400 shrink-0 text-[11px] font-semibold tracking-widest uppercase">
                Compare {productIds.length}/3
              </span>
              <div className="flex items-center gap-2">
                {products.map((product) => (
                    <div
                      key={product.id}
                      className="border-line flex shrink-0 items-center gap-2 border bg-white py-1 pr-2 pl-1"
                    >
                      <img
                        src={product.images[0]?.url ?? ""}
                        alt={product.images[0]?.altText ?? ""}
                        className="h-8 w-8 object-cover"
                      />
                      <span className="text-ink text-[13px] font-medium whitespace-nowrap">
                        {product.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggle(product.id)}
                        aria-label={`Remove ${product.name} from compare`}
                        className="text-ink-300 ease-premium hover:text-ink transition-colors duration-150"
                      >
                        <XIcon size={13} />
                      </button>
                    </div>
                ))}
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <button
                type="button"
                onClick={clear}
                className="text-ink-400 ease-premium hover:text-ink text-[13px] font-medium transition-colors duration-150"
              >
                Clear
              </button>
              <Link
                to="/compare"
                className="bg-ink ease-premium hover:bg-ink-800 inline-flex h-10 items-center px-5 text-[13px] font-medium text-white transition-colors duration-150"
              >
                Compare Now
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
