import Link from "next/link";
import { PulseTrace } from "@/components/pulse-trace";

const steps = [
  {
    number: "01",
    title: "Pick a service",
    description: "Browse what a clinic offers and choose the specialist you want to see.",
  },
  {
    number: "02",
    title: "Choose a time",
    description: "See real open slots and pick whatever fits your schedule, no phone call needed.",
  },
  {
    number: "03",
    title: "Get confirmed",
    description: "Receive an instant confirmation, plus a reminder before your appointment.",
  },
];

const features = [
  {
    title: "Live availability",
    description: "Slots update automatically as bookings and working hours change.",
  },
  {
    title: "Automatic reminders",
    description: "Email confirmations and reminders go out without any manual follow-up.",
  },
  {
    title: "One calendar, every specialist",
    description: "Manage every doctor, room, and service from a single dashboard.",
  },
];

export default function Home() {
  return (
    <div className="relative overflow-hidden bg-[#F5F8F8]">
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

      <div className="relative mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <p
          className="text-[16px] text-[#14262A]"
          style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
        >
          Clinic Booking
        </p>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-[14px] font-medium text-[#5C7377] hover:text-[#14262A]"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="flex h-9 items-center rounded-lg bg-[#1F6E71] px-4 text-[14px] font-medium text-white transition hover:bg-[#175457]"
          >
            Get started
          </Link>
        </div>
      </div>

      <main className="relative mx-auto max-w-3xl px-6 pb-24 pt-14 text-center sm:pt-20">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#5C7377]">
          Booking, simplified
        </p>
        <h1
          className="mx-auto mt-3 max-w-xl text-[40px] leading-[1.1] text-[#14262A] sm:text-[48px]"
          style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
        >
          Fewer calls. More appointments.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-[16px] leading-7 text-[#5C7377]">
          Clinic Booking gives clinics and service businesses an online
          calendar their clients can actually book from, day or night.
        </p>

        <PulseTrace className="mx-auto mt-8 max-w-xs" />

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/register"
            className="flex h-11 w-full items-center justify-center rounded-lg bg-[#1F6E71] px-6 text-[14px] font-medium text-white transition hover:bg-[#175457] sm:w-auto"
          >
            Book an appointment
          </Link>
          <Link
            href="/login"
            className="flex h-11 w-full items-center justify-center rounded-lg border border-[#DCE8E7] bg-white px-6 text-[14px] font-medium text-[#14262A] transition hover:border-[#1F6E71]/40 sm:w-auto"
          >
            Manage my clinic
          </Link>
        </div>
      </main>

      <section className="relative border-t border-[#DCE8E7] bg-white px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <h2
            className="text-center text-[24px] text-[#14262A]"
            style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
          >
            How it works
          </h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number}>
                <p className="text-[13px] font-medium text-[#1F6E71]">
                  {step.number}
                </p>
                <h3 className="mt-2 text-[16px] font-medium text-[#14262A]">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-[14px] leading-6 text-[#5C7377]">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <h2
            className="text-center text-[24px] text-[#14262A]"
            style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
          >
            Built for how clinics actually run
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-[#DCE8E7] bg-white p-5"
              >
                <h3 className="text-[15px] font-medium text-[#14262A]">
                  {feature.title}
                </h3>
                <p className="mt-1.5 text-[13px] leading-6 text-[#5C7377]">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="relative border-t border-[#DCE8E7] px-6 py-8">
        <p className="text-center text-[13px] text-[#5C7377]">
          © {new Date().getFullYear()} Clinic Booking
        </p>
      </footer>
    </div>
  );
}