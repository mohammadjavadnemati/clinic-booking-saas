"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  getBusinessById,
  getServicesByBusiness,
  getSpecialistsByBusiness,
  getAvailableSlots,
} from "@/lib/api/public";
import { createBooking } from "@/lib/api/customer";
import { useAuth } from "@/lib/auth-context";
import { Business, Service, Specialist } from "@/lib/types";
import { Calendar } from "@/components/ui/calendar";

type Step = "specialist" | "datetime" | "confirm";

const STEPS: { key: Step; label: string }[] = [
  { key: "specialist", label: "Specialist" },
  { key: "datetime", label: "Date & time" },
  { key: "confirm", label: "Confirm" },
];

export default function BookServicePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  const businessId = params.id as string;
  const serviceId = searchParams.get("serviceId") || "";

  const [business, setBusiness] = useState<Business | null>(null);
  const [service, setService] = useState<Service | null>(null);
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [step, setStep] = useState<Step>("specialist");
  const [selectedSpecialist, setSelectedSpecialist] = useState<Specialist | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [businessData, servicesData, specialistsData] = await Promise.all([
          getBusinessById(businessId),
          getServicesByBusiness(businessId),
          getSpecialistsByBusiness(businessId),
        ]);

        setBusiness(businessData);
        const matchedService = servicesData.find((s) => s.id === serviceId);
        setService(matchedService || null);
        setSpecialists(specialistsData.filter((s) => s.isActive));
      } catch {
        toast.error("Unable to load booking information.");
      } finally {
        setIsLoading(false);
      }
    }
    if (businessId && serviceId) load();
  }, [businessId, serviceId]);

  useEffect(() => {
    async function loadSlots() {
      if (!selectedSpecialist || !selectedDate || !service) return;
      setSlotsLoading(true);
      setSelectedSlot(null);
      try {
        const dateStr = format(selectedDate, "yyyy-MM-dd");
        const slots = await getAvailableSlots(selectedSpecialist.id, service.id, dateStr);
        setAvailableSlots(slots);
      } catch {
        toast.error("Unable to load available times.");
        setAvailableSlots([]);
      } finally {
        setSlotsLoading(false);
      }
    }
    if (step === "datetime") loadSlots();
  }, [selectedSpecialist, selectedDate, service, step]);

  const handleSelectSpecialist = (specialist: Specialist) => {
    setSelectedSpecialist(specialist);
    setStep("datetime");
  };

  const handleSelectSlot = (slot: string) => {
    setSelectedSlot(slot);
    setStep("confirm");
  };

  const handleConfirmBooking = async () => {
    if (!selectedSpecialist || !service || !selectedSlot) return;

    if (!user) {
      router.push(`/login?redirect=/business/${businessId}/book?serviceId=${serviceId}`);
      return;
    }

    setIsSubmitting(true);
    try {
      await createBooking({
        serviceId: service.id,
        specialistId: selectedSpecialist.id,
        startTime: selectedSlot,
        customerNote: note || undefined,
      });
      toast.success("Booking request sent successfully!");
      router.push("/bookings");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || authLoading) {
    return (
      <div className="mx-auto max-w-2xl space-y-4 px-4 py-10">
        <div className="h-8 w-2/3 animate-pulse rounded-lg bg-[#DCE8E7]/60" />
        <div className="h-64 w-full animate-pulse rounded-2xl bg-[#DCE8E7]/60" />
      </div>
    );
  }

  if (!business || !service) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F8F8]">
        <p className="text-[14px] text-[#5C7377]">Service or business not found.</p>
      </div>
    );
  }

  const currentStepIndex = STEPS.findIndex((s) => s.key === step);

  return (
    <div className="min-h-screen bg-[#F5F8F8]">
      <div className="mx-auto max-w-2xl px-4 py-14">
        <div className="mb-6">
          <p className="text-[13px] text-[#5C7377]">{business.name}</p>
          <h1
            className="mt-1 text-[24px] leading-tight text-[#14262A]"
            style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
          >
            Book: {service.name}
          </h1>
          <p className="mt-1 text-[13px] text-[#9AAAAD]">
            ${service.price.toFixed(2)} · {service.durationMinutes} min
          </p>
        </div>

        {/* Step indicator */}
        <div className="mb-6 flex items-center gap-2">
          {STEPS.map((s, i) => (
            <div key={s.key} className="flex flex-1 items-center gap-2">
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-medium ${
                    i < currentStepIndex
                      ? "bg-[#1F6E71] text-white"
                      : i === currentStepIndex
                      ? "bg-[#1F6E71]/10 text-[#1F6E71] ring-1 ring-[#1F6E71]"
                      : "bg-[#DCE8E7] text-[#9AAAAD]"
                  }`}
                >
                  {i + 1}
                </div>
                <span
                  className={`hidden text-[13px] font-medium sm:inline ${
                    i <= currentStepIndex ? "text-[#14262A]" : "text-[#9AAAAD]"
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`h-px flex-1 ${
                    i < currentStepIndex ? "bg-[#1F6E71]" : "bg-[#DCE8E7]"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-[#DCE8E7] bg-white p-6">
          {/* Step 1: Select Specialist */}
          {step === "specialist" && (
            <>
              <h2
                className="text-[18px] text-[#14262A]"
                style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
              >
                Choose a specialist
              </h2>
              <p className="mt-1 text-[13px] text-[#5C7377]">
                Who would you like to book with?
              </p>

              <div className="mt-4 space-y-2">
                {specialists.length === 0 ? (
                  <p className="text-[14px] text-[#9AAAAD]">
                    No specialists available for this business.
                  </p>
                ) : (
                  specialists.map((specialist) => {
                    const initials = specialist.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase();
                    return (
                      <button
                        key={specialist.id}
                        onClick={() => handleSelectSpecialist(specialist)}
                        className="flex w-full items-center gap-3 rounded-lg border border-[#DCE8E7] p-3 text-left transition hover:border-[#1F6E71]/40 hover:bg-[#1F6E71]/5"
                      >
                        {specialist.imageUrl ? (
                          <img
                            src={specialist.imageUrl}
                            alt={specialist.fullName}
                            className="h-10 w-10 shrink-0 rounded-full border border-[#DCE8E7] object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1F6E71]/10 text-[13px] font-semibold text-[#1F6E71]">
                            {initials}
                          </div>
                        )}
                        <div>
                          <p className="text-[14px] font-medium text-[#14262A]">
                            {specialist.fullName}
                          </p>
                          {specialist.specialty && (
                            <p className="text-[13px] text-[#5C7377]">{specialist.specialty}</p>
                          )}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </>
          )}

          {/* Step 2: Select Date & Time */}
          {step === "datetime" && selectedSpecialist && (
            <>
              <h2
                className="text-[18px] text-[#14262A]"
                style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
              >
                Choose date & time
              </h2>
              <p className="mt-1 text-[13px] text-[#5C7377]">
                with {selectedSpecialist.fullName}
              </p>

              <div className="mt-4 flex flex-col gap-6 sm:flex-row">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  className="rounded-lg border border-[#DCE8E7]"
                />

                <div className="flex-1">
                  <p className="mb-2 text-[13px] font-medium text-[#14262A]">
                    Available times {selectedDate ? `— ${format(selectedDate, "MMMM d, yyyy")}` : ""}
                  </p>

                  {slotsLoading ? (
                    <p className="text-[13px] text-[#9AAAAD]">Loading available times…</p>
                  ) : availableSlots.length === 0 ? (
                    <p className="text-[13px] text-[#9AAAAD]">No available times on this day.</p>
                  ) : (
                    <div className="grid grid-cols-3 gap-2">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => handleSelectSlot(slot)}
                          className="rounded-lg border border-[#DCE8E7] py-2 text-[13px] font-medium text-[#14262A] transition hover:border-[#1F6E71] hover:bg-[#1F6E71]/5 hover:text-[#1F6E71]"
                        >
                          {format(new Date(slot), "HH:mm")}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => setStep("specialist")}
                className="mt-4 text-[13px] font-medium text-[#5C7377] hover:text-[#14262A]"
              >
                ← Back to specialist selection
              </button>
            </>
          )}

          {/* Step 3: Confirm */}
          {step === "confirm" && selectedSpecialist && selectedSlot && (
            <>
              <h2
                className="text-[18px] text-[#14262A]"
                style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
              >
                Confirm your booking
              </h2>

              <div className="mt-4 space-y-1.5 rounded-lg border border-[#DCE8E7] bg-[#F5F8F8] p-4 text-[13px]">
                <p>
                  <span className="text-[#5C7377]">Service:</span>{" "}
                  <span className="text-[#14262A]">{service.name}</span>
                </p>
                <p>
                  <span className="text-[#5C7377]">Specialist:</span>{" "}
                  <span className="text-[#14262A]">{selectedSpecialist.fullName}</span>
                </p>
                <p>
                  <span className="text-[#5C7377]">Date & time:</span>{" "}
                  <span className="text-[#14262A]">
                    {format(new Date(selectedSlot), "MMMM d, yyyy 'at' HH:mm")}
                  </span>
                </p>
                <p>
                  <span className="text-[#5C7377]">Price:</span>{" "}
                  <span className="text-[#14262A]">${service.price.toFixed(2)}</span>
                </p>
              </div>

              <div className="mt-4 space-y-1.5">
                <label htmlFor="note" className="text-[13px] font-medium text-[#14262A]">
                  Note (optional)
                </label>
                <textarea
                  id="note"
                  placeholder="Anything the business should know before your visit?"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  className="block w-full resize-none rounded-lg border border-[#DCE8E7] bg-white px-3.5 py-2.5 text-[14px] text-[#14262A] outline-none transition placeholder:text-[#9AAAAD] focus:border-[#1F6E71] focus:ring-4 focus:ring-[#1F6E71]/10"
                />
              </div>

              {!user && (
                <p className="mt-3 rounded-lg bg-[#B8863B]/10 px-3 py-2 text-[13px] text-[#8A651F]">
                  You&apos;ll need to log in or create an account to confirm this booking.
                </p>
              )}

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => setStep("datetime")}
                  className="rounded-lg px-4 text-[14px] font-medium text-[#5C7377] transition hover:bg-[#F5F8F8]"
                >
                  ← Back
                </button>
                <button
                  onClick={handleConfirmBooking}
                  disabled={isSubmitting}
                  className="flex h-11 flex-1 items-center justify-center rounded-lg bg-[#1F6E71] text-[14px] font-medium text-white transition hover:bg-[#175457] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting
                    ? "Booking…"
                    : user
                    ? "Confirm booking"
                    : "Log in & confirm"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}