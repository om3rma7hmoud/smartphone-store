import { AnimatePresence, motion } from "framer-motion";
import { XIcon } from "lucide-react";
import FilterPanel from "./FilterPanel";
import type { FilterProduct, Product } from "../../types";

interface FilterDrawerProps {
  drawerOpen: boolean;
  setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  filters: FilterProduct;
  updateFilters: (next: FilterProduct) => void;
  emptyFilters: FilterProduct;
  results: Product[];
  options: {
    brands: string[];
    os: string[];
    rams: string[];
    storages: string[];
  };
}

function FilterDrawer({
  drawerOpen,
  setDrawerOpen,
  filters,
  updateFilters,
  emptyFilters,
  results,
  options,
}: FilterDrawerProps) {
  return (
    <AnimatePresence>
      {drawerOpen && (
        <motion.div
          className="fixed inset-0 z-60 lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
        >
          <div
            className="bg-ink/40 absolute inset-0"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
            className="absolute inset-x-0 bottom-0 flex max-h-[86vh] flex-col bg-white"
            role="dialog"
            aria-modal="true"
            aria-label="Filters"
          >
            <div className="border-line flex items-center justify-between border-b px-4 py-3">
              <span className="text-ink text-[15px] font-semibold">
                Filters
              </span>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="text-ink-400 p-1"
                aria-label="Close filters"
              >
                <XIcon size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <FilterPanel
                filters={filters}
                options={options}
                onChange={updateFilters}
                onClear={() => updateFilters(emptyFilters)}
              />
            </div>
            <div className="border-line border-t p-4">
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="bg-ink h-12 w-full text-[14px] font-medium text-white"
              >
                Show {results.length}{" "}
                {results.length === 1 ? "product" : "products"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default FilterDrawer;
