"use client";

import { Booking } from "@/lib/types";
import { Check, X, CheckCheck } from "lucide-react";

interface BookingRowActionsProps {
  booking: Booking;
  onUpdateStatus: (id: string, status: string) => void;
  isUpdating: boolean;
}

const positiveBtn =
  "flex h-8 items-center gap-1 rounded-md border border-[#DCE8E7] px-2.5 text-[13px] font-medium text-[#1F6E71] transition hover:border-[#1F6E71]/40 hover:bg-[#1F6E71]/6 disabled:cursor-not-allowed disabled:opacity-50";
const negativeBtn =
  "flex h-8 items-center gap-1 rounded-md border border-[#DCE8E7] px-2.5 text-[13px] font-medium text-[#B54634] transition hover:border-[#B54634]/40 hover:bg-[#B54634]/6 disabled:cursor-not-allowed disabled:opacity-50";

export function BookingRowActions({ booking, onUpdateStatus, isUpdating }: BookingRowActionsProps) {
  if (booking.status === "Pending") {
    return (
      <div className="flex justify-end gap-1.5">
        <button
          disabled={isUpdating}
          onClick={() => onUpdateStatus(booking.id, "Confirmed")}
          className={positiveBtn}
        >
          <Check className="h-3.5 w-3.5" />
          Confirm
        </button>
        <button
          disabled={isUpdating}
          onClick={() => onUpdateStatus(booking.id, "Rejected")}
          className={negativeBtn}
        >
          <X className="h-3.5 w-3.5" />
          Reject
        </button>
      </div>
    );
  }

  if (booking.status === "Confirmed") {
    return (
      <div className="flex justify-end gap-1.5">
        <button
          disabled={isUpdating}
          onClick={() => onUpdateStatus(booking.id, "Completed")}
          className={positiveBtn}
        >
          <CheckCheck className="h-3.5 w-3.5" />
          Mark completed
        </button>
        <button
          disabled={isUpdating}
          onClick={() => onUpdateStatus(booking.id, "Cancelled")}
          className={negativeBtn}
        >
          <X className="h-3.5 w-3.5" />
          Cancel
        </button>
      </div>
    );
  }

  // Completed, Cancelled, Rejected — no further actions
  return <span className="text-[13px] text-[#9AAAAD]">—</span>;
}