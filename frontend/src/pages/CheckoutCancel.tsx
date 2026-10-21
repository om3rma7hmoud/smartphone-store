import { Link, useSearchParams } from "react-router-dom";
import { CircleX } from "lucide-react";

export default function CheckoutCancel() {
  const [params] = useSearchParams();
  const orderId = params.get("orderId");

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 py-16 text-center">
      <CircleX size={48} className="text-ink" strokeWidth={1.4} />

      <h1 className="text-ink mt-6 text-2xl font-semibold">
        Payment cancelled
      </h1>

      <p className="text-ink-400 mt-3 text-[14px] leading-relaxed">
        Your payment was not completed. You can return to checkout and try
        again.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          to="/cart"
          className="bg-ink hover:bg-ink-800 inline-flex h-11 items-center px-6 text-sm font-medium text-white"
        >
          Back to cart
        </Link>

        <Link
          to="/account/orders"
          className="border-line text-ink hover:border-ink inline-flex h-11 items-center border px-6 text-sm font-medium"
        >
          My orders
        </Link>
      </div>

      {orderId && (
        <p className="text-ink-400 mt-5 text-xs">Order ID: {orderId}</p>
      )}
    </div>
  );
}
