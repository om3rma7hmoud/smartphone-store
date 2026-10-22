import { Link } from "react-router-dom";
import {
  UserRound,
  Package,
  Heart,
  MapPin,
  LockKeyhole,
  ChevronRight,
  ShoppingBag,
  ArrowUpRight,
  Mail,
  Phone,
} from "lucide-react";

import { formatEGP } from "../../utils/format";
import StatusBadge from "../../components/ui/StatusBadge";
import { useAuthStore } from "../../store/authStore";
import { useWishlistStore } from "../../store/wishlistStore";
import { useOrdersStore } from "../../store/orderStore";
import { useEffect } from "react";

function Profile() {
  const { user } = useAuthStore();
  const { items } = useWishlistStore();
  const { orders, fetchOrders, isLoading } = useOrdersStore();

  if (!user) return null;

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const latest = orders[0];

  const lifetime = orders
    .filter((order) => order.status !== "CANCELLED")
    .reduce((sum, order) => sum + order.total, 0);

  const stats = [
    {
      label: "Orders placed",
      value: isLoading ? "..." : String(orders.length),
      icon: Package,
    },
    {
      label: "Lifetime spend",
      value: isLoading ? "..." : formatEGP(lifetime),
      icon: ShoppingBag,
    },
    {
      label: "Saved products",
      value: isLoading ? "..." : String(items.length),
      icon: Heart,
    },
  ];

  const shortcuts = [
    {
      title: "My Orders",
      description: "Track and manage your orders",
      icon: Package,
      to: "/account/orders",
    },
    {
      title: "My Wishlist",
      description: "Products you've saved for later",
      icon: Heart,
      to: "/wishlist",
    },
    {
      title: "Addresses",
      description: "Manage your delivery addresses",
      icon: MapPin,
      to: "/account/addresses",
    },
    {
      title: "Security",
      description: "Manage your account security settings",
      icon: LockKeyhole,
      to: "/account/security",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <section className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-ink-400 text-[13px]">Your account</p>
          <h1 className="text-ink mt-1 text-2xl font-semibold tracking-tight">
            Welcome back, {user.name}
          </h1>
          <p className="text-ink-400 mt-2 text-[14px]">
            Manage your account, orders, and preferences.
          </p>
        </div>

        <Link
          to="/account/edit"
          className="border-line-strong text-ink hover:border-ink inline-flex h-10 items-center gap-2 border px-4 text-[13px] font-medium transition-colors"
        >
          <UserRound size={16} />
          Edit profile
        </Link>
      </section>

      {/* Profile Details */}
      <section className="border-line border">
        <div className="border-line flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-ink text-[15px] font-semibold">
            Profile details
          </h2>

          <Link
            to="/account/edit"
            className="text-ink-400 hover:text-ink text-[13px] font-medium transition-colors"
          >
            Edit details
          </Link>
        </div>

        <dl className="divide-line grid grid-cols-1 divide-y sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <div className="px-6 py-5">
            <dt className="text-ink-400 flex items-center gap-2 text-[12px] tracking-widest uppercase">
              <UserRound size={14} />
              Name
            </dt>
            <dd className="text-ink mt-2 text-[15px] font-medium">
              {user.name}
            </dd>
          </div>

          <div className="px-6 py-5">
            <dt className="text-ink-400 flex items-center gap-2 text-[12px] tracking-widest uppercase">
              <Mail size={14} />
              Email
            </dt>
            <dd className="text-ink mt-2 truncate text-[15px] font-medium">
              {user.email}
            </dd>
          </div>

          <div className="px-6 py-5">
            <dt className="text-ink-400 flex items-center gap-2 text-[12px] tracking-widest uppercase">
              <Phone size={14} />
              Phone
            </dt>
            <dd className="text-ink mt-2 text-[15px] font-medium">
              {user.phone || "Not provided"}
            </dd>
          </div>
        </dl>
      </section>

      {/* Statistics */}
      <section className="grid gap-4 sm:grid-cols-3">
        {stats.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="border-line flex items-start justify-between border px-5 py-5"
          >
            <div>
              <p className="text-ink-400 text-[12px] tracking-widest uppercase">
                {label}
              </p>
              <p className="text-ink mt-3 text-[22px] font-semibold tracking-tight">
                {value}
              </p>
            </div>

            <div className="bg-surface-muted text-ink-400 flex h-10 w-10 items-center justify-center">
              <Icon size={19} />
            </div>
          </div>
        ))}
      </section>

      {/* Latest Order */}
      <section className="border-line border">
        <div className="border-line flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-ink text-[15px] font-semibold">Latest order</h2>

          <Link
            to="/account/orders"
            className="text-ink-400 hover:text-ink flex items-center gap-1 text-[13px] font-medium transition-colors"
          >
            All orders
            <ArrowUpRight size={14} />
          </Link>
        </div>

        {latest ? (
          <div className="flex flex-wrap items-center gap-4 px-6 py-5">
            <img
              src={latest.items[0]?.product.images[0]?.url}
              alt={latest.items[0]?.product.images[0]?.altText || ""}
              className="bg-surface-muted h-16 w-16 shrink-0 object-cover"
            />

            <div className="min-w-0 flex-1">
              <p className="text-ink text-[14.5px] font-semibold">
                #{latest.id}
              </p>

              <p className="text-ink-400 mt-1 text-[13px]">
                {latest.items.length}{" "}
                {latest.items.length === 1 ? "item" : "items"} ·{" "}
                {formatEGP(latest.total)} · {latest.paymentMethod}
              </p>
            </div>

            <StatusBadge status={latest.status} />

            <Link
              to={`/account/orders/${latest.id}`}
              className="border-line-strong text-ink hover:border-ink inline-flex h-10 items-center border px-4 text-[13px] font-medium transition-colors"
            >
              View details
            </Link>
          </div>
        ) : (
          <div className="flex flex-col items-center px-6 py-10 text-center">
            <Package className="text-ink-400" size={30} strokeWidth={1.5} />

            <h3 className="text-ink mt-4 text-[15px] font-semibold">
              No orders yet
            </h3>

            <p className="text-ink-400 mt-2 text-[13px]">
              Your recent orders will appear here.
            </p>

            <Link
              to="/shop"
              className="bg-ink hover:bg-ink/90 mt-5 inline-flex h-10 items-center px-5 text-[13px] font-medium text-white transition-colors"
            >
              Start shopping
            </Link>
          </div>
        )}
      </section>

      {/* Account Shortcuts */}
      <section>
        <h2 className="text-ink mb-4 text-[15px] font-semibold">
          Account settings
        </h2>

        <div className="border-line divide-line divide-y border">
          {shortcuts.map(({ title, description, icon: Icon, to }) => (
            <Link
              key={title}
              to={to}
              className="group hover:bg-surface-muted flex items-center gap-4 px-5 py-4 transition-colors"
            >
              <div className="bg-surface-muted text-ink-400 flex h-10 w-10 shrink-0 items-center justify-center">
                <Icon size={19} />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-ink text-[14px] font-medium">{title}</h3>
                <p className="text-ink-400 mt-1 text-[12.5px]">{description}</p>
              </div>

              <ChevronRight
                size={18}
                className="text-ink-400 transition-transform group-hover:translate-x-1"
              />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Profile;
