"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";
import { AuthResponse } from "@/lib/types";
import { PulseTrace } from "@/components/pulse-trace";

const registerSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setServerError(null);
    setIsSubmitting(true);
    try {
      const { data } = await apiClient.post<AuthResponse>("/auth/register", values);
      await login(data.accessToken, data.refreshToken);
      router.push("/profile");
    } catch (err: any) {
      setServerError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F5F8F8] px-4 py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(#DCE8E7 1px, transparent 1px), linear-gradient(90deg, #DCE8E7 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(circle at 50% 35%, black, transparent 70%)",
          WebkitMaskImage: "radial-gradient(circle at 50% 35%, black, transparent 70%)",
        }}
      />

      <div className="relative w-full max-w-[400px]">
        <div className="rounded-2xl border border-[#DCE8E7] bg-white px-8 pb-8 pt-9 shadow-[0_1px_2px_rgba(20,38,42,0.04),0_12px_32px_-16px_rgba(20,38,42,0.12)]">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#5C7377]">
            Clinic access
          </p>
          <h1
            className="mt-2 text-[28px] leading-tight text-[#14262A]"
            style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
          >
            Create an account
          </h1>
          <p className="mt-1.5 text-[14px] text-[#5C7377]">
            Sign up to start booking appointments online
          </p>

          <PulseTrace className="mt-5" />

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="fullName" className="text-[13px] font-medium text-[#14262A]">
                Full name
              </label>
              <input
                id="fullName"
                placeholder="John Doe"
                className="block h-11 w-full rounded-lg border border-[#DCE8E7] bg-white px-3.5 text-[14px] text-[#14262A] outline-none transition placeholder:text-[#9AAAAD] focus:border-[#1F6E71] focus:ring-4 focus:ring-[#1F6E71]/10"
                {...register("fullName")}
              />
              {errors.fullName && (
                <p className="text-[13px] text-[#B54634]">{errors.fullName.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="email" className="text-[13px] font-medium text-[#14262A]">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="block h-11 w-full rounded-lg border border-[#DCE8E7] bg-white px-3.5 text-[14px] text-[#14262A] outline-none transition placeholder:text-[#9AAAAD] focus:border-[#1F6E71] focus:ring-4 focus:ring-[#1F6E71]/10"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-[13px] text-[#B54634]">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-[13px] font-medium text-[#14262A]">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className="block h-11 w-full rounded-lg border border-[#DCE8E7] bg-white px-3.5 text-[14px] text-[#14262A] outline-none transition placeholder:text-[#9AAAAD] focus:border-[#1F6E71] focus:ring-4 focus:ring-[#1F6E71]/10"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-[13px] text-[#B54634]">{errors.password.message}</p>
              )}
            </div>

            {serverError && (
              <p className="rounded-lg bg-[#B54634]/8 px-3 py-2 text-[13px] text-[#B54634]">
                {serverError}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 flex h-11 w-full items-center justify-center rounded-lg bg-[#1F6E71] text-[14px] font-medium text-white transition hover:bg-[#175457] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Creating account…" : "Sign up"}
            </button>
          </form>

          <p className="mt-6 text-center text-[13px] text-[#5C7377]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-[#1F6E71] underline-offset-4 hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}