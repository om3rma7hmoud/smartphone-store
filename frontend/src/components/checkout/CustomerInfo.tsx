import { Link } from "react-router-dom";
import type { User } from "../../types";

interface CustomerInfoProps {
  user: User | null;
}

function CustomerInfo({ user }: CustomerInfoProps) {
  return (
    <section aria-labelledby="customer-heading">
      <h2 id="customer-heading" className="text-ink text-[17px] font-semibold">
        Customer information
      </h2>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="text-ink-600 block text-[13px] font-medium">
            Full name
            <input
              value={user?.name ?? ""}
              readOnly
              className="text-ink border-line bg-surface-muted mt-1.5 h-11 w-full border px-3 text-[14px] outline-none"
            />
          </label>
        </div>

        <label className="text-ink-600 block text-[13px] font-medium">
          Email
          <input
            type="email"
            value={user?.email ?? ""}
            readOnly
            className="text-ink border-line bg-surface-muted mt-1.5 h-11 w-full border px-3 text-[14px] outline-none"
          />
        </label>

        <label className="text-ink-600 block text-[13px] font-medium">
          Phone
          <input
            value={user?.phone ?? "Not provided"}
            readOnly
            className="text-ink border-line bg-surface-muted mt-1.5 h-11 w-full border px-3 text-[14px] outline-none"
          />
        </label>
      </div>

      <Link
        to="/account/edit"
        className="text-ink-400 hover:text-ink mt-3 inline-block text-[13px] transition-colors"
      >
        Edit customer information
      </Link>
    </section>
  );
}

export default CustomerInfo;
