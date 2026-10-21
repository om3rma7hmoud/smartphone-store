import { XIcon } from "lucide-react";
import type { Product } from "../../types";

interface ProductsLength {
  results: Product[];
  chips: {
    label: string;
    clear: () => void;
  }[];
}

function ProductsLength({ results, chips }: ProductsLength) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      <p className="text-ink-400 mr-1 text-[13.5px]">
        {results.length} {results.length === 1 ? "product" : "products"}
      </p>
      {chips.map((chip) => (
        <button
          key={chip.label}
          type="button"
          onClick={chip.clear}
          className="border-line bg-surface-muted text-ink ease-premium hover:border-ink inline-flex items-center gap-1.5 border px-2.5 py-1 text-[12.5px] transition-colors duration-150"
        >
          {chip.label}
          <XIcon size={12} />
        </button>
      ))}
    </div>
  );
}

export default ProductsLength;
