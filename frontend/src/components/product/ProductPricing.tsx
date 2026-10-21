import type { ProductVariant } from "../../types";
import { discountPercent, formatEGP } from "../../utils/format";
import { DiscountBadge } from "../ui/DiscountBadge";
import StockPill from "../ui/StockPill";

interface ProductPricingProps {
  variant: ProductVariant;
}

function ProductPricing({ variant }: ProductPricingProps) {
  const percent = discountPercent(variant.price, variant.compareAtPrice);

  return (
    <div>
      <div className="flex flex-wrap items-baseline gap-3">
        <span className="text-ink text-[30px] font-semibold tracking-tight">
          {formatEGP(variant.price)}
        </span>

        {variant.compareAtPrice && (
          <span className="text-ink-300 text-[16px] line-through">
            {formatEGP(variant.compareAtPrice)}
          </span>
        )}

        {percent > 0 && <DiscountBadge percent={percent} />}
      </div>

      <div className="mt-2">
        <StockPill stock={variant.stock} />
      </div>
    </div>
  );
}

export default ProductPricing;
