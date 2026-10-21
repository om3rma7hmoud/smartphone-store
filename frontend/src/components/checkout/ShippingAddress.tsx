import { Link } from "react-router-dom";
import { MapPinIcon, PlusIcon } from "lucide-react";
import type { Address } from "../../types";

interface ShippingAddressProps {
  addresses: Address[];
  selectedAddressId: string;
  isLoading: boolean;
  onSelect: (addressId: string) => void;
}

function ShippingAddress({
  addresses,
  selectedAddressId,
  isLoading,
  onSelect,
}: ShippingAddressProps) {
  return (
    <section aria-labelledby="shipping-heading">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2
          id="shipping-heading"
          className="text-ink text-[17px] font-semibold"
        >
          Shipping address
        </h2>

        <Link
          to="/account/addresses"
          className="text-ink hover:text-ink-600 inline-flex items-center gap-1 text-[13px] font-medium"
        >
          <PlusIcon size={15} />
          Add address
        </Link>
      </div>

      {isLoading ? (
        <p className="text-ink-400 mt-4 text-[14px]">Loading addresses...</p>
      ) : addresses.length === 0 ? (
        <div className="border-line mt-4 border p-6 text-center">
          <MapPinIcon size={25} className="text-ink-400 mx-auto" />

          <p className="text-ink mt-3 text-[14px] font-medium">
            No saved addresses
          </p>

          <p className="text-ink-400 mt-1 text-[13px]">
            Add a shipping address before placing your order.
          </p>

          <Link
            to="/account/addresses"
            className="bg-ink hover:bg-ink-800 mt-4 inline-flex h-10 items-center px-5 text-[13px] font-medium text-white"
          >
            Add address
          </Link>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {addresses.map((address) => {
            const active = selectedAddressId === address.id;

            return (
              <button
                key={address.id}
                type="button"
                onClick={() => onSelect(address.id)}
                aria-pressed={active}
                className={`w-full border p-5 text-left transition-colors ${
                  active
                    ? "border-ink bg-surface-muted"
                    : "border-line hover:border-line-strong"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-ink text-[14px] font-semibold">
                      {address.fullName}

                      {address.isDefault && (
                        <span className="text-ink-400 ml-2 text-[11px] font-normal">
                          Default
                        </span>
                      )}
                    </p>

                    <p className="text-ink-600 mt-2 text-[13px]">
                      {address.phone}
                    </p>

                    <p className="text-ink-400 mt-1 text-[13px] leading-relaxed">
                      {address.street}, {address.area}, {address.city}
                    </p>
                  </div>

                  <span
                    className={`mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                      active ? "border-ink" : "border-line-strong"
                    }`}
                  >
                    {active && <span className="bg-ink h-2 w-2 rounded-full" />}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default ShippingAddress;
