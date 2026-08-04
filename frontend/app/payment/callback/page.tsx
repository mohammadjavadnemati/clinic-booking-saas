"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { submitPaymentCallback } from "@/lib/api/customer";

export default function PaymentCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const paymentId = searchParams.get("paymentId");
  const reference = searchParams.get("reference");

  const handleResult = async (status: "success" | "failure") => {
    if (!paymentId) return;
    setIsProcessing(true);
    try {
      const payment = await submitPaymentCallback(paymentId, status);
      if (payment.status === "Succeeded") {
        toast.success("Payment completed successfully!");
      } else {
        toast.error("Payment failed.");
      }
      router.push("/bookings");
    } catch {
      toast.error("Something went wrong while processing the payment.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!paymentId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F8F8]">
        <p className="text-[14px] text-[#5C7377]">Invalid payment link.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F8F8] px-4">
      <div className="w-full max-w-md rounded-2xl border border-[#DCE8E7] bg-white p-7">
        <span className="inline-flex items-center rounded-full bg-[#B8863B]/10 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-[0.06em] text-[#8A651F]">
          Dev environment
        </span>

        <h1
          className="mt-3 text-[22px] leading-tight text-[#14262A]"
          style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
        >
          Mock payment gateway
        </h1>
        <p className="mt-1.5 text-[13px] leading-5 text-[#5C7377]">
          This is a simulated payment page for development purposes.
        </p>
        <p className="mt-2 rounded-lg bg-[#F5F8F8] px-3 py-2 font-mono text-[12px] text-[#5C7377]">
          Reference: {reference}
        </p>

        <div className="mt-6 flex gap-3">
          <button
            onClick={() => handleResult("success")}
            disabled={isProcessing}
            className="flex h-11 flex-1 items-center justify-center rounded-lg bg-[#1F6E71] text-[14px] font-medium text-white transition hover:bg-[#175457] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isProcessing ? "Processing…" : "Simulate success"}
          </button>
          <button
            onClick={() => handleResult("failure")}
            disabled={isProcessing}
            className="flex h-11 flex-1 items-center justify-center rounded-lg border border-[#DCE8E7] bg-white text-[14px] font-medium text-[#14262A] transition hover:border-[#B54634]/40 hover:text-[#B54634] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Simulate failure
          </button>
        </div>
      </div>
    </div>
  );
}