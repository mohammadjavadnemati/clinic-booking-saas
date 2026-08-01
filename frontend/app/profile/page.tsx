"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";

export default function ProfilePage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F8F8]">
        <p className="text-[14px] text-[#5C7377]">Loading…</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const initials = user.fullName
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F5F8F8] px-4 py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(#DCE8E7 1px, transparent 1px), linear-gradient(90deg, #DCE8E7 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(circle at 50% 30%, black, transparent 70%)",
          WebkitMaskImage: "radial-gradient(circle at 50% 30%, black, transparent 70%)",
        }}
      />

      <div className="relative w-full max-w-[400px]">
        <div className="rounded-2xl border border-[#DCE8E7] bg-white px-8 pb-8 pt-9 shadow-[0_1px_2px_rgba(20,38,42,0.04),0_12px_32px_-16px_rgba(20,38,42,0.12)]">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#1F6E71]/10 text-[15px] font-semibold text-[#1F6E71]">
              {initials}
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#5C7377]">
                Account
              </p>
              <h1
                className="text-[22px] leading-tight text-[#14262A]"
                style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
              >
                My profile
              </h1>
            </div>
          </div>

          <div className="mt-7 space-y-4 border-t border-[#DCE8E7] pt-5">
            <div className="flex items-center justify-between">
              <p className="text-[13px] text-[#5C7377]">Full name</p>
              <p className="text-[14px] font-medium text-[#14262A]">
                {user.fullName}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-[13px] text-[#5C7377]">Email</p>
              <p className="text-[14px] font-medium text-[#14262A]">
                {user.email}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-[13px] text-[#5C7377]">Role</p>
              <p className="inline-flex items-center rounded-full bg-[#1F6E71]/10 px-2.5 py-0.5 text-[12px] font-medium text-[#1F6E71]">
                {user.role}
              </p>
            </div>
          </div>
          {user.role === "Customer" && (
  <Link
    href="/bookings"
    className="block w-full rounded-md border p-2 text-center text-sm font-medium hover:bg-gray-50"
  >
    View My Bookings
  </Link>
)}

          <button
            type="button"
            onClick={logout}
            className="mt-7 flex h-11 w-full items-center justify-center rounded-lg border border-[#DCE8E7] text-[14px] font-medium text-[#B54634] transition hover:border-[#B54634]/40 hover:bg-[#B54634]/6"
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}