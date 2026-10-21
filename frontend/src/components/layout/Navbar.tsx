import {
  GitCompareIcon,
  HeartIcon,
  LogOut,
  MenuIcon,
  ShoppingBagIcon,
  UserIcon,
} from "lucide-react";
import { useState } from "react";
import Logo from "../ui/Logo";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAuthStore } from "../../store/authStore";
import { SearchOverlay } from "../ui/SearchOverlay";
import { useCartStore } from "../../store/cartStore";
import { useCompareStore } from "../../store/compareStore";
import { useWishlistStore } from "../../store/wishlistStore";

const navLinks = [
  { label: "Shop", to: "/shop" },
  { label: "Smartphone", to: "/shop?category=smartphone" },
  { label: "Accessories", to: "/shop?category=accessories" },
  { label: "Deals", to: "/shop?deals=1" },
  { label: "Compare", to: "/compare" },
];

function Counter({ value }: { value: number }) {
  if (value <= 0) return null;
  return (
    <span className="bg-ink absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] leading-none font-semibold text-white">
      {value}
    </span>
  );
}

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const { productIds } = useCompareStore();
  const { items: cartItems } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const navigate = useNavigate();

  return (
    <>
      <header className="border-line sticky top-0 z-50 border-b bg-white/85 backdrop-blur-md">
        <div className="max-w-shell mx-auto flex h-14 items-center gap-4 px-4 sm:px-6 lg:h-16 lg:px-8">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="text-ink ml-1 p-1 lg:hidden"
            aria-label="Open menu"
          >
            <MenuIcon />
          </button>
          <div className="flex-1 lg:flex-none">
            <Logo />
          </div>

          <nav className="hidden flex-1 items-center justify-center gap-7 lg:flex">
            {navLinks.map((link) => (
              <NavLink
                to={link.to}
                key={link.label}
                className={({ isActive }) =>
                  `ease-premium text-[13.5px] font-medium transition-colors duration-150 ${
                    isActive && location.pathname + location.search === link.to
                      ? "text-ink"
                      : "text-ink-600 hover:text-ink"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <Link
              to="/compare"
              className="text-ink ease-premium hover:text-accent relative hidden p-2 transition-colors duration-150 lg:block"
            >
              <GitCompareIcon size={18} />
              <Counter value={productIds.length} />
            </Link>

            <Link
              to="/wishlist"
              className="text-ink ease-premium hover:text-accent relative hidden p-2 transition-colors duration-150 sm:block"
            >
              <HeartIcon size={18} />
              <Counter value={wishlistItems.length} />
            </Link>

            <Link
              to="/cart"
              className="text-ink ease-premium hover:text-accent relative p-2 transition-colors duration-150"
            >
              <ShoppingBagIcon size={18} />
              <Counter value={cartItems.length} />
            </Link>

            <Link
              to={user ? "/account" : "/login"}
              className="text-ink ease-premium hover:text-accent hidden p-2 transition-colors duration-150 lg:block"
              aria-label={user ? "Your account" : "Sign in"}
            >
              <UserIcon size={18} />
            </Link>
            {user && (
              <button
                className="text-ink ease-premium hover:text-accent hidden p-2 transition-colors duration-150 lg:block"
                aria-label={user ? "Your account" : "Sign in"}
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
              >
                <LogOut size={18} />
              </button>
            )}
          </div>
        </div>
      </header>
      <Sidebar
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        navLinks={navLinks}
        user={user}
      />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

export default Navbar;
