import {
  BRANDS,
  OS_OPTIONS,
  RAM_OPTIONS,
  STORAGE_OPTIONS,
} from "../../data/products";
import type { FilterProduct } from "../../types";
import { PRICE_CEILING, PRICE_FLOOR } from "../../utils/filterShop";
import { formatEGP } from "../../utils/format";

interface FilterPanelProps {
  filters: FilterProduct;
  onChange: (next: FilterProduct) => void;
  onClear: () => void;
}

function toggle(list: string[], value: string): string[] {
  return list.includes(value)
    ? list.filter((v) => v !== value)
    : [...list, value];
}

function Group({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-line border-b py-5 first:pt-0 last:border-b-0">
      <h3 className="text-ink text-[11px] font-semibold tracking-widest uppercase">
        {title}
      </h3>
      <div className="mt-3.5">{children}</div>
    </div>
  );
}

function Check({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="text-ink-600 ease-premium hover:text-ink flex cursor-pointer items-center gap-2.5 py-1.5 text-[14px] transition-colors duration-150">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="border-line-strong checked:border-ink checked:bg-ink h-4 w-4 shrink-0 cursor-pointer appearance-none border bg-white bg-center bg-no-repeat"
        style={
          checked
            ? {
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none' stroke='white' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M3.5 8.5l3 3 6-6'/%3E%3C/svg%3E\")",
                backgroundSize: "13px 13px",
              }
            : undefined
        }
      />
      <span>{label}</span>
    </label>
  );
}

function FilterPanel({ filters, onChange, onClear }: FilterPanelProps) {
  return (
    <div>
      <div className="flex items-center justify-between pb-4">
        <h2 className="text-ink text-[15px] font-semibold tracking-[-0.01em]">
          Filters
        </h2>
        <button
          type="button"
          onClick={onClear}
          className="text-ink-400 ease-premium hover:text-ink text-[13px] font-medium transition-colors duration-150"
        >
          Clear all
        </button>
      </div>

      <Group title="Category">
        <div className="flex flex-wrap gap-2">
          {(["all", "smartphones", "accessories"] as const).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => onChange({ ...filters, category: c })}
              className={`ease-premium border px-3 py-1.5 text-[13px] capitalize transition-colors duration-150 ${
                filters.category === c
                  ? "border-ink bg-ink text-white"
                  : "border-line text-ink-600 hover:border-ink hover:text-ink"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </Group>

      <Group title="Brand">
        {BRANDS.map((b) => (
          <Check
            key={b}
            label={b}
            checked={filters.brands.includes(b)}
            onChange={() =>
              onChange({ ...filters, brands: toggle(filters.brands, b) })
            }
          />
        ))}
      </Group>

      <Group title="Price">
        <div className="flex items-center gap-2">
          <label className="flex-1">
            <span className="sr-only">Minimum price</span>
            <input
              type="number"
              value={filters.min}
              min={PRICE_FLOOR}
              max={filters.max}
              step={5000}
              onChange={(e) =>
                onChange({
                  ...filters,
                  min: Math.max(PRICE_FLOOR, Number(e.target.value) || 0),
                })
              }
              className="border-line text-ink ease-premium focus:border-ink h-9 w-full border px-2.5 text-[13px] transition-colors duration-150 outline-none"
              aria-label="Minimum price"
            />
          </label>
          <span className="text-ink-300">—</span>
          <label className="flex-1">
            <span className="sr-only">Maximum price</span>
            <input
              type="number"
              value={filters.max}
              min={filters.min}
              max={PRICE_CEILING}
              step={1000}
              onChange={(e) =>
                onChange({
                  ...filters,
                  max: Math.min(
                    PRICE_CEILING,
                    Number(e.target.value) || PRICE_CEILING,
                  ),
                })
              }
              className="border-line text-ink ease-premium focus:border-ink h-9 w-full border px-2.5 text-[13px] transition-colors duration-150 outline-none"
              aria-label="Maximum price"
            />
          </label>
        </div>
        <input
          type="range"
          className="nova-range mt-4 w-full"
          min={PRICE_FLOOR}
          max={PRICE_CEILING}
          step={1000}
          value={filters.max}
          onChange={(e) =>
            onChange({ ...filters, max: Number(e.target.value) })
          }
          aria-label="Maximum price slider"
        />
        <p className="text-ink-400 mt-2 text-[12.5px]">
          {formatEGP(filters.min)} – {formatEGP(filters.max)}
        </p>
      </Group>

      <Group title="RAM">
        <div className="flex flex-wrap gap-2">
          {RAM_OPTIONS.map((r) => (
            <button
              key={r}
              type="button"
              aria-pressed={filters.rams.includes(r)}
              onClick={() =>
                onChange({ ...filters, rams: toggle(filters.rams, r) })
              }
              className={`ease-premium border px-3 py-1.5 text-[13px] transition-colors duration-150 ${
                filters.rams.includes(r)
                  ? "border-ink bg-ink text-white"
                  : "border-line text-ink-600 hover:border-ink hover:text-ink"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </Group>

      <Group title="Storage">
        <div className="flex flex-wrap gap-2">
          {STORAGE_OPTIONS.map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={filters.storages.includes(s)}
              onClick={() =>
                onChange({ ...filters, storages: toggle(filters.storages, s) })
              }
              className={`ease-premium border px-3 py-1.5 text-[13px] transition-colors duration-150 ${
                filters.storages.includes(s)
                  ? "border-ink bg-ink text-white"
                  : "border-line text-ink-600 hover:border-ink hover:text-ink"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </Group>

      <Group title="Operating system">
        {OS_OPTIONS.map((o) => (
          <Check
            key={o}
            label={o}
            checked={filters.os.includes(o)}
            onChange={() => onChange({ ...filters, os: toggle(filters.os, o) })}
          />
        ))}
      </Group>

      <Group title="Offers">
        <Check
          label="Discounted only"
          checked={filters.dealsOnly}
          onChange={() =>
            onChange({ ...filters, dealsOnly: !filters.dealsOnly })
          }
        />
      </Group>
    </div>
  );
}

export default FilterPanel;
