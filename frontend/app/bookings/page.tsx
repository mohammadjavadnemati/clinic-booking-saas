"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { useAuth } from "@/lib/auth-context";
import { getMyBookings } from "@/lib/api/customer";
import { Booking } from "@/lib/types";

const statusStyles: Record<Booking["status"], string> = {
  Pending: "bg-[#B8863B]/10 text-[#8A651F]",
  Confirmed: "bg-[#1F6E71]/10 text-[#1F6E71]",
  Completed: "bg-[#DCE8E7] text-[#5C7377]",
  Cancelled: "bg-[#B54634]/10 text-[#B54634]",
  Rejected: "bg-[#B54634]/10 text-[#B54634]",
};

export default function MyBookingsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }
    async function load() {
      try {
        const data = await getMyBookings();
        setBookings(data);
      } finally {
        setIsLoading(false);
      }
    }
    if (user) load();
  }, [user, authLoading, router]);

  if (authLoading || isLoading) {
    return (
      <div className="mx-auto max-w-2xl space-y-4 px-4 py-10">
        <div className="h-8 w-1/3 animate-pulse rounded-lg bg-[#DCE8E7]/60" />
        <div className="h-32 w-full animate-pulse rounded-2xl bg-[#DCE8E7]/60" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F8F8]">
      <div className="mx-auto max-w-2xl px-4 py-14">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#5C7377]">
          Your appointments
        </p>
        <h1
          className="mt-2 text-[26px] leading-tight text-[#14262A]"
          style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
        >
          My bookings
        </h1>

        {bookings.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-[#DCE8E7] bg-white py-12 text-center">
            <p className="text-[14px] text-[#9AAAAD]">
              You don&apos;t have any bookings yet.
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-3">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="rounded-2xl border border-[#DCE8E7] bg-white p-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-[15px] font-medium text-[#14262A]">
                    {booking.serviceName}
                  </h3>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-[12px] font-medium ${statusStyles[booking.status]}`}
                  >
                    {booking.status}
                  </span>
                </div>

                <p className="mt-2 text-[13px] text-[#5C7377]">
                  With {booking.specialistName}
                </p>
                <p className="text-[13px] text-[#5C7377]">
                  {format(new Date(booking.startTime), "MMMM d, yyyy 'at' HH:mm")}
                </p>
                {booking.customerNote && (
                  <p className="mt-2 border-t border-[#DCE8E7] pt-2 text-[13px] text-[#9AAAAD]">
                    Note: {booking.customerNote}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}