import { AnimatePresence, motion } from "framer-motion";
import { XIcon } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "../ui/Logo";
import type { User } from "../../types";
import { useWishlistStore } from "../../store/wishlistStore";
import { useCartStore } from "../../store/cartStore";

type LinkProp = {
  label: string;
  to: string;
};

type SidebarProps = {
  menuOpen: boolean;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  navLinks: LinkProp[];
  user: User | null;
};

function Sidebar({ menuOpen, setMenuOpen, navLinks, user }: SidebarProps) {
  const { items: wishlistItems } = useWishlistStore();
  const { items: cartItems } = useCartStore();
  return (
    <AnimatePresence>
      {menuOpen && (
        <motion.div
          className="fixed inset-0 z-60 lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
        >
          <div
            className="bg-ink/40 absolute inset-0"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
            className="relative flex h-full w-[86vw] max-w-xs flex-col bg-white"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
          >
            <div className="border-line flex h-14 items-center justify-between border-b px-4">
              <Logo />
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="text-ink p-1"
                aria-label="Close menu"
              >
                <XIcon size={19} />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-2" aria-label="Mobile">
              {navLinks.map((link: LinkProp) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="text-ink ease-premium hover:bg-surface-muted block px-3 py-3 text-[16px] font-medium transition-colors duration-150"
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-line my-2 border-t" />
              <Link
                to="/wishlist"
                className="text-ink flex items-center justify-between px-3 py-3 text-[16px] font-medium"
              >
                Wishlist{" "}
                <span className="text-ink-400 text-[13px]">
                  {wishlistItems.length}
                </span>
              </Link>
              <Link
                to="/cart"
                className="text-ink flex items-center justify-between px-3 py-3 text-[16px] font-medium"
              >
                Cart{" "}
                <span className="text-ink-400 text-[13px]">
                  {cartItems.length ? cartItems.length : ""}
                </span>
              </Link>
              <Link
                to={user ? "/account" : "/login"}
                className="text-ink block px-3 py-3 text-[16px] font-medium"
              >
                {user ? "Account" : "Sign in"}
              </Link>
            </nav>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Sidebar;
