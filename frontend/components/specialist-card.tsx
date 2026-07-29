import { Specialist } from "@/lib/types";

interface SpecialistCardProps {
  specialist: Specialist;
}

export function SpecialistCard({ specialist }: SpecialistCardProps) {
  const initials = specialist.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="rounded-2xl border border-[#DCE8E7] bg-white p-5 transition hover:border-[#1F6E71]/30">
      <div className="flex items-center gap-3.5">
        {specialist.imageUrl ? (
          <img
            src={specialist.imageUrl}
            alt={specialist.fullName}
            className="h-12 w-12 shrink-0 rounded-full border border-[#DCE8E7] object-cover"
          />
        ) : (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#1F6E71]/10 text-[13px] font-semibold text-[#1F6E71]">
            {initials}
          </div>
        )}
        <div>
          <p className="text-[15px] font-medium text-[#14262A]">
            {specialist.fullName}
          </p>
          {specialist.specialty && (
            <p className="text-[13px] text-[#5C7377]">{specialist.specialty}</p>
          )}
        </div>
      </div>

      {specialist.description && (
        <p className="mt-3 text-[13px] leading-5 text-[#5C7377]">
          {specialist.description}
        </p>
      )}
    </div>
  );
}