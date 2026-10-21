import Hero from "../components/home/Hero";
import Assurances from "../components/home/Assurances";
import { BrandStrip } from "../components/home/BrandStrip";
import FeaturedCollections from "../components/home/FeaturedCollections";
import PromoProduct from "../components/home/PromoProduct";
import { useProducts } from "../hooks/useProducts";

function Home() {
  const { products } = useProducts();

  return (
    <div>
      <Hero />
      <Assurances />
      <BrandStrip products={products} />
      <FeaturedCollections products={products} />
      <PromoProduct />
    </div>
  );
}

export default Home;
