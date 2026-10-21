import { HeartIcon } from "lucide-react";
import EmptyState from "../components/ui/EmptyState";
import WishlistHeader from "../components/wishlist/WishlistHeader";
import { useWishlistStore } from "../store/wishlistStore";
import { cheapestVariant } from "../utils/format";
import WishlistItem from "../components/wishlist/WishlistItem";
import { useEffect } from "react";

function Wishlist() {
  const { items, fetchWishlist } = useWishlistStore();

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  return (
    <div className="max-w-shell mx-auto px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <WishlistHeader itemsLength={items.length} />

      <div className="mt-8">
        {items.length === 0 ? (
          <EmptyState
            icon={<HeartIcon size={20} />}
            title="Your wishlist is empty"
            description="Tap the heart on any product to save it here while you decide."
            primaryAction={{
              label: "Browse smartphones",
              to: "/shop?category=smartphones",
            }}
            secondaryAction={{
              label: "See current deals",
              to: "/shop?deals=1",
            }}
          />
        ) : (
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <WishlistItem
                key={item.id}
                product={item.product}
                variant={cheapestVariant(item.product)}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Wishlist;
