import { Lock, Mail, Phone, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthStore } from "../store/authStore";
import { signupSchema, type SignupFormData } from "../utils/validators";
import { zodResolver } from "@hookform/resolvers/zod";

function Register() {
  const { signup } = useAuthStore();
  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({ resolver: zodResolver(signupSchema) });

  async function onSubmit(data: SignupFormData) {
    try {
      await signup(data);
      navigate("/");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  }

  return (
    <div className="max-w-shell mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
      <div className="border-line mx-auto max-w-lg border">
        <div className="px-6 py-10 sm:px-10 sm:py-12">
          <h1 className="text-ink text-[30px] font-semibold tracking-tight">
            Create account
          </h1>
          <p className="text-ink-400 mt-2 text-[15px]">
            Faster checkout, order tracking and a wishlist that follows you.
          </p>
          <div className="mt-8 max-w-sm">
            <form className="space-y-3.5" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-1">
                <label
                  htmlFor="name"
                  className="text-ink-600 block text-[13px] font-medium"
                >
                  Full name
                </label>
                <div className="group relative">
                  <User
                    size={18}
                    className="text-accent group-focus-within:text-accent-hover absolute top-1/2 left-4 -translate-y-1/2 transition-colors"
                  />
                  <input
                    type="text"
                    placeholder="Omar Mahmoud"
                    {...register("name", { required: true })}
                    id="name"
                    className="border-line text-ink focus:border-ink focus:ring-ink/10 w-full border px-3 py-3 pr-4 pl-11 text-sm transition-colors duration-150 outline-none focus:ring-1"
                  />
                </div>
                {errors?.name && (
                  <p className="text-danger text-sm">
                    {errors.name.message as string}
                  </p>
                )}
              </div>
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
                    className="border-line text-ink focus:border-ink focus:ring-ink/10 w-full border px-3 py-3 pr-4 pl-11 text-sm transition-colors duration-150 outline-none focus:ring-1"
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
                  htmlFor="phone"
                  className="text-ink-600 block text-[13px] font-medium"
                >
                  Phone
                </label>
                <div className="group relative">
                  <Phone
                    size={18}
                    className="text-accent group-focus-within:text-accent-hover absolute top-1/2 left-4 -translate-y-1/2 transition-colors"
                  />
                  <input
                    type="tel"
                    placeholder="+201028709811"
                    {...register("phone", { required: true })}
                    id="phone"
                    className="border-line text-ink focus:border-ink focus:ring-ink/10 w-full border px-3 py-3 pr-4 pl-11 text-sm transition-colors duration-150 outline-none focus:ring-1"
                  />
                </div>
                {errors?.phone && (
                  <p className="text-danger text-sm">
                    {errors.phone.message as string}
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
                    type="password"
                    placeholder="••••••••"
                    {...register("password", { required: true })}
                    id="password"
                    className="border-line text-ink focus:border-ink focus:ring-ink/10 w-full border px-3 py-3 pr-4 pl-11 text-sm transition-colors duration-150 outline-none focus:ring-1"
                  />
                </div>
                {errors?.password && (
                  <p className="text-danger text-sm">
                    {errors.password?.message as string}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <label
                  htmlFor="passwordConfirm"
                  className="text-ink-600 block text-[13px] font-medium"
                >
                  Confirm password
                </label>
                <div className="group relative">
                  <Lock
                    size={18}
                    className="text-accent group-focus-within:text-accent-hover absolute top-1/2 left-4 -translate-y-1/2 transition-colors"
                  />
                  <input
                    type="password"
                    placeholder="••••••••"
                    {...register("passwordConfirm", { required: true })}
                    id="passwordConfirm"
                    className="border-line text-ink focus:border-ink focus:ring-ink/10 w-full border px-3 py-3 pr-4 pl-11 text-sm transition-colors duration-150 outline-none focus:ring-1"
                  />
                </div>
                {errors?.passwordConfirm && (
                  <p className="text-danger text-sm">
                    {errors.passwordConfirm?.message as string}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-accent hover:bg-accent-hover h-12 w-full text-sm font-medium text-white transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Creating..." : "Create Account"}
              </button>

              <p className="text-ink-400 pt-1 text-center text-[13.5px]">
                Already have an account?{" "}
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

export default Register;
