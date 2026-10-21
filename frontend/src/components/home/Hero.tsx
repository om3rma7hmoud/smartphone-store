import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRightIcon } from "lucide-react";
import { formatEGP } from "../../utils/format";
import { StarRating } from "../ui/StartRating";
import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import type { Product } from "../../types";

function Hero() {
  const [featuredProduct, setFeaturedProduct] = useState<Product | null>(null);

  useEffect(() => {
    axiosClient.get("/products/iphone-17-pro").then((res) => {
      setFeaturedProduct(res.data.data);
    });
  }, []);

  if (!featuredProduct) return null;

  const discountedPrice = featuredProduct.minPrice * 0.93;

  return (
    <section className="bg-ink relative overflow-hidden text-white">
      <div
        className="pointer-events-none absolute top-1/2 -right-40 h-155 w-155 -translate-y-1/2 rounded-full opacity-70"
        style={{
          background:
            "radial-gradient(closest-side, rgba(11,99,229,0.30), rgba(11,99,229,0))",
        }}
        aria-hidden="true"
      />
      <div className="max-w-shell relative mx-auto grid items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6 lg:px-8 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
        >
          <p className="text-ink-300 mb-4 text-xs tracking-wide uppercase">
            New · Apple Flagship
          </p>
          <h1 className="mb-6 text-6xl leading-tight font-bold">
            Power.
            <br />
            Refined.
          </h1>
          <p className="text-ink-300 mb-8">
            Discover the latest smartphones engineered for performance,
            photography, and everyday life.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
            <div className="flex items-baseline gap-3">
              <span className="text-[28px] font-semibold tracking-[-0.02em]">
                {formatEGP(Math.round(discountedPrice))}
              </span>
              <span className="text-[15px] text-white/40 line-through">
                {formatEGP(featuredProduct.minPrice)}
              </span>
            </div>
            <span className="text-ink inline-flex items-center rounded-sm bg-white px-2 py-1 text-[11px] leading-none font-semibold tracking-wide">
              SAVE {7}%
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-white/60">
            <span className="inline-flex items-center gap-2">
              <StarRating rating={featuredProduct.rating} tone="white" />
              {featuredProduct.rating} · {featuredProduct.reviewCount} reviews
            </span>
            <span className="inline-flex items-center gap-2">
              <span
                className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#5BD08A]"
                aria-hidden="true"
              />
              In stock · ships in 24h
            </span>
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              to="/shop?category=smartphones"
              className="text-ink ease-premium inline-flex h-12 items-center gap-2 bg-white px-7 text-[14px] font-medium transition-colors duration-150 hover:bg-white/90"
            >
              Shop Smartphones
              <ArrowRightIcon size={16} />
            </Link>
            <Link
              to="/shop?deals=1"
              className="ease-premium inline-flex h-12 items-center border border-white/25 px-7 text-[14px] font-medium text-white transition-colors duration-150 hover:border-white/60"
            >
              Explore Deals
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.06, ease: [0.23, 1, 0.32, 1] }}
          className="relative mx-auto w-full max-w-md lg:max-w-none"
        >
          <Link to={`product/${featuredProduct.slug}`}>
            <img
              src="https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800"
              // src={featuredProduct.images[0].url}
              alt="iPhone 17 Pro in Titanium Black"
              className="mx-auto w-full max-w-105 object-contain"
            />
            <div className="absolute -bottom-4 left-0 hidden border border-white/15 bg-white/6 px-4 py-3 backdrop-blur-sm sm:block">
              <p className="text-[11px] tracking-[0.12em] text-white/45 uppercase">
                Featured
              </p>
              <p className="mt-1 text-[15px] font-medium">
                {featuredProduct.name} · Titanium
              </p>
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;
