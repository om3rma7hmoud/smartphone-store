import { BanknoteIcon, CreditCardIcon } from "lucide-react";

import type { PaymentMethod } from "../../types";

interface PaymentSectionProps {
  payment: PaymentMethod;
  onChange: (payment: PaymentMethod) => void;
}

const paymentOptions = [
  {
    value: "CASH_ON_DELIVERY" as PaymentMethod,
    icon: BanknoteIcon,
    title: "Cash on Delivery",
    text: "Pay the courier when your order arrives.",
  },
  {
    value: "STRIPE" as PaymentMethod,
    icon: CreditCardIcon,
    title: "Card — Stripe",
    text: "Pay securely using your bank card.",
  },
];

function PaymentSection({ payment, onChange }: PaymentSectionProps) {
  return (
    <section aria-labelledby="payment-heading">
      <h2 id="payment-heading" className="text-ink text-[17px] font-semibold">
        Payment
      </h2>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {paymentOptions.map((option) => {
          const active = payment === option.value;
          const Icon = option.icon;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              aria-pressed={active}
              className={`flex h-full flex-col items-start border p-5 text-left transition-colors ${
                active
                  ? "border-ink bg-surface-muted"
                  : "border-line hover:border-line-strong"
              }`}
            >
              <span className="flex w-full items-center justify-between">
                <Icon size={19} strokeWidth={1.6} className="text-ink" />

                <span
                  className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                    active ? "border-ink" : "border-line-strong"
                  }`}
                >
                  {active && <span className="bg-ink h-2 w-2 rounded-full" />}
                </span>
              </span>

              <span className="text-ink mt-4 text-[15px] font-semibold">
                {option.title}
              </span>

              <span className="text-ink-400 mt-1.5 text-[13px] leading-relaxed">
                {option.text}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default PaymentSection;
