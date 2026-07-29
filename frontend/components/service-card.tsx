import { Service } from "@/lib/types";

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div className="rounded-2xl border border-[#DCE8E7] bg-white p-5 transition hover:border-[#1F6E71]/30">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-[15px] font-medium text-[#14262A]">{service.name}</h3>
        <span className="shrink-0 rounded-full bg-[#1F6E71]/10 px-2.5 py-0.5 text-[13px] font-medium text-[#1F6E71]">
          ${service.price.toFixed(2)}
        </span>
      </div>

      {service.description && (
        <p className="mt-2 text-[13px] leading-5 text-[#5C7377]">
          {service.description}
        </p>
      )}

      <p className="mt-3 text-[12px] text-[#9AAAAD]">
        {service.durationMinutes} min
      </p>
    </div>
  );
}