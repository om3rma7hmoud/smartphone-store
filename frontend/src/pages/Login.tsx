import { useState } from "react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { loginSchema, type LoginFormData } from "../utils/validators";
import { zodResolver } from "@hookform/resolvers/zod";

function Login() {
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });
  const [showPassword, setShowPassword] = useState(false);

  async function onSubmit(data: LoginFormData) {
    try {
      await login(data.email, data.password);
      navigate("/");
    } catch {
      toast.error("Email or password is incorrect");
    }
  }

  return (
    <div className="max-w-shell mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
      <div className="border-line mx-auto max-w-lg border">
        <div className="px-6 py-10 sm:px-10 sm:py-12">
          <h1 className="text-ink text-[30px] font-semibold tracking-tight">
            Sign in
          </h1>
          <p className="text-ink-400 mt-2 text-[15px]">
            Access your orders, saved devices and saved addresses
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
                    {...register("email")}
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

              <div className="space-y-1.5">
                <label
                  htmlFor="password"
                  className="text-ink-600 block text-[13px] font-medium"
                >
                  Password
                </label>
                <div className="group relative">
                  <Lock
                    size={18}
                    className="text-accent group-focus-within:text-accent-hover absolute top-1/2 left-4 -translate-y-1/2 transition-colors"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("password")}
                    id="password"
                    className="border-line text-ink ease-premium focus:border-ink w-full border px-3 py-3 pr-4 pl-11 text-[14px] transition-all duration-150 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="text-ink absolute top-1/2 right-4 -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors?.password && (
                  <p className="text-danger text-sm">
                    {errors.password?.message as string}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <Link
                  to="/forgot-password"
                  className="text-ink ease-premium hover:text-accent text-[13.5px] font-medium transition-colors duration-150"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-accent ease-premium hover:bg-accent-hover h-12 w-full text-[14px] font-medium text-white transition-colors duration-150"
              >
                {isSubmitting ? "Signing in..." : "Sign In"}
              </button>

              <p className="text-ink-400 pt-1 text-center text-[13.5px]">
                New to NOVA?{" "}
                <Link
                  to="/register"
                  className="text-ink font-medium underline-offset-4 hover:underline"
                >
                  Create Account
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
