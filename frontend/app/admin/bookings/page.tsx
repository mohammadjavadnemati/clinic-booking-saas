"use client";

import { useEffect, useState, useCallback } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { getMyBusiness, getBusinessBookings, updateBookingStatus } from "@/lib/api/admin";
import { getSpecialistsByBusiness } from "@/lib/api/public";
import { Booking, Specialist } from "@/lib/types";
import { BookingFilters } from "@/components/admin/booking-filters";
import { BookingRowActions } from "@/components/admin/booking-row-actions";

const statusStyles: Record<Booking["status"], string> = {
  Pending: "bg-[#B8863B]/10 text-[#8A651F]",
  Confirmed: "bg-[#1F6E71]/10 text-[#1F6E71]",
  Completed: "bg-[#DCE8E7] text-[#5C7377]",
  Cancelled: "bg-[#B54634]/10 text-[#B54634]",
  Rejected: "bg-[#B54634]/10 text-[#B54634]",
};

export default function AdminBookingsPage() {
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedSpecialistId, setSelectedSpecialistId] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const loadBookings = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getBusinessBookings({
        date: selectedDate ? format(selectedDate, "yyyy-MM-dd") : undefined,
        specialistId: selectedSpecialistId || undefined,
        status: selectedStatus || undefined,
      });
      setBookings(data);
    } catch {
      toast.error("Failed to load bookings.");
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate, selectedSpecialistId, selectedStatus]);

  useEffect(() => {
    async function init() {
      const business = await getMyBusiness();
      if (!business) {
        setIsLoading(false);
        return;
      }
      setBusinessId(business.id);
      const specialistsData = await getSpecialistsByBusiness(business.id);
      setSpecialists(specialistsData);
    }
    init();
  }, []);

  useEffect(() => {
    if (businessId) loadBookings();
  }, [businessId, loadBookings]);

  const handleUpdateStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      const updated = await updateBookingStatus(id, status);
      setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)));
      toast.success(`Booking marked as ${status}`);
    } catch {
      toast.error("Failed to update booking status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleClearFilters = () => {
    setSelectedDate(undefined);
    setSelectedSpecialistId("");
    setSelectedStatus("");
  };

  if (!businessId && !isLoading) {
    return (
      <p className="text-[14px] text-[#5C7377]">
        You need to set up your business profile first. Go to{" "}
        <a href="/admin/business" className="font-medium text-[#1F6E71] underline-offset-4 hover:underline">
          Business info
        </a>
        .
      </p>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1
          className="text-[24px] leading-tight text-[#14262A]"
          style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
        >
          Bookings
        </h1>
        <p className="mt-1 text-[14px] text-[#5C7377]">
          Manage incoming appointment requests
        </p>
      </div>

      <div className="mb-4">
        <BookingFilters
          specialists={specialists}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          selectedSpecialistId={selectedSpecialistId}
          onSpecialistChange={setSelectedSpecialistId}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          onClear={handleClearFilters}
        />
      </div>

      {isLoading ? (
        <p className="text-[14px] text-[#5C7377]">Loading…</p>
      ) : bookings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#DCE8E7] bg-white py-12 text-center">
          <p className="text-[14px] text-[#9AAAAD]">No bookings found.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[#DCE8E7] bg-white">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#DCE8E7]">
                <th className="px-5 py-3 text-[12px] font-medium uppercase tracking-[0.08em] text-[#5C7377]">
                  Date & time
                </th>
                <th className="px-5 py-3 text-[12px] font-medium uppercase tracking-[0.08em] text-[#5C7377]">
                  Customer
                </th>
                <th className="px-5 py-3 text-[12px] font-medium uppercase tracking-[0.08em] text-[#5C7377]">
                  Service
                </th>
                <th className="px-5 py-3 text-[12px] font-medium uppercase tracking-[0.08em] text-[#5C7377]">
                  Specialist
                </th>
                <th className="px-5 py-3 text-[12px] font-medium uppercase tracking-[0.08em] text-[#5C7377]">
                  Status
                </th>
                <th className="px-5 py-3 text-right text-[12px] font-medium uppercase tracking-[0.08em] text-[#5C7377]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="border-b border-[#DCE8E7] last:border-0 hover:bg-[#F5F8F8]"
                >
                  <td className="px-5 py-3.5 text-[14px] text-[#14262A]">
                    {format(new Date(booking.startTime), "MMM d, yyyy HH:mm")}
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-[14px] font-medium text-[#14262A]">
                      {booking.customerName}
                    </p>
                    <p className="text-[12px] text-[#9AAAAD]">{booking.customerEmail}</p>
                  </td>
                  <td className="px-5 py-3.5 text-[14px] text-[#5C7377]">
                    {booking.serviceName}
                  </td>
                  <td className="px-5 py-3.5 text-[14px] text-[#5C7377]">
                    {booking.specialistName}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[12px] font-medium ${statusStyles[booking.status]}`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <BookingRowActions
                      booking={booking}
                      onUpdateStatus={handleUpdateStatus}
                      isUpdating={updatingId === booking.id}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}