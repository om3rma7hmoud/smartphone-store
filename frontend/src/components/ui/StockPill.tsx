function StockPill({ stock }: { stock: number }) {
  if (stock === 0) {
    return (
      <span className="text-ink-400 inline-flex items-center gap-1.5 text-[13px] font-medium">
        <span
          className="bg-ink-300 h-1.5 w-1.5 rounded-full"
          aria-hidden="true"
        />
        Out of stock
      </span>
    );
  }
  if (stock <= 5) {
    return (
      <span className="text-warning inline-flex items-center gap-1.5 text-[13px] font-medium">
        <span
          className="bg-warning h-1.5 w-1.5 rounded-full"
          aria-hidden="true"
        />
        Only {stock} left
      </span>
    );
  }
  return (
    <span className="text-positive inline-flex items-center gap-1.5 text-[13px] font-medium">
      <span
        className="bg-positive h-1.5 w-1.5 rounded-full"
        aria-hidden="true"
      />
      In stock
    </span>
  );
}

export default StockPill;
