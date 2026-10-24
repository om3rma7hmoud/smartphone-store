import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PackageIcon } from "lucide-react";
import type { OrderStatus } from "../../types";
import { formatDate, formatEGP } from "../../utils/format";
import StatusBadge from "../../components/ui/StatusBadge";
import EmptyState from "../../components/ui/EmptyState";
import { useOrdersStore } from "../../store/orderStore";
import Loading from "../../components/ui/Loading";

const tabs: Array<OrderStatus | "All"> = [
  "All",
  "PENDING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

function Orders() {
  const { orders, fetchOrders, isLoading } = useOrdersStore();
  const [tab, setTab] = useState<OrderStatus | "All">("All");

  const visible =
    tab === "All" ? orders : orders.filter((o) => o.status === tab);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <h2 className="text-ink text-[17px] font-semibold">Order history</h2>

      <div className="nova-scroll-x mt-4 flex gap-2 overflow-x-auto pb-1">
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            aria-pressed={tab === t}
            className={`ease-premium border px-3.5 py-1.5 text-[13px] font-medium whitespace-nowrap transition-colors duration-150 ${
              tab === t
                ? "border-ink bg-ink text-white"
                : "border-line text-ink-600 hover:border-ink hover:text-ink"
            }`}
          >
            {t === "All" ? "All" : t.charAt(0) + t.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            icon={<PackageIcon size={20} />}
            title={
              tab === "All" ? "No orders yet" : `No ${tab.toLowerCase()} orders`
            }
            description="When you place an order it will appear here with live delivery status."
            primaryAction={{ label: "Start shopping", to: "/shop" }}
          />
        </div>
      ) : (
        <ul className="mt-6 space-y-4">
          {visible.map((order) => (
            <li key={order.id} className="border-line border">
              <div className="border-line flex flex-wrap items-center gap-x-6 gap-y-3 border-b px-5 py-4">
                <div>
                  <p className="text-ink-400 text-[12px] tracking-widest uppercase">
                    Order
                  </p>
                  <p className="text-ink mt-1 text-[14px] font-semibold">
                    #{order.id}
                  </p>
                </div>

                <div>
                  <p className="text-ink-400 text-[12px] tracking-widest uppercase">
                    Date
                  </p>
                  <p className="text-ink mt-1 text-[14px]">
                    {formatDate(order.createdAt)}
                  </p>
                </div>

                <div>
                  <p className="text-ink-400 text-[12px] tracking-widest uppercase">
                    Payment
                  </p>
                  <p className="text-ink mt-1 text-[14px]">
                    {order.paymentMethod === "STRIPE"
                      ? "Card"
                      : "Cash on delivery"}
                  </p>
                </div>

                <div>
                  <p className="text-ink-400 text-[12px] tracking-widest uppercase">
                    Total
                  </p>
                  <p className="text-ink mt-1 text-[14px] font-semibold">
                    {formatEGP(Number(order.total))}
                  </p>
                </div>

                <div className="ml-auto flex items-center gap-4">
                  <StatusBadge status={order.status} />
                  <Link
                    to={`/account/orders/${order.id}`}
                    className="border-line-strong text-ink ease-premium hover:border-ink inline-flex h-9 items-center border px-4 text-[13px] font-medium transition-colors duration-150"
                  >
                    Details
                  </Link>
                </div>
              </div>

              <ul className="flex flex-wrap gap-4 px-5 py-4">
                {order.items.map((item) => (
                  <li key={item.id} className="flex items-center gap-3">
                    <img
                      src={item.product?.images?.[0]?.url || "/placeholder.svg"}
                      alt={item.productName}
                      className="bg-surface-muted h-12 w-12 shrink-0 object-cover"
                    />

                    <div>
                      <p className="text-ink text-[13.5px] font-medium">
                        {item.productName}
                      </p>
                      <p className="text-ink-400 text-[12.5px]">
                        {item.variantInfo} · Qty {item.quantity}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Orders;
