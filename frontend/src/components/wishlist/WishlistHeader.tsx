function WishlistHeader({ itemsLength }: { itemsLength: number }) {
  return (
    <header className="border-line border-b pb-6">
      <h1 className="text-ink text-[30px] font-semibold tracking-tight sm:text-[36px]">
        Wishlist
      </h1>
      <p className="text-ink-400 mt-2 text-[15px]">
        {itemsLength === 0
          ? "Save products you are considering and come back to them anytime."
          : `${itemsLength} saved ${itemsLength === 1 ? "product" : "products"}.`}
      </p>
    </header>
  );
}

export default WishlistHeader;
