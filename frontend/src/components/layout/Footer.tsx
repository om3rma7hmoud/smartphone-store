import { Link } from "react-router-dom";
import Logo from "../ui/Logo";

const columns = [
  {
    title: "Shop",
    links: [
      { label: "Smartphones", to: "/shop?category=smartphones" },
      { label: "Accessories", to: "/shop?category=accessories" },
      { label: "Deals", to: "/shop?deals=1" },
      { label: "Compare", to: "/compare" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Sign in", to: "/login" },
      { label: "Create account", to: "/register" },
      { label: "Orders", to: "/account/orders" },
      { label: "Wishlist", to: "/wishlist" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Shipping & delivery", to: "/shop" },
      { label: "Returns within 14 days", to: "/shop" },
      { label: "Warranty", to: "/shop" },
      { label: "Contact", to: "/shop" },
    ],
  },
];

function Footer() {
  return (
    <footer className="border-line mt-24 border-t bg-white">
      <div className="max-w-shell mx-auto px-4 pt-14 pb-7 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Logo />
            <p className="text-ink-400 mt-4 max-w-xs text-[14px] leading-relaxed">
              Technology, refined. Authorized smartphones and accessories with
              nationwide delivery across Egypt and a 14-day return window.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-ink text-[11px] font-semibold tracking-widest uppercase">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-ink-400 ease-premium hover:text-ink text-[14px] transition-colors duration-150"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-line mt-12 flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-ink-400 text-[13px]">
            © 2026 NOVA Egypt. All rights reserved.
          </p>
          {/* <p className="text-[13px] text-ink-400">
            Cash on Delivery · Visa · Mastercard · Secured by Stripe
          </p> */}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
