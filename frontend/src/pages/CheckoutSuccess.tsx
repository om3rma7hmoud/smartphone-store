import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, Clock3 } from "lucide-react";

export default function CheckoutSuccess() {
  const [params] = useSearchParams();

  const orderId = params.get("orderId");
  const sessionId = params.get("session_id");
  const isStripe = Boolean(sessionId);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 py-16 text-center">
      {isStripe ? (
        <Clock3 size={48} className="text-ink" strokeWidth={1.4} />
      ) : (
        <CheckCircle2 size={48} className="text-ink" strokeWidth={1.4} />
      )}

      <h1 className="text-ink mt-6 text-2xl font-semibold">
        {isStripe ? "Payment submitted" : "Order placed successfully"}
      </h1>

      <p className="text-ink-400 mt-3 text-[14px] leading-relaxed">
        {isStripe
          ? "Your payment is being verified. Your order status will update once Stripe confirms the payment."
          : "Your order has been received. You can follow its status from your account."}
      </p>

      {orderId && (
        <p className="text-ink mt-4 text-sm">
          Order ID: <span className="font-semibold">{orderId}</span>
        </p>
      )}

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          to="/account/orders"
          className="bg-ink hover:bg-ink-800 inline-flex h-11 items-center px-6 text-sm font-medium text-white"
        >
          View my orders
        </Link>

        <Link
          to="/shop"
          className="border-line text-ink hover:border-ink inline-flex h-11 items-center border px-6 text-sm font-medium"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
