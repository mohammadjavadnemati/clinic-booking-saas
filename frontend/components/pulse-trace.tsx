// components/pulse-trace.tsx
export function PulseTrace({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 28"
      className={`h-6 w-full text-[#1F6E71] ${className}`}
      aria-hidden="true"
    >
      <path
        d="M0 14 H110 L122 14 L130 2 L140 26 L148 14 L162 14 L170 8 L176 14 H320"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="pulse-draw"
      />
    </svg>
  );
}