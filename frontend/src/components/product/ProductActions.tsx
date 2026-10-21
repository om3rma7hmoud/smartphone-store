import { useState } from "react";
import { GitCompareIcon, HeartIcon } from "lucide-react";
import { toast } from "react-toastify";
import type { Product, ProductVariant } from "../../types";
import { useWishlistStore } from "../../store/wishlistStore";
import { useCompareStore } from "../../store/compareStore";

interface ProductActionsProps {
  product: Product;
  variant: ProductVariant;
  onAddToCart: () => Promise<void>;
  onBuyNow: () => Promise<void>;
}

function ProductActions({
  product,
  variant,
  onAddToCart,
  onBuyNow,
}: ProductActionsProps) {
  const { items, addItem, removeItem, isLoading } = useWishlistStore();

  const productIds = useCompareStore((state) => state.productIds);
  const toggleCompare = useCompareStore((state) => state.toggle);

  const [isAdding, setIsAdding] = useState(false);
  const [isBuying, setIsBuying] = useState(false);

  const wished = items.some((item) => item.productId === product.id);
  const compared = productIds.includes(product.id);
  const outOfStock = variant.stock <= 0;

  const handleAddToCart = async () => {
    try {
      setIsAdding(true);
      await onAddToCart();
      toast.success("Product added to cart successfully.");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to add product to cart.",
      );
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = async () => {
    try {
      setIsBuying(true);
      await onBuyNow();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to proceed to checkout.",
      );
    } finally {
      setIsBuying(false);
    }
  };

  const handleWishlist = async () => {
    try {
      if (wished) {
        await removeItem(product.id);
        toast.success("Product removed from wishlist.");
      } else {
        await addItem(product.id);
        toast.success("Product added to wishlist.");
      }
    } catch (error) {
      toast.error("Failed to update wishlist.");
    }
  };

  return (
    <div className="mt-8 flex flex-col gap-3">
      <div className="flex gap-3">
        <button
          type="button"
          disabled={outOfStock || isAdding || isBuying}
          onClick={handleAddToCart}
          className="bg-ink hover:bg-ink-800 disabled:bg-surface-sunken disabled:text-ink-300 h-12 flex-1 text-[14px] font-medium text-white transition-colors disabled:cursor-not-allowed"
        >
          {outOfStock ? "Out of stock" : isAdding ? "Adding..." : "Add to Cart"}
        </button>

        <button
          type="button"
          disabled={outOfStock || isAdding || isBuying}
          onClick={handleBuyNow}
          className="border-ink text-ink hover:bg-surface-muted disabled:border-line disabled:text-ink-300 h-12 flex-1 border text-[14px] font-medium transition-colors disabled:cursor-not-allowed"
        >
          {isBuying ? "Processing..." : "Buy Now"}
        </button>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          disabled={isLoading}
          onClick={handleWishlist}
          aria-pressed={wished}
          className="border-line text-ink-600 hover:border-ink hover:text-ink inline-flex h-11 flex-1 items-center justify-center gap-2 border text-[13.5px] font-medium transition-colors disabled:opacity-50"
        >
          <HeartIcon size={15} className={wished ? "fill-ink text-ink" : ""} />
          {wished ? "Saved" : "Add to Wishlist"}
        </button>

        <button
          type="button"
          onClick={() => toggleCompare(product.id)}
          aria-pressed={compared}
          className="border-line text-ink-600 hover:border-ink hover:text-ink inline-flex h-11 flex-1 items-center justify-center gap-2 border text-[13.5px] font-medium transition-colors"
        >
          <GitCompareIcon size={15} />
          {compared ? "In compare" : "Add to Compare"}
        </button>
      </div>
    </div>
  );
}

export default ProductActions;
