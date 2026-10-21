import { Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthStore } from "../store/authStore";

function ForgotPassword() {
  const { forgotPassword } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<{ email: string }>();

  const onSubmit = async (data: { email: string }) => {
    try {
      await forgotPassword(data.email);
      toast.success("If an account exists, you'll receive reset instructions.");
    } catch {
      toast.error("Unable to send reset instructions. Please try again.");
    }
  };

  return (
    <div className="max-w-shell mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
      <div className="border-line mx-auto max-w-lg border">
        <div className="px-6 py-10 sm:px-10 sm:py-12">
          <h1 className="text-ink text-[30px] font-semibold tracking-tight">
            Forgot your password?
          </h1>

          <p className="text-ink-400 mt-2 text-[15px]">
            Enter your email address and we'll send you instructions to reset
            your password.
          </p>
          <div className="mt-8 max-w-sm">
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="text-ink-600 block text-[13px] font-medium"
                >
                  Email
                </label>
                <div className="group relative">
                  <Mail
                    size={18}
                    className="text-accent group-focus-within:text-accent-hover absolute top-1/2 left-4 -translate-y-1/2 transition-colors"
                  />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    {...register("email", { required: true })}
                    id="email"
                    className="border-line text-ink ease-premium focus:border-ink w-full border px-3 py-3 pr-4 pl-11 text-[14px] transition-all duration-150 outline-none"
                  />
                </div>
                {errors?.email && (
                  <p className="text-danger text-sm">
                    {errors.email.message as string}
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-accent ease-premium hover:bg-accent-hover h-12 w-full text-[14px] font-medium text-white transition-colors duration-150"
              >
                {isSubmitting ? "Sending..." : "Send Reset Link"}
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
    </div>
  );
}

export default ForgotPassword;
