import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { LockIcon } from "lucide-react";

import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";
import { useAddressesStore } from "../store/addressesStore";

import { createOrder, createCheckoutSession } from "../api/orders.api";

import type { Address, PaymentMethod } from "../types";

import CustomerInfo from "../components/checkout/CustomerInfo";
import ShippingAddress from "../components/checkout/ShippingAddress";
import PaymentSection from "../components/checkout/PaymentSection";
import OrderSummary from "../components/checkout/OrderSummary";

function Checkout() {
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);

  const items = useCartStore((state) => state.items);
  const shipping = useCartStore((state) => state.SHIPPING_FLAT);
  const removeItem = useCartStore((state) => state.removeItem);

  const addresses = useAddressesStore((state) => state.addresses);
  const isLoadingAddresses = useAddressesStore((state) => state.isLoading);
  const fetchAddresses = useAddressesStore((state) => state.fetchAddresses);

  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [payment, setPayment] = useState<PaymentMethod>("CASH_ON_DELIVERY");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  useEffect(() => {
    if (addresses.length === 0) return;

    setSelectedAddressId((current) => {
      if (current && addresses.some((address) => address.id === current)) {
        return current;
      }

      return (
        addresses.find((address) => address.isDefault)?.id ?? addresses[0].id
      );
    });
  }, [addresses]);

  if (items.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  const selectedAddress = addresses.find(
    (address: Address) => address.id === selectedAddressId,
  );

  const subtotal = items.reduce(
    (sum, item) => sum + item.variant.price * item.quantity,
    0,
  );

  const total = subtotal + shipping;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!selectedAddressId) {
      setError("Please select a shipping address.");
      return;
    }

    setSubmitting(true);

    try {
      const order = await createOrder({
        addressId: selectedAddressId,
        paymentMethod: payment,
      });

      if (payment === "STRIPE") {
        const checkoutUrl = await createCheckoutSession(order.id);

        window.location.assign(checkoutUrl);
        return;
      }

      await Promise.all(items.map((item) => removeItem(item.id)));

      navigate(`/checkout/success?orderId=${order.id}`, {
        replace: true,
      });
    } catch (err) {
      console.error("Checkout error:", err);

      setError(
        "Unable to place your order. Please check your details and try again.",
      );

      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-shell mx-auto px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <header className="border-line border-b pb-6">
        <h1 className="text-ink text-[30px] font-semibold tracking-tight sm:text-[36px]">
          Checkout
        </h1>

        <p className="text-ink-400 mt-2 flex items-center gap-2 text-[14px]">
          <LockIcon size={14} />
          Secure checkout · your details are never shared
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px] lg:gap-14"
      >
        <div className="space-y-10">
          <CustomerInfo user={user} />

          <ShippingAddress
            addresses={addresses}
            selectedAddressId={selectedAddressId}
            isLoading={isLoadingAddresses}
            onSelect={setSelectedAddressId}
          />

          <PaymentSection payment={payment} onChange={setPayment} />
        </div>

        <OrderSummary
          items={items}
          subtotal={subtotal}
          shipping={shipping}
          total={total}
          error={error}
          submitting={submitting}
          canSubmit={
            !isLoadingAddresses &&
            addresses.length > 0 &&
            Boolean(selectedAddress)
          }
        />
      </form>
    </div>
  );
}

export default Checkout;
