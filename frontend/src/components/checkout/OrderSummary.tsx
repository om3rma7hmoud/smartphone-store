import { Link } from "react-router-dom";

import type { CartItem } from "../../store/cartStore";
import { formatEGP } from "../../utils/format";

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  error: string;
  submitting: boolean;
  canSubmit: boolean;
}

function OrderSummary({
  items,
  subtotal,
  shipping,
  total,
  error,
  submitting,
  canSubmit,
}: OrderSummaryProps) {
  return (
    <aside className="lg:sticky lg:top-24 lg:h-fit">
      <div className="border-line border p-6">
        <h2 className="text-ink text-[15px] font-semibold">Order summary</h2>

        <ul className="border-line mt-5 space-y-4 border-b pb-5">
          {items.map((item) => (
            <li key={item.id} className="flex gap-3">
              <img
                src={item.product.images?.[0]?.url}
                alt={item.product.name}
                className="bg-surface-muted h-14 w-14 shrink-0 object-cover"
              />

              <div className="min-w-0 flex-1">
                <p className="text-ink truncate text-[14px] font-medium">
                  {item.product.name}
                </p>

                <p className="text-ink-400 mt-0.5 truncate text-[12.5px]">
                  {[item.variant.color, item.variant.storage, item.variant.ram]
                    .filter(Boolean)
                    .join(" / ")}
                </p>

                <p className="text-ink-400 mt-0.5 text-[12.5px]">
                  Qty {item.quantity}
                </p>
              </div>

              <p className="text-ink shrink-0 text-[14px] font-medium">
                {formatEGP(item.variant.price * item.quantity)}
              </p>
            </li>
          ))}
        </ul>

        <dl className="mt-5 space-y-3 text-[14.5px]">
          <div className="flex items-center justify-between">
            <dt className="text-ink-400">Subtotal</dt>
            <dd className="text-ink font-medium">{formatEGP(subtotal)}</dd>
          </div>

          <div className="flex items-center justify-between">
            <dt className="text-ink-400">Shipping</dt>
            <dd className="text-ink font-medium">{formatEGP(shipping)}</dd>
          </div>

          <div className="border-line flex items-center justify-between border-t pt-3">
            <dt className="text-ink text-[15px] font-semibold">Total</dt>

            <dd className="text-ink text-[19px] font-semibold">
              {formatEGP(total)}
            </dd>
          </div>
        </dl>

        {error && (
          <p className="text-danger mt-4 text-[13px]" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={!canSubmit || submitting}
          className="bg-ink hover:bg-ink-800 disabled:bg-ink-600 mt-6 h-12 w-full text-[14px] font-medium text-white transition-colors disabled:cursor-not-allowed"
        >
          {submitting ? "Processing..." : "Place Order"}
        </button>

        <Link
          to="/cart"
          className="text-ink-400 hover:text-ink mt-3 block text-center text-[13.5px] font-medium transition-colors"
        >
          Back to cart
        </Link>
      </div>
    </aside>
  );
}

export default OrderSummary;
