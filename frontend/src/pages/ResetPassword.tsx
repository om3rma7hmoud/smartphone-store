import { useState } from "react";
import { Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthStore } from "../store/authStore";
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "../utils/validators";

function ResetPassword() {
  const { resetPassword } = useAuthStore();
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  async function onSubmit(data: ResetPasswordFormData) {
    if (!token) {
      toast.error("Invalid or missing reset link.");
      return;
    }

    try {
      await resetPassword(token, data.password, data.passwordConfirm);

      toast.success("Password reset successfully.");
      navigate("/login", { replace: true });
    } catch {
      toast.error(
        "Reset link is invalid or expired. Please request a new one.",
      );
    }
  }

  return (
    <div className="max-w-shell mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
      <div className="border-line mx-auto max-w-md border">
        <div className="px-6 py-10 sm:px-10 sm:py-12">
          <div className="bg-surface-muted mb-5 flex size-12 items-center justify-center">
            <CheckCircle className="text-accent" size={23} />
          </div>

          <h1 className="text-ink text-[30px] font-semibold tracking-tight">
            Reset your password
          </h1>

          <p className="text-ink-400 mt-2 text-[15px]">
            Choose a new password for your NOVA account.
          </p>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="text-ink-600 block text-[13px] font-medium"
              >
                New password
              </label>

              <div className="group relative">
                <Lock
                  size={18}
                  className="text-accent group-focus-within:text-accent-hover absolute top-1/2 left-4 -translate-y-1/2 transition-colors"
                />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  aria-invalid={!!errors.password}
                  aria-describedby={
                    errors.password ? "password-error" : undefined
                  }
                  {...register("password")}
                  className="border-line text-ink focus:border-ink w-full border py-3 pr-12 pl-11 text-sm transition-colors outline-none"
                />

                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-ink-400 hover:text-ink focus-visible:outline-ink absolute top-1/2 right-4 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>

              {errors.password?.message && (
                <p id="password-error" className="text-danger text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="passwordConfirm"
                className="text-ink-600 block text-[13px] font-medium"
              >
                Confirm new password
              </label>

              <div className="group relative">
                <Lock
                  size={18}
                  className="text-accent group-focus-within:text-accent-hover absolute top-1/2 left-4 -translate-y-1/2 transition-colors"
                />

                <input
                  id="passwordConfirm"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Re-enter your new password"
                  aria-invalid={!!errors.passwordConfirm}
                  aria-describedby={
                    errors.passwordConfirm
                      ? "password-confirm-error"
                      : undefined
                  }
                  {...register("passwordConfirm")}
                  className="border-line text-ink focus:border-ink w-full border py-3 pr-12 pl-11 text-sm transition-colors outline-none"
                />

                <button
                  type="button"
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="text-ink-400 hover:text-ink focus-visible:outline-ink absolute top-1/2 right-4 -translate-y-1/2"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>
              </div>

              {errors.passwordConfirm?.message && (
                <p id="password-confirm-error" className="text-danger text-sm">
                  {errors.passwordConfirm.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !token}
              className="bg-accent hover:bg-accent-hover h-12 w-full text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Resetting password..." : "Reset Password"}
            </button>

            <p className="text-ink-400 pt-1 text-center text-[13.5px]">
              Remembered your password?{" "}
              <Link
                to="/login"
                className="text-ink font-medium underline-offset-4 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
