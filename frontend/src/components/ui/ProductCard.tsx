import { GitCompareIcon, HeartIcon } from "lucide-react";
import type { Product } from "../../types";
import {
  cheapestVariant,
  discountPercent,
  formatEGP,
} from "../../utils/format";
import { Link } from "react-router-dom";
import { StarRating } from "./StartRating";
import { DiscountBadge } from "./DiscountBadge";
import { useCompareStore } from "../../store/compareStore";
import { useWishlistStore } from "../../store/wishlistStore";
import { toast } from "react-toastify";
import { useState } from "react";
import { useCartStore } from "../../store/cartStore";

interface ProductCardProps {
  product: Product;
  layout?: "grid" | "compact";
}

function ProductCard({ product, layout = "grid" }: ProductCardProps) {
  const { productIds, toggle } = useCompareStore();
  const { items, addItem, removeItem } = useWishlistStore();
  const {
    addItem: addCart,
    items: cartItems,
    removeItem: removeCartItem,
  } = useCartStore();
  const wished = items.some((item) => item.productId === product.id);
  const compared = productIds.includes(product.id);
  const variant = cheapestVariant(product);
  const percent = discountPercent(variant.price, variant.compareAtPrice);
  const colors = Array.from(
    new Map(product.variants.map((v) => [v.color, v.colorHex])).entries(),
  );
  const [isCartLoading, setIsCartLoading] = useState(false);

  const cartItem = cartItems?.find((item) => item.variantId === variant.id);

  const handleCartToggle = async () => {
    if (isCartLoading || variant.stock <= 0) return;

    setIsCartLoading(true);

    try {
      if (cartItem) {
        await removeCartItem(cartItem.id);
        toast.success("Removed from cart");
      } else {
        await addCart(variant.id, 1);
        toast.success("Added to cart");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsCartLoading(false);
    }
  };

  const toggleWished = async () => {
    try {
      if (wished) await removeItem(product.id);
      else await addItem(product.id);
    } catch {
      toast.error("Unable to update your wishlist. Please try again.");
    }
  };

  return (
    <article className="group border-line ease-premium hover:border-line-strong hover:shadow-card flex h-full flex-col border bg-white transition-[border-color,box-shadow] duration-200">
      <div className="relative">
        <Link
          to={`/product/${product.slug}`}
          className="bg-surface-muted block aspect-square overflow-hidden"
          aria-label={`View ${product.name}`}
        >
          <img
            src={product.images[0].url}
            alt={`${product.brand.name} ${product.name}`}
            loading="lazy"
            className="ease-premium h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </Link>
        <div className="pointer-events-none absolute top-3 left-3 flex gap-1.5">
          {percent > 0 && <DiscountBadge percent={percent} />}
          {product.tags.includes("new") && (
            <span className="border-line text-ink-600 inline-flex items-center rounded-sm border bg-white/90 px-1.5 py-0.5 text-[11px] leading-none font-medium tracking-[0.08em] uppercase backdrop-blur">
              New
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={toggleWished}
          aria-pressed={wished}
          aria-label={
            wished
              ? `Remove ${product.name} from wishlist`
              : `Save ${product.name} to wishlist`
          }
          className={`ease-premium absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full border bg-white/90 backdrop-blur transition-colors duration-150 ${
            wished
              ? "border-ink text-ink"
              : "border-line text-ink-400 hover:border-ink-300 hover:text-ink"
          }`}
        >
          <HeartIcon size={15} className={wished ? "fill-ink" : ""} />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-ink-400 text-[11px] font-semibold tracking-widest uppercase">
          {product.brand.name}
        </p>
        <h3 className="text-ink mt-1.5 text-[15px] leading-snug font-semibold tracking-[-0.01em]">
          <Link to={`/product/${product.slug}`} className="hover:text-accent">
            {product.name}
          </Link>
        </h3>

        <div className="mt-2 flex items-center gap-2">
          <StarRating rating={product.rating} />
          <span className="text-ink-400 text-[12px]">
            {product.rating} ({product.reviewCount})
          </span>
        </div>

        {layout === "grid" && (
          <div
            className="mt-3 flex items-center gap-1.5"
            aria-label="Available colors"
          >
            {colors.slice(0, 4).map(([name, hex]) => (
              <span
                key={name}
                title={name}
                className="border-line-strong h-3.5 w-3.5 rounded-full border"
                style={{ backgroundColor: hex }}
              />
            ))}
            {colors.length > 4 && (
              <span className="text-ink-400 text-[11px]">
                +{colors.length - 4}
              </span>
            )}
          </div>
        )}

        <div className="mt-auto pt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-ink text-[17px] font-semibold tracking-[-0.01em]">
              {formatEGP(variant.price)}
            </span>
            {variant.compareAtPrice && (
              <span className="text-ink-300 text-[13px] line-through">
                {formatEGP(variant.compareAtPrice)}
              </span>
            )}
          </div>

          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={handleCartToggle}
              disabled={variant.stock <= 0 || isCartLoading}
              className="bg-ink ease-premium hover:bg-ink-800 disabled:bg-surface-sunken disabled:text-ink-300 h-10 flex-1 text-[13px] font-medium text-white transition-colors duration-150 disabled:cursor-not-allowed"
            >
              {variant.stock <= 0
                ? "Out of Stock"
                : isCartLoading
                  ? "Please wait..."
                  : cartItem
                    ? "Remove from Cart"
                    : "Add to Cart"}
            </button>
            <button
              type="button"
              onClick={() => toggle(product.id)}
              aria-pressed={compared}
              aria-label={
                compared
                  ? `Remove ${product.name} from compare`
                  : `Compare ${product.name}`
              }
              title="Compare"
              className={`ease-premium flex h-10 w-10 items-center justify-center border transition-colors duration-150 ${
                compared
                  ? "border-ink bg-ink text-white"
                  : "border-line-strong text-ink-600 hover:border-ink hover:text-ink"
              }`}
            >
              <GitCompareIcon size={15} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
