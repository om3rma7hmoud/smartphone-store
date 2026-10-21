import { ChevronRightIcon } from "lucide-react";
import { Link } from "react-router-dom";
import type { Product } from "../../types";

function PathStack({ product }: { product: Product | undefined }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="text-ink-400 flex items-center gap-1.5 text-[13px]"
    >
      <Link
        to="/"
        className="ease-premium hover:text-ink transition-colors duration-150"
      >
        Home
      </Link>
      <ChevronRightIcon size={13} />
      <Link
        to="/shop"
        className="ease-premium hover:text-ink transition-colors duration-150"
      >
        Shop
      </Link>
      <ChevronRightIcon size={13} />
      <Link
        to={`/shop?brand=${product?.brand.name}`}
        className="ease-premium hover:text-ink transition-colors duration-150"
      >
        {product?.brand.name}
      </Link>
      <ChevronRightIcon size={13} />
      <span className="text-ink truncate">{product?.name}</span>
    </nav>
  );
}

export default PathStack;
