import type { Product, ProductVariant } from "../../types";

interface VariantSelectorProps {
  product: Product;
  variant: ProductVariant;
  onSelect: (
    next: Partial<Pick<ProductVariant, "color" | "storage" | "ram">>,
  ) => void;
}

function VariantSelector({ product, variant, onSelect }: VariantSelectorProps) {
  const colors = [...new Set(product.variants.map((item) => item.color))];

  const colorHex = new Map(
    product.variants.map((item) => [item.color, item.colorHex]),
  );

  const storages = [
    ...new Set(
      product.variants
        .filter((item) => item.color === variant.color)
        .map((item) => item.storage)
        .filter(Boolean),
    ),
  ];

  const rams = [
    ...new Set(
      product.variants
        .filter(
          (item) =>
            item.color === variant.color && item.storage === variant.storage,
        )
        .map((item) => item.ram)
        .filter(Boolean),
    ),
  ];

  return (
    <div className="border-line space-y-6 border-t pt-8">
      <section>
        <div className="flex items-baseline justify-between">
          <span className="text-ink text-[11px] font-semibold tracking-widest uppercase">
            Color
          </span>
          <span className="text-ink-600 text-[13.5px]">{variant.color}</span>
        </div>

        <div className="mt-3 flex flex-wrap gap-2.5">
          {colors.map((color) => (
            <button
              key={color}
              type="button"
              title={color}
              aria-label={color}
              aria-pressed={variant.color === color}
              onClick={() => onSelect({ color })}
              className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
                variant.color === color
                  ? "border-ink"
                  : "border-line hover:border-line-strong"
              }`}
            >
              <span
                className="h-6 w-6 rounded-full border border-black/10"
                style={{ backgroundColor: colorHex.get(color) }}
              />
            </button>
          ))}
        </div>
      </section>

      {storages.length > 0 && (
        <section>
          <span className="text-ink text-[11px] font-semibold tracking-widest uppercase">
            Storage
          </span>

          <div className="mt-3 flex flex-wrap gap-2">
            {storages.map((storage) => {
              const active = variant.storage === storage;

              const available = product.variants.some(
                (item) =>
                  item.color === variant.color &&
                  item.storage === storage &&
                  item.stock > 0,
              );

              return (
                <button
                  key={storage}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onSelect({ storage })}
                  className={`min-w-19 border px-3.5 py-2 text-[13.5px] font-medium transition-colors ${
                    active
                      ? "border-ink bg-ink text-white"
                      : "border-line text-ink hover:border-ink"
                  } ${!available ? "opacity-50" : ""}`}
                >
                  {storage}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {rams.length > 0 && (
        <section>
          <span className="text-ink text-[11px] font-semibold tracking-widest uppercase">
            RAM
          </span>

          <div className="mt-3 flex flex-wrap gap-2">
            {rams.map((ram) => (
              <button
                key={ram}
                type="button"
                aria-pressed={variant.ram === ram}
                onClick={() => onSelect({ ram })}
                className={`min-w-19 border px-3.5 py-2 text-[13.5px] font-medium transition-colors ${
                  variant.ram === ram
                    ? "border-ink bg-ink text-white"
                    : "border-line text-ink hover:border-ink"
                }`}
              >
                {ram}
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default VariantSelector;
