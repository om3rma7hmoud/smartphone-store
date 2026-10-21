import { TruckIcon } from "lucide-react";

function DeliveryInfo() {
  return (
    <div className="text-ink-600 mt-6 flex items-start gap-3 border border-line bg-surface-muted p-4">
      <TruckIcon
        size={17}
        className="text-ink mt-0.5 shrink-0"
        strokeWidth={1.6}
      />

      <p className="text-[13.5px] leading-relaxed">
        Free next-day delivery in Cairo &amp; Giza on orders above EGP
        20,000. Cash on delivery available nationwide.
      </p>
    </div>
  );
}

export default DeliveryInfo;
