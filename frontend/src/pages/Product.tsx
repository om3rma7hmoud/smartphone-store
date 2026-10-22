import { Navigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import type { Product, ProductVariant } from "../types";
import { getProductBySlug } from "../api/products.api";

import PathStack from "../components/product/PathStack";
import Gallery from "../components/product/Gallery";
import ProductInfo from "../components/product/ProductInfo";
import ProductPricing from "../components/product/ProductPricing";
import VariantSelector from "../components/product/VariantSelector";
import ProductActions from "../components/product/ProductActions";
import DeliveryInfo from "../components/product/DeliveryInfo";
import Loading from "../components/ui/Loading";

import { cheapestVariant } from "../utils/format";
import { useCartStore } from "../store/cartStore";
import { useNavigate } from "react-router-dom";

function ProductPage() {
  const { slug } = useParams<{ slug: string }>();

  const [product, setProduct] = useState<Product | undefined>();
  const [selectedVariantId, setSelectedVariantId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);
  const navigate = useNavigate();

  useEffect(() => {
    if (!slug) {
      setIsLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        setProduct(undefined);
        setSelectedVariantId("");

        const fetchedProduct = await getProductBySlug(slug);

        setProduct(fetchedProduct);

        const initialVariant =
          fetchedProduct.variants.find(
            (variant: ProductVariant) => variant.stock > 0,
          ) ?? cheapestVariant(fetchedProduct);

        setSelectedVariantId(initialVariant.id);
      } catch (error) {
        console.error("Failed to fetch product:", error);
        setProduct(undefined);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  if (isLoading) return <Loading />;

  if (!product) {
    return <Navigate to="/product-not-found" replace />;
  }

  const variant: ProductVariant | undefined =
    product.variants.find((item) => item.id === selectedVariantId) ??
    product.variants.find((item) => item.stock > 0) ??
    product.variants[0];

  if (!variant) {
    return <Navigate to="/product-not-found" replace />;
  }

  const handleSelectVariant = (
    options: Partial<Pick<ProductVariant, "color" | "storage" | "ram">>,
  ) => {
    const updatedOptions = {
      color: options.color ?? variant.color,
      storage: options.storage ?? variant.storage,
      ram: options.ram ?? variant.ram,
    };

    const matchingVariant = product.variants.find(
      (item) =>
        item.color === updatedOptions.color &&
        item.storage === updatedOptions.storage &&
        item.ram === updatedOptions.ram,
    );

    if (matchingVariant) {
      setSelectedVariantId(matchingVariant.id);
      return;
    }

    const fallbackVariant = product.variants.find(
      (item) =>
        item.color === updatedOptions.color &&
        item.storage === updatedOptions.storage,
    );

    if (fallbackVariant) {
      setSelectedVariantId(fallbackVariant.id);
    }
  };

  const handleAddToCart = async () => {
    await addItem(variant.id, 1);
  };

  const handleBuyNow = async () => {
    await addItem(variant.id, 1);
    navigate("/checkout");
  };

  return (
    <main className="max-w-shell mx-auto px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <PathStack product={product} />

      <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_460px] lg:gap-14">
        <Gallery
          images={product.images.map((image) => image.url)}
          alt={`${product.brand.name} ${product.name} in ${variant.color}`}
        />

        <div className="min-w-0">
          <ProductInfo product={product} />

          <div className="mt-6">
            <ProductPricing variant={variant} />
          </div>

          <div className="mt-6">
            <VariantSelector
              product={product}
              variant={variant}
              onSelect={handleSelectVariant}
            />
          </div>

          <div className="mt-6">
            <ProductActions
              product={product}
              variant={variant}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
            />
          </div>

          <div className="mt-6">
            <DeliveryInfo />
          </div>
        </div>
      </div>
    </main>
  );
}

export default ProductPage;
