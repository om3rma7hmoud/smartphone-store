import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { SearchIcon, XIcon } from "lucide-react";

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

const suggestions = ["iphone", "samsung", "pixel", "airpods"];

export function SearchOverlay({ open, onClose }: SearchOverlayProps) {
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
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q),
      )
      .slice(0, 6);
  }, [query]);

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
            className="absolute inset-0 bg-ink/30 backdrop-blur-[2px]"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            initial={{ y: -16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
            className="relative mx-auto mt-0 w-full max-w-2xl border-b border-line bg-white shadow-overlay sm:mt-24 sm:border"
            role="dialog"
            aria-modal="true"
            aria-label="Search products"
          >
            <form
              onSubmit={submit}
              className="flex items-center gap-3 border-b border-line px-4"
            >
              <SearchIcon size={17} className="shrink-0 text-ink-400" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search iPhone, Samsung, Pixel…"
                className="h-14 w-full bg-transparent text-[15px] text-ink outline-none placeholder:text-ink-300"
                aria-label="Search products"
              />
              <button
                type="button"
                onClick={onClose}
                className="-mr-1 p-1 text-ink-300 transition-colors duration-150 ease-premium hover:text-ink"
                aria-label="Close search"
              >
                <XIcon size={17} />
              </button>
            </form>

            <div className="max-h-[60vh] overflow-y-auto">
              {!query.trim() && (
                <div className="p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-ink-400">
                    Popular searches
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setQuery(s)}
                        className="border border-line px-3 py-1.5 text-[13px] text-ink-600 transition-colors duration-150 ease-premium hover:border-ink hover:text-ink"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {query.trim() && results.length === 0 && (
                <div className="px-4 py-10 text-center">
                  <p className="text-[15px] font-medium text-ink">
                    No products match “{query}”
                  </p>
                  <p className="mt-1 text-[13px] text-ink-400">
                    Try a brand name such as Apple, Samsung or Google.
                  </p>
                </div>
              )}

              {/* {results.map((p) => {
                const v = cheapestVariant(p);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      onClose();
                      navigate(`/product/${p.slug}`);
                    }}
                    className="flex w-full items-center gap-3 border-b border-line px-4 py-3 text-left transition-colors duration-150 ease-premium last:border-b-0 hover:bg-surface-muted"
                  >
                    <img
                      src={p.images[0]}
                      alt=""
                      className="h-11 w-11 bg-surface-muted object-cover"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block text-[11px] font-semibold uppercase tracking-widest text-ink-400">
                        {p.brand}
                      </span>
                      <span className="block truncate text-[14px] font-medium text-ink">
                        {p.name}
                      </span>
                    </span>
                    <span className="shrink-0 text-[14px] font-semibold text-ink">
                      {formatEGP(v.price)}
                    </span>
                  </button>
                );
              })} */}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
