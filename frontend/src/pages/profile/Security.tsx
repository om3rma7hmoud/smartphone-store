import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, LockKeyhole, ShieldCheck } from "lucide-react";
import { toast } from "react-toastify";
import { useAuthStore } from "../../store/authStore";

function Security() {
  const changePassword = useAuthStore((state) => state.changePassword);

  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!currentPassword || !password || !passwordConfirm) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (password.length < 8) {
      toast.error("New password must be at least 8 characters.");
      return;
    }

    if (password !== passwordConfirm) {
      toast.error("New passwords do not match.");
      return;
    }

    if (currentPassword === password) {
      toast.error("New password must be different from current password.");
      return;
    }

    try {
      setIsSubmitting(true);

      await changePassword({
        currentPassword,
        password,
        passwordConfirm,
      });

      setCurrentPassword("");
      setPassword("");
      setPasswordConfirm("");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to change password.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-black focus:bg-white";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          to="/account"
          className="mb-4 inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-black"
        >
          <ArrowLeft size={16} />
          Back to account
        </Link>

        <h1 className="text-2xl font-bold text-gray-900">Account Security</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your password and keep your account secure.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
        <div className="mb-6 flex items-center gap-4 border-b border-gray-100 pb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
            <ShieldCheck size={24} className="text-gray-800" />
          </div>

          <div>
            <h2 className="font-semibold text-gray-900">Change Password</h2>
            <p className="mt-1 text-sm text-gray-500">
              Update your password regularly to protect your account.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="currentPassword"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Current Password
            </label>

            <div className="relative">
              <LockKeyhole
                size={18}
                className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400"
              />

              <input
                id="currentPassword"
                type={showPasswords ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                autoComplete="current-password"
                className={`${inputClass} pr-12 pl-11`}
              />

              <button
                type="button"
                onClick={() => setShowPasswords((prev) => !prev)}
                className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                aria-label={showPasswords ? "Hide passwords" : "Show passwords"}
              >
                {showPasswords ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              New Password
            </label>

            <input
              id="password"
              type={showPasswords ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              autoComplete="new-password"
              className={inputClass}
            />

            <p className="mt-2 text-xs text-gray-400">
              Password must be at least 8 characters.
            </p>
          </div>

          <div>
            <label
              htmlFor="passwordConfirm"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Confirm New Password
            </label>

            <input
              id="passwordConfirm"
              type={showPasswords ? "text" : "password"}
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              placeholder="Confirm new password"
              autoComplete="new-password"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">
            <Link
              to="/account"
              className="rounded-xl border border-gray-200 px-6 py-3 text-center text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Security;
