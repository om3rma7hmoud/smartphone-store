import { Link } from "react-router-dom";
import type { Product } from "../../types";

const brands = ["Apple", "Samsung", "Google", "Xiaomi", "OnePlus"];

export function BrandStrip({ products }: { products: Product[] }) {
  return (
    <section className="max-w-shell mx-auto px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-ink text-[26px] font-semibold tracking-[-0.02em] sm:text-[30px]">
            Shop by Brand
          </h2>
          <p className="text-ink-400 mt-2 text-[15px]">
            Authorized stock, official warranty, nationwide delivery.
          </p>
        </div>
        <Link
          to="/shop"
          className="text-ink ease-premium hover:text-accent hidden shrink-0 text-[13.5px] font-medium transition-colors duration-150 sm:block"
        >
          View all products
        </Link>
      </div>

      <ul className="nova-scroll-x mt-8 flex gap-3 overflow-x-auto pb-1 sm:grid sm:grid-cols-3 sm:overflow-visible lg:grid-cols-5">
        {brands.map((brand) => {
          const count = products.filter((p) => p.brand.name === brand).length;
          return (
            <li key={brand} className="min-w-42 flex-1 sm:min-w-0">
              <Link
                to={`/shop?brand=${encodeURIComponent(brand)}`}
                className="group border-line ease-premium hover:border-ink hover:bg-surface-muted flex h-26 flex-col justify-between border bg-white p-4 transition-[border-color,background-color] duration-200"
              >
                <span className="text-ink text-[17px] font-semibold tracking-[-0.01em]">
                  {brand}
                </span>
                <span className="text-ink-400 text-[12.5px]">
                  {count} {count === 1 ? "product" : "products"}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
