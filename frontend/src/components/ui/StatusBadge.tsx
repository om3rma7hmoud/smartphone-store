import type { OrderStatus } from "../../types";

const statusStyles: Record<OrderStatus, string> = {
  PENDING: "border-yellow-300 text-yellow-700 bg-yellow-50",
  CONFIRMED: "border-blue-300 text-blue-700 bg-blue-50",
  SHIPPED: "border-indigo-300 text-indigo-700 bg-indigo-50",
  DELIVERED: "border-green-300 text-green-700 bg-green-50",
  CANCELLED: "border-red-300 text-red-700 bg-red-50",
};

function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-flex items-center border px-2 py-1 text-[10px] font-semibold uppercase ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}

export default StatusBadge;
