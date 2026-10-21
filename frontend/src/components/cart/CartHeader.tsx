function CartHeader({ itemsLength }: { itemsLength: number }) {
  return (
    <header className="border-line border-b pb-6">
      <h1 className="text-ink text-[30px] font-semibold tracking-tight sm:text-[36px]">
        Cart
      </h1>
      <p className="text-ink-400 mt-2 text-[15px]">
        {itemsLength} {itemsLength === 1 ? "item" : "items"} · delivery in 24–48
        hours
      </p>
    </header>
  );
}

export default CartHeader;
