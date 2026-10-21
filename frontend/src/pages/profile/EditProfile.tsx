import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "react-toastify";

import { useAuthStore } from "../../store/authStore";

function EditProfile() {
  const { user, updateProfile } = useAuthStore();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone ?? "");
    }
  }, [user]);

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    try {
      setIsSubmitting(true);

      await updateProfile({
        name: name.trim(),
        phone: phone.trim() || null,
      });

      navigate("/account");
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        to="/account"
        className="text-ink-400 hover:text-ink mb-6 inline-flex items-center gap-2 text-[13px] transition-colors"
      >
        <ArrowLeft size={15} />
        Back to account
      </Link>

      <div className="border-line border">
        <div className="border-line border-b px-6 py-5">
          <h1 className="text-ink text-xl font-semibold">Edit profile</h1>
          <p className="text-ink-400 mt-1 text-[13px]">
            Update your personal information.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <div>
            <label
              htmlFor="name"
              className="text-ink mb-2 block text-[13px] font-medium"
            >
              Full name
            </label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isSubmitting}
              className="border-line text-ink focus:border-ink h-11 w-full border bg-transparent px-3 text-[13.5px] outline-none"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="text-ink mb-2 block text-[13px] font-medium"
            >
              Email address
            </label>

            <input
              id="email"
              type="email"
              value={user.email}
              disabled
              className="border-line text-ink-400 bg-surface-muted h-11 w-full cursor-not-allowed border px-3 text-[13.5px] outline-none"
            />

            <p className="text-ink-400 mt-1.5 text-[11.5px]">
              Email address cannot be changed here.
            </p>
          </div>

          <div>
            <label
              htmlFor="phone"
              className="text-ink mb-2 block text-[13px] font-medium"
            >
              Phone number
            </label>

            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={isSubmitting}
              className="border-line text-ink focus:border-ink h-11 w-full border bg-transparent px-3 text-[13.5px] outline-none"
              placeholder="Enter your phone number"
            />
          </div>

          <div className="border-line flex justify-end gap-3 border-t pt-5">
            <Link
              to="/account"
              className="border-line-strong text-ink hover:border-ink inline-flex h-10 items-center border px-5 text-[13px] font-medium transition-colors"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-ink inline-flex h-10 items-center gap-2 px-5 text-[13px] font-medium text-white transition-opacity hover:opacity-80 disabled:opacity-50"
            >
              <Save size={15} />
              {isSubmitting ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;
