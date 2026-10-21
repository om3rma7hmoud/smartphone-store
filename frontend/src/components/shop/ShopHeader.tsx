function ShopHeader({ category }: { category: string }) {
  return (
    <header className="border-line border-b pb-6">
      <h2 className="text-ink text-[30px] font-semibold tracking-tight sm:text-[36px]">
        {category === "accessories"
          ? "Accessories"
          : category === "smartphones"
            ? "Smartphones"
            : "All products"}
      </h2>
      <p className="text-ink-400 mt-2 text-[15px]">
        Official stock with two-year warranty and next-day delivery in Greater
        Cairo.
      </p>
    </header>
  );
}

export default ShopHeader;
