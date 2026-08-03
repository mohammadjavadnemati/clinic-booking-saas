import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
}

export function StatCard({ title, value, icon: Icon }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-[#DCE8E7] bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-medium text-[#5C7377]">{title}</p>
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1F6E71]/10">
          <Icon className="h-3.5 w-3.5 text-[#1F6E71]" />
        </div>
      </div>
      <p
        className="mt-3 text-[26px] leading-none text-[#14262A]"
        style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
      >
        {value}
      </p>
    </div>
  );
}