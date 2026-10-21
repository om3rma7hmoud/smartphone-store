import { Link } from "react-router-dom";
import { ArrowLeft, SearchX } from "lucide-react";
const ProductNotFound = () => {
  return (
    <main className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="bg-surface-muted mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full">
          <SearchX className="text-ink-400 h-7 w-7" strokeWidth={1.8} />
        </div>
        <p className="text-accent mb-2 text-sm font-medium">
          Product not found
        </p>
        <h1 className="text-ink text-3xl font-semibold tracking-tight sm:text-4xl">
          We couldn't find this product
        </h1>
        <p className="text-ink-400 mx-auto mt-4 max-w-sm text-sm leading-6">
          The product you're looking for may have been removed, is no longer
          available, or the link may be incorrect.
        </p>
        <Link
          to="/shop"
          className="bg-accent hover:bg-accent-hover mt-8 inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium text-white transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4" /> Browse products
        </Link>
      </div>
    </main>
  );
};
export default ProductNotFound;
