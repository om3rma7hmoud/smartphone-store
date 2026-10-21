import { SearchIcon, SlidersHorizontalIcon } from "lucide-react";
import type { SortKey } from "../../types";

const sortOptions: Array<{ value: SortKey; label: string }> = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
  { value: "rating", label: "Highest Rated" },
];

interface FilterInputProps {
  query: string;
  setQuery: (value: string) => void;
  setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  chips: {
    label: string;
    clear: () => void;
  }[];
  sort: SortKey;
  setSort: (value: SortKey) => void;
}

function FilterInput({
  query,
  setQuery,
  setDrawerOpen,
  chips,
  sort,
  setSort,
}: FilterInputProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <SearchIcon
          size={16}
          className="text-ink-400 pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search the catalogue"
          aria-label="Search the catalogue"
          className="border-line text-ink ease-premium placeholder:text-ink-300 focus:border-ink h-11 w-full border pr-3 pl-9 text-[14px] transition-colors duration-150 outline-none"
        />
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="border-line text-ink inline-flex h-11 items-center gap-2 border px-4 text-[14px] font-medium lg:hidden"
        >
          <SlidersHorizontalIcon size={15} />
          Filters
          {chips.length > 0 && (
            <span className="bg-ink flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-semibold text-white">
              {chips.length}
            </span>
          )}
        </button>
        <label className="border-line flex h-11 items-center gap-2 border px-3">
          <span className="text-ink-400 text-[13px]">Sort</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="text-ink bg-transparent text-[14px] font-medium outline-none"
            aria-label="Sort products"
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}

export default FilterInput;
