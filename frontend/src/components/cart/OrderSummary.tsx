import { Link, useNavigate } from "react-router-dom";
import { formatEGP } from "../../utils/format";

interface OrderSummary {
  subtotal: number;
  shipping: number;
  total: number;
}

function OrderSummary({ subtotal, shipping, total }: OrderSummary) {
  const navigate = useNavigate();

  return (
    <aside className="lg:sticky lg:top-24 lg:h-fit">
      <div className="border-line border p-6">
        <h2 className="text-ink text-[15px] font-semibold">Order summary</h2>
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
            <dd className="text-ink text-[19px] font-semibold tracking-[-0.01em]">
              {formatEGP(total)}
            </dd>
          </div>
        </dl>
        <button
          type="button"
          onClick={() => navigate("/checkout")}
          className="bg-ink ease-premium hover:bg-ink-800 mt-6 h-12 w-full text-[14px] font-medium text-white transition-colors duration-150"
        >
          Proceed to Checkout
        </button>
        <Link
          to="/shop"
          className="text-ink-400 ease-premium hover:text-ink mt-3 block text-center text-[13.5px] font-medium transition-colors duration-150"
        >
          Continue shopping
        </Link>
        <p className="border-line text-ink-400 mt-5 border-t pt-4 text-[12.5px] leading-relaxed">
          Taxes included. Cash on delivery available nationwide, or pay securely
          by card.
        </p>
      </div>
    </aside>
  );
}

export default OrderSummary;
