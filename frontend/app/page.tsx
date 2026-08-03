"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { PulseTrace } from "@/components/pulse-trace";

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F5F8F8]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(#DCE8E7 1px, transparent 1px), linear-gradient(90deg, #DCE8E7 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(circle at 50% 0%, black, transparent 65%)",
          WebkitMaskImage: "radial-gradient(circle at 50% 0%, black, transparent 65%)",
        }}
      />

      <div className="relative mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#5C7377]">
          Clinic Booking
        </p>
        <h1
          className="mx-auto mt-3 max-w-lg text-[36px] leading-tight text-[#14262A]"
          style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
        >
          Welcome back
        </h1>
        <p className="mx-auto mt-3 max-w-md text-[15px] leading-6 text-[#5C7377]">
          Book appointments with clinics and service businesses online.
        </p>

        <PulseTrace className="mx-auto mt-7 max-w-xs" />

        {!user && (
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/businesses"
              className="flex h-11 items-center justify-center rounded-lg bg-[#1F6E71] px-6 text-[14px] font-medium text-white transition hover:bg-[#175457]"
            >
              Browse businesses
            </Link>
            <Link
              href="/register"
              className="flex h-11 items-center justify-center rounded-lg border border-[#DCE8E7] bg-white px-6 text-[14px] font-medium text-[#14262A] transition hover:border-[#1F6E71]/40"
            >
              Get started
            </Link>
          </div>
        )}

        {user?.role === "BusinessOwner" && (
          <div className="mx-auto mt-10 max-w-md rounded-2xl border border-[#DCE8E7] bg-white p-6 text-left">
            <h2
              className="text-[17px] text-[#14262A]"
              style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
            >
              Manage your business
            </h2>
            <p className="mt-1.5 text-[13px] leading-5 text-[#5C7377]">
              Go to your admin panel to manage bookings, services, and specialists.
            </p>
            <Link
              href="/admin/bookings"
              className="mt-4 flex h-10 w-fit items-center justify-center rounded-lg bg-[#1F6E71] px-5 text-[14px] font-medium text-white transition hover:bg-[#175457]"
            >
              Go to admin panel
            </Link>
          </div>
        )}

        {user?.role === "Customer" && (
          <div className="mx-auto mt-10 max-w-md rounded-2xl border border-[#DCE8E7] bg-white p-6 text-left">
            <h2
              className="text-[17px] text-[#14262A]"
              style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
            >
              Your bookings
            </h2>
            <p className="mt-1.5 text-[13px] leading-5 text-[#5C7377]">
              View and manage your upcoming appointments.
            </p>
            <Link
              href="/bookings"
              className="mt-4 flex h-10 w-fit items-center justify-center rounded-lg bg-[#1F6E71] px-5 text-[14px] font-medium text-white transition hover:bg-[#175457]"
            >
              View my bookings
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}