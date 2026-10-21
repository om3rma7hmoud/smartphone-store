import { MinusIcon, PlusIcon, XIcon } from "lucide-react";
import { formatEGP, variantLabel } from "../../utils/format";
import { Link } from "react-router-dom";
import StockPill from "../ui/StockPill";
import { useCartStore } from "../../store/cartStore";
import type { Product, ProductVariant } from "../../types";

interface CartItemProps {
  item: {
    id: string;
    productId: string;
    variantId: string;
    quantity: number;
    product: Product;
    variant: ProductVariant;
  };
}

function CartItem({ item }: CartItemProps) {
  const { removeItem, updateItem } = useCartStore();

  const handleDecrease = async () => {
    if (item.quantity <= 1) {
      await removeItem(item.id);
      return;
    }

    await updateItem(item.id, item.quantity - 1);
  };

  const handleIncrease = async () => {
    if (item.quantity >= item.variant.stock) return;

    await updateItem(item.id, item.quantity + 1);
  };

  const image = item.product.images?.[0]?.url;

  return (
    <li className="flex gap-4 py-5 sm:gap-6">
      <Link
        to={`/product/${item.product.slug}`}
        className="bg-surface-muted h-24 w-24 shrink-0 sm:h-28 sm:w-28"
      >
        {image && (
          <img
            src={image}
            alt={item.product.name}
            className="h-full w-full object-cover"
          />
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-ink-400 text-[11px] font-semibold tracking-widest uppercase">
              {item.product.brand.name}
            </p>

            <h2 className="text-ink mt-1 text-[15.5px] font-semibold">
              <Link
                to={`/product/${item.product.slug}`}
                className="hover:text-accent"
              >
                {item.product.name}
              </Link>
            </h2>

            <p className="text-ink-400 mt-1 text-[13.5px]">
              {variantLabel(item.variant)}
            </p>

            <div className="mt-2">
              <StockPill stock={item.variant.stock} />
            </div>
          </div>

          <button
            type="button"
            onClick={() => removeItem(item.id)}
            aria-label={`Remove ${item.product.name} from cart`}
            className="text-ink-300 ease-premium hover:text-ink shrink-0 p-1 transition-colors duration-150"
          >
            <XIcon size={16} />
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
          <div className="border-line inline-flex items-center border">
            <button
              type="button"
              onClick={handleDecrease}
              aria-label="Decrease quantity"
              className="text-ink ease-premium hover:bg-surface-muted flex h-9 w-9 items-center justify-center transition-colors duration-150"
            >
              <MinusIcon size={14} />
            </button>

            <span
              className="text-ink w-9 text-center text-[14px] font-medium"
              aria-live="polite"
            >
              {item.quantity}
            </span>

            <button
              type="button"
              onClick={handleIncrease}
              disabled={item.quantity >= item.variant.stock}
              aria-label="Increase quantity"
              className="text-ink ease-premium hover:bg-surface-muted disabled:text-ink-300 flex h-9 w-9 items-center justify-center transition-colors duration-150 disabled:cursor-not-allowed"
            >
              <PlusIcon size={14} />
            </button>
          </div>

          <div className="text-right">
            <p className="text-ink text-[15.5px] font-semibold">
              {formatEGP(item.quantity * item.variant.price)}
            </p>

            <p className="text-ink-400 text-[12.5px]">
              {formatEGP(item.variant.price)} each
            </p>
          </div>
        </div>
      </div>
    </li>
  );
}

export default CartItem;
