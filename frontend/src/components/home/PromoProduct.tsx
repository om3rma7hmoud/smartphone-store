import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Product } from "../../types";
import { formatEGP } from "../../utils/format";
import { getProductBySlug } from "../../api/products.api";

function PromoProduct() {
  const [promoProduct, setPromoProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchPromoProduct = async () => {
      try {
        const product = await getProductBySlug("xiaomi-16-pro");
        setPromoProduct(product);
      } catch (error) {
        console.error("Failed to fetch promo product:", error);
      }
    };

    fetchPromoProduct();
  }, []);

  return (
    <section className="max-w-shell mx-auto px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <div className="border-line grid items-center gap-8 border bg-white lg:grid-cols-[1fr_0.85fr]">
        <div className="px-6 py-10 sm:px-12 sm:py-14">
          <p className="text-ink-400 text-[11px] font-semibold tracking-[0.16em] uppercase">
            Editor's pick
          </p>
          <h2 className="text-ink mt-4 max-w-md text-[30px] leading-[1.1] font-semibold tracking-tight sm:text-[38px]">
            Premium phones under EGP 30,000
          </h2>
          <p className="text-ink-400 mt-4 max-w-md text-[15.5px] leading-relaxed">
            Get flagship-level experiences without the flagship price.
            Hand-picked devices with 120Hz displays, all-day batteries and
            multi-year update commitments.
          </p>
          <Link
            to="/shop?max=30000&category=smartphones"
            className="bg-ink ease-premium hover:bg-ink-800 mt-8 inline-flex h-12 items-center px-7 text-[14px] font-medium text-white transition-colors duration-150"
          >
            Explore Collection
          </Link>
        </div>
        <div className="bg-surface-muted relative h-full">
          {promoProduct && (
            <>
              <img
                src={promoProduct.images[0].url}
                alt={`${promoProduct.brand} ${promoProduct.name}`}
                className="h-full w-full object-cover"
              />
              <div className="border-line absolute bottom-5 left-5 border bg-white px-4 py-3">
                <p className="text-ink-400 text-[12.5px]">
                  {promoProduct.brand.name}
                </p>
                <p className="text-ink text-[14.5px] font-medium">
                  {promoProduct.name}
                </p>
                <p className="text-ink mt-1 text-[14.5px] font-semibold">
                  from {formatEGP(promoProduct.minPrice)}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default PromoProduct;
