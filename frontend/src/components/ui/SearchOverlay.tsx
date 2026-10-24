import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { SearchIcon, XIcon } from "lucide-react";
import { useProducts } from "../../hooks/useProducts";
import type { Product } from "../../types";
import { cheapestVariant, formatEGP } from "../../utils/format";

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

const suggestions = ["iphone", "samsung", "pixel", "airpods"];

export function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const { products } = useProducts();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      setQuery("");
      window.setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    return products
      .filter(
        (p: Product) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q),
      )
      .slice(0, 6);
  }, [query, products]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    onClose();
    navigate(`/shop?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
        >
          <div
            className="bg-ink/30 absolute inset-0 backdrop-blur-[2px]"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            initial={{ y: -16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
            className="border-line shadow-overlay relative mx-auto mt-0 w-full max-w-2xl border-b bg-white sm:mt-24 sm:border"
            role="dialog"
            aria-modal="true"
            aria-label="Search products"
          >
            <form
              onSubmit={submit}
              className="border-line flex items-center gap-3 border-b px-4"
            >
              <SearchIcon size={17} className="text-ink-400 shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search iPhone, Samsung, Pixel…"
                className="text-ink placeholder:text-ink-300 h-14 w-full bg-transparent text-[15px] outline-none"
                aria-label="Search products"
              />
              <button
                type="button"
                onClick={onClose}
                className="text-ink-300 ease-premium hover:text-ink -mr-1 p-1 transition-colors duration-150"
                aria-label="Close search"
              >
                <XIcon size={17} />
              </button>
            </form>

            <div className="max-h-[60vh] overflow-y-auto">
              {!query.trim() && (
                <div className="p-4">
                  <p className="text-ink-400 text-[11px] font-semibold tracking-widest uppercase">
                    Popular searches
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setQuery(s)}
                        className="border-line text-ink-600 ease-premium hover:border-ink hover:text-ink border px-3 py-1.5 text-[13px] transition-colors duration-150"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {query.trim() && results.length === 0 && (
                <div className="px-4 py-10 text-center">
                  <p className="text-ink text-[15px] font-medium">
                    No products match “{query}”
                  </p>
                  <p className="text-ink-400 mt-1 text-[13px]">
                    Try a brand name such as Apple, Samsung or Google.
                  </p>
                </div>
              )}

              {results.map((p) => {
                const v = cheapestVariant(p);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      onClose();
                      navigate(`/product/${p.slug}`);
                    }}
                    className="border-line ease-premium hover:bg-surface-muted flex w-full items-center gap-3 border-b px-4 py-3 text-left transition-colors duration-150 last:border-b-0"
                  >
                    <img
                      src={p.images[0]?.url ?? "/placeholder.svg"}
                      alt=""
                      className="bg-surface-muted h-11 w-11 object-cover"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="text-ink-400 block text-[11px] font-semibold tracking-widest uppercase">
                        {p.brand.name}
                      </span>
                      <span className="text-ink block truncate text-[14px] font-medium">
                        {p.name}
                      </span>
                    </span>
                    <span className="text-ink shrink-0 text-[14px] font-semibold">
                      {formatEGP(v.price)}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
