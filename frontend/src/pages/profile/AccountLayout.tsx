import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  HeartIcon,
  LogOutIcon,
  MapPinIcon,
  PackageIcon,
  UserIcon,
} from "lucide-react";
import EmptyState from "../../components/ui/EmptyState";
import { useAuthStore } from "../../store/authStore";

const links = [
  { to: "/account", label: "Profile", icon: UserIcon, end: true },
  {
    to: "/account/addresses",
    label: "Addresses",
    icon: MapPinIcon,
    end: false,
  },
  { to: "/account/orders", label: "Orders", icon: PackageIcon, end: false },
  { to: "/wishlist", label: "Wishlist", icon: HeartIcon, end: false },
];

function AccountLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="max-w-shell mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <EmptyState
          icon={<UserIcon size={20} />}
          title="Sign in to view your account"
          description="Your profile, addresses and order history live behind a secure sign-in."
          primaryAction={{ label: "Sign in", to: "/login" }}
          secondaryAction={{ label: "Create account", to: "/register" }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-shell mx-auto px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <header className="border-line border-b pb-6">
        <h1 className="text-ink text-[30px] font-semibold tracking-tight sm:text-[36px]">
          My account
        </h1>
        <p className="text-ink-400 mt-2 text-[15px]">
          Signed in as {user.email}
        </p>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[232px_1fr] lg:gap-12">
        <nav aria-label="Account" className="lg:sticky lg:top-24 lg:h-fit">
          <ul className="nova-scroll-x border-line flex gap-1 overflow-x-auto border-b pb-2 lg:flex-col lg:border-b-0 lg:pb-0">
            {links.map(({ to, label, icon: Icon, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `ease-premium flex items-center gap-2.5 border px-3.5 py-2.5 text-[14px] font-medium whitespace-nowrap transition-colors duration-150 lg:w-full ${
                      isActive
                        ? "border-ink bg-ink text-white"
                        : "text-ink-600 hover:bg-surface-muted hover:text-ink border-transparent"
                    }`
                  }
                >
                  <Icon size={16} strokeWidth={1.7} />
                  {label}
                </NavLink>
              </li>
            ))}
            <li>
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="text-ink-600 ease-premium hover:bg-surface-muted hover:text-ink flex w-full items-center gap-2.5 border border-transparent px-3.5 py-2.5 text-[14px] font-medium whitespace-nowrap transition-colors duration-150"
              >
                <LogOutIcon size={16} strokeWidth={1.7} />
                Logout
              </button>
            </li>
          </ul>
        </nav>

        <div className="min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AccountLayout;
