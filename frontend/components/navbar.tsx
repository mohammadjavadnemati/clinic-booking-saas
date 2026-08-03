"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { user, isLoading, logout } = useAuth();
  const pathname = usePathname();

  // Hide navbar on admin pages (they have their own sidebar)
  if (pathname.startsWith("/admin")) {
    return null;
  }

  const linkClass = (active: boolean) =>
    cn(
      "text-[14px] font-medium transition",
      active ? "text-[#1F6E71]" : "text-[#5C7377] hover:text-[#14262A]"
    );

  return (
    <header className="border-b border-[#DCE8E7] bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="text-[16px] text-[#14262A]"
          style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
        >
          Clinic Booking
        </Link>

        <nav className="flex items-center gap-5">
          <Link href="/businesses" className={linkClass(pathname === "/businesses")}>
            Businesses
          </Link>

          {isLoading ? null : user ? (
            <>
              {user.role === "Customer" && (
                <Link href="/bookings" className={linkClass(pathname === "/bookings")}>
                  My bookings
                </Link>
              )}

              {user.role === "BusinessOwner" && (
                <Link href="/admin/bookings" className={linkClass(pathname.startsWith("/admin"))}>
                  Admin panel
                </Link>
              )}

              <Link href="/profile" className={linkClass(pathname === "/profile")}>
                Profile
              </Link>

              <button
                onClick={logout}
                className="flex h-9 items-center rounded-lg border border-[#DCE8E7] px-3.5 text-[13px] font-medium text-[#5C7377] transition hover:border-[#B54634]/40 hover:text-[#B54634]"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className={linkClass(pathname === "/login")}>
                Log in
              </Link>
              <Link
                href="/register"
                className="flex h-9 items-center rounded-lg bg-[#1F6E71] px-4 text-[13px] font-medium text-white transition hover:bg-[#175457]"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}