import { ShoppingBagIcon } from "lucide-react";
import EmptyState from "../components/ui/EmptyState";
import { useCartStore } from "../store/cartStore";
import CartHeader from "../components/cart/CartHeader";
import OrderSummary from "../components/cart/OrderSummary";
import CartItem from "../components/cart/CartItem";

function Cart() {
  const { items, SHIPPING_FLAT } = useCartStore();

  const subtotal = items.reduce(
    (sum, item) => sum + item.variant.price * item.quantity,
    0,
  );

  const shipping = items.length > 0 ? SHIPPING_FLAT : 0;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="max-w-shell mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="sr-only">Cart</h1>
        <EmptyState
          icon={<ShoppingBagIcon size={20} />}
          title="Your cart is empty"
          description="Explore the catalogue and add a device — your cart is saved while you browse."
          primaryAction={{
            label: "Shop smartphones",
            to: "/shop?category=smartphones",
          }}
          secondaryAction={{ label: "View wishlist", to: "/wishlist" }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-shell mx-auto px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <CartHeader itemsLength={items.length} />

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px] lg:gap-14">
        <ul className="divide-line border-line divide-y border-y">
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </ul>

        <OrderSummary subtotal={subtotal} shipping={shipping} total={total} />
      </div>
    </div>
  );
}

export default Cart;
