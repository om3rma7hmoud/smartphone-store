export function DiscountBadge({ percent }: { percent: number }) {
  if (percent <= 0) return null;
  return (
    <span className="bg-ink inline-flex items-center rounded-sm px-1.5 py-0.5 text-[11px] leading-none font-semibold tracking-wide text-white">
      −{percent}%
    </span>
  );
}
