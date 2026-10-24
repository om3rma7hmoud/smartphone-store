import { Link, Navigate, useParams } from "react-router-dom";
import { CheckIcon, ChevronLeftIcon } from "lucide-react";
import type { OrderStatus } from "../../types";
import { formatDate, formatEGP } from "../../utils/format";
import StatusBadge from "../../components/ui/StatusBadge";
import { useEffect } from "react";
import { useOrdersStore } from "../../store/orderStore";
import Loading from "../../components/ui/Loading";

const timeline: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
];

function OrderDetails() {
  const { id } = useParams<{ id: string }>();

  const {
    selectedOrder: order,
    isLoadingDetails,
    fetchOrderById,
  } = useOrdersStore();

  useEffect(() => {
    if (id) {
      fetchOrderById(id).catch(() => {});
    }
  }, [id, fetchOrderById]);

  if (isLoadingDetails) return <Loading />;

  if (!order || order.id !== id) {
    return <Navigate to="/account/orders" replace />;
  }
  const currentIndex = timeline.indexOf(order.status);
  const cancelled = order.status === "CANCELLED";

  return (
    <div>
      <Link
        to="/account/orders"
        className="text-ink-400 ease-premium hover:text-ink inline-flex items-center gap-1.5 text-[13.5px] font-medium transition-colors duration-150"
      >
        <ChevronLeftIcon size={15} />
        All orders
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-ink text-[22px] font-semibold tracking-[-0.02em]">
            Order #{order.id}
          </h2>
          <p className="text-ink-400 mt-1 text-[14px]">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <section
        aria-label="Delivery progress"
        className="border-line mt-8 border p-6"
      >
        {cancelled ? (
          <p className="text-ink-600 text-[14px]">
            This order was cancelled on {formatDate(order.createdAt)}. Any card
            payment is refunded within 5 business days.
          </p>
        ) : (
          <ol className="flex flex-col gap-6 sm:flex-row sm:gap-0">
            {timeline.map((step, i) => {
              const done = i <= currentIndex;
              return (
                <li
                  key={step}
                  className="flex flex-1 items-start gap-3 sm:block"
                >
                  <div className="flex items-center sm:w-full">
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[12px] font-semibold ${
                        done
                          ? "border-ink bg-ink text-white"
                          : "border-line-strong text-ink-300 bg-white"
                      }`}
                    >
                      {done ? <CheckIcon size={14} strokeWidth={2.4} /> : i + 1}
                    </span>
                    {i < timeline.length - 1 && (
                      <span
                        className={`ml-2 hidden h-px flex-1 sm:block ${
                          i < currentIndex ? "bg-ink" : "bg-line"
                        }`}
                      />
                    )}
                  </div>
                  <div className="sm:mt-3">
                    <p
                      className={`text-[14px] font-medium ${done ? "text-ink" : "text-ink-300"}`}
                    >
                      {step}
                    </p>
                    <p className="text-ink-400 mt-0.5 text-[12.5px]">
                      {i === 0
                        ? "Order received"
                        : i === 1
                          ? "Payment verified"
                          : i === 2
                            ? "With the courier"
                            : "Handed to you"}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </section>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px] lg:gap-10">
        <section aria-label="Items" className="border-line border">
          <h3 className="border-line text-ink border-b px-5 py-4 text-[15px] font-semibold">
            Items
          </h3>
          <ul className="divide-line divide-y">
            {order.items.map((item) => (
              <li key={item.id} className="flex gap-4 px-5 py-4">
                <img
                  src={item.product?.images?.[0]?.url || "/placeholder.svg"}
                  alt={item.productName}
                  className="bg-surface-muted h-16 w-16 shrink-0 object-cover"
                />

                <div className="min-w-0 flex-1">
                  <p className="text-ink-400 text-[11px] font-semibold tracking-widest uppercase">
                    {item.product.brand.name}
                  </p>

                  <p className="text-ink mt-1 text-[14.5px] font-medium">
                    {item.productName}
                  </p>

                  <p className="text-ink-400 mt-0.5 text-[13px]">
                    {item.variantInfo}
                  </p>

                  <p className="text-ink-400 mt-0.5 text-[13px]">
                    Quantity {item.quantity}
                  </p>
                </div>

                <p className="text-ink shrink-0 text-[14.5px] font-medium">
                  {formatEGP(Number(item.unitPrice) * item.quantity)}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <aside className="space-y-6">
          <div className="border-line border p-5">
            <h3 className="text-ink text-[15px] font-semibold">Summary</h3>
            <dl className="mt-4 space-y-2.5 text-[14px]">
              <div className="flex justify-between">
                <dt className="text-ink-400">Subtotal</dt>
                <dd className="text-ink font-medium">
                  {formatEGP(order.subtotal)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-400">Shipping</dt>
                <dd className="text-ink font-medium">
                  {formatEGP(Number(order.shippingFee))}
                </dd>
              </div>
              <div className="border-line flex justify-between border-t pt-2.5">
                <dt className="text-ink text-[15px] font-semibold">Total</dt>
                <dd className="text-ink text-[17px] font-semibold">
                  {formatEGP(order.total)}
                </dd>
              </div>
            </dl>
          </div>

          <div className="border-line border p-5">
            <h3 className="text-ink text-[15px] font-semibold">
              Shipping address
            </h3>
            <p className="text-ink mt-3 text-[14px]">
              {order.address.fullName}
            </p>
            <p className="text-ink-400 mt-1 text-[13.5px] leading-relaxed">
              {order.address.street}
              <br />
              {order.address.area}, {order.address.city}
              <br />
              {order.address.phone}
            </p>
          </div>

          <div className="border-line border p-5">
            <h3 className="text-ink text-[15px] font-semibold">
              Payment method
            </h3>
            <p className="text-ink mt-2 text-[14px]">
              {order.paymentMethod === "STRIPE" ? "Card" : "Cash on delivery"}
            </p>
            <p className="text-ink-400 mt-2 text-[13px]">
              Payment status: {order.paymentStatus}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default OrderDetails;
