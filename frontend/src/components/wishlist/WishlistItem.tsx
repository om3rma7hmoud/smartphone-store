import { XIcon } from "lucide-react";
import { useWishlistStore } from "../../store/wishlistStore";
import { Link } from "react-router-dom";
import { StarRating } from "../ui/StartRating";
import StockPill from "../ui/StockPill";
import { formatEGP } from "../../utils/format";
import type { Product, ProductVariant } from "../../types";
import { useCartStore } from "../../store/cartStore";
import { toast } from "react-toastify/unstyled";
import { useState } from "react";

interface WishlistItem {
  product: Product;
  variant: ProductVariant;
}

function WishlistItem({ product, variant }: WishlistItem) {
  const { removeItem } = useWishlistStore();
  const {
    addItem: addCart,
    items: cartItems,
    removeItem: removeCartItem,
  } = useCartStore();
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

  return (
    <li
      key={product.id}
      className="group border-line ease-premium hover:border-line-strong hover:shadow-card relative flex flex-col border bg-white transition-[border-color,box-shadow] duration-200"
    >
      <button
        type="button"
        onClick={() => removeItem(product.id)}
        aria-label={`Remove ${product.name} from wishlist`}
        className="border-line text-ink-400 ease-premium hover:border-ink hover:text-ink absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border bg-white/90 backdrop-blur transition-colors duration-150"
      >
        <XIcon size={15} />
      </button>
      <Link
        to={`/product/${product.slug}`}
        className="bg-surface-muted block aspect-square overflow-hidden"
      >
        <img
          src={product.images[0].url}
          alt={product.images[0].altText}
          className="ease-premium h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-ink-400 text-[11px] font-semibold tracking-widest uppercase">
          {product.brand.name}
        </p>
        <h2 className="text-ink mt-1.5 text-[15px] font-semibold">
          <Link to={`/product/${product.slug}`} className="hover:text-accent">
            {product.name}
          </Link>
        </h2>
        <div className="mt-2 flex items-center gap-2">
          <StarRating rating={product.rating} />
          <span className="text-ink-400 text-[12px]">
            {product.rating} ({product.reviewCount})
          </span>
        </div>
        <div className="mt-3">
          <StockPill stock={variant.stock} />
        </div>
        <div className="mt-auto pt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-ink text-[17px] font-semibold">
              {formatEGP(variant.price)}
            </span>
            {variant.compareAtPrice && (
              <span className="text-ink-300 text-[13px] line-through">
                {formatEGP(variant.compareAtPrice)}
              </span>
            )}
          </div>
          <div className="mt-3 flex gap-2">
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
              onClick={() => removeItem(product.id)}
              className="border-line-strong text-ink-600 ease-premium hover:border-ink hover:text-ink h-10 border px-3 text-[13px] font-medium transition-colors duration-150"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}

export default WishlistItem;
