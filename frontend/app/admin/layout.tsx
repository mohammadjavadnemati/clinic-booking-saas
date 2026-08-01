"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/business", label: "Business Info" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/specialists", label: "Specialists" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "BusinessOwner")) {
      router.push("/login");
    }
  }, [isLoading, user, router]);

  if (isLoading || !user || user.role !== "BusinessOwner") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F8F8]">
        <p className="text-[14px] text-[#5C7377]">Loading…</p>
      </div>
    );
  }

  const initials = user.fullName
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="flex min-h-screen bg-[#F5F8F8]">
      <aside className="flex w-64 shrink-0 flex-col border-r border-[#DCE8E7] bg-white p-6">
        <p
          className="text-[17px] text-[#14262A]"
          style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
        >
          Clinic Booking
        </p>
        <p className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.14em] text-[#5C7377]">
          Admin panel
        </p>

        <nav className="mt-7 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "block rounded-lg px-3 py-2 text-[14px] font-medium text-[#5C7377] transition hover:bg-[#1F6E71]/6 hover:text-[#14262A]",
                  isActive && "bg-[#1F6E71]/10 text-[#1F6E71] hover:bg-[#1F6E71]/10 hover:text-[#1F6E71]"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-[#DCE8E7] pt-4">
          <div className="flex items-center gap-2.5 px-1">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1F6E71]/10 text-[12px] font-semibold text-[#1F6E71]">
              {initials}
            </div>
            <p className="truncate text-[13px] text-[#5C7377]">{user.email}</p>
          </div>
          <button
            onClick={logout}
            className="mt-3 w-full rounded-lg px-3 py-2 text-left text-[13px] font-medium text-[#B54634] transition hover:bg-[#B54634]/6"
          >
            Log out
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}