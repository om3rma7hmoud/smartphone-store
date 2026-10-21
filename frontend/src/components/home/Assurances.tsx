import {
  CreditCardIcon,
  RotateCcwIcon,
  ShieldCheckIcon,
  TruckIcon,
} from "lucide-react";

const assurances = [
  {
    icon: TruckIcon,
    title: "Free delivery over EGP 20,000",
    text: "Cairo & Giza within 24 hours.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Official warranty",
    text: "Two years on every smartphone.",
  },
  {
    icon: RotateCcwIcon,
    title: "14-day returns",
    text: "Unopened or faulty, no questions.",
  },
  {
    icon: CreditCardIcon,
    title: "Pay your way",
    text: "Cash on delivery or secure card.",
  },
];

function Assurances() {
  return (
    <section className="border-line border-b bg-white">
      <div className="max-w-shell mx-auto grid grid-cols-2 gap-x-6 gap-y-6 px-4 py-8 sm:px-6 lg:grid-cols-4 lg:px-8">
        {assurances.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex items-start gap-3">
            <Icon
              size={18}
              className="text-ink mt-0.5 shrink-0"
              strokeWidth={1.6}
            />
            <div>
              <p className="text-ink text-[13.5px] leading-tight font-medium">
                {title}
              </p>
              <p className="text-ink-400 mt-1 text-[12.5px] leading-tight">
                {text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Assurances;
