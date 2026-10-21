import { StarRating } from "../ui/StartRating";
import type { Product } from "../../types";

interface ProductInfoProps {
  product: Product;
}

function ProductInfo({ product }: ProductInfoProps) {
  return (
    <div>
      <p className="text-ink-400 text-[11px] font-semibold tracking-widest uppercase">
        {product.brand.name}
      </p>

      <h1 className="text-ink mt-2 text-[32px] leading-tight font-semibold tracking-tight sm:text-[40px]">
        {product.name}
      </h1>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <StarRating rating={product.rating} />
        <span className="text-ink-600 text-[13.5px]">
          {product.rating} ({product.reviewCount})
        </span>
        <a
          href="#reviews"
          className="text-ink-400 text-[13.5px] underline-offset-4 hover:underline"
        >
          Read reviews
        </a>
      </div>

      <p className="text-ink-600 mt-5 max-w-lg text-[15px] leading-relaxed">
        {product.description}
      </p>
    </div>
  );
}

export default ProductInfo;
