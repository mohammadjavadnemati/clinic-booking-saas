"use client";

import { format } from "date-fns";
import { Specialist } from "@/lib/types";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, X } from "lucide-react";

interface BookingFiltersProps {
  specialists: Specialist[];
  selectedDate: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  selectedSpecialistId: string;
  onSpecialistChange: (id: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  onClear: () => void;
}

const STATUS_OPTIONS = ["Pending", "Confirmed", "Cancelled", "Completed", "Rejected"];

const triggerClass =
  "flex h-9 items-center gap-2 rounded-lg border border-[#DCE8E7] bg-white px-3 text-[13px] text-[#14262A] outline-none transition hover:border-[#1F6E71]/40 focus:border-[#1F6E71] focus:ring-4 focus:ring-[#1F6E71]/10 data-[state=open]:border-[#1F6E71]";

export function BookingFilters({
  specialists,
  selectedDate,
  onDateChange,
  selectedSpecialistId,
  onSpecialistChange,
  selectedStatus,
  onStatusChange,
  onClear,
}: BookingFiltersProps) {
  const hasActiveFilters = selectedDate || selectedSpecialistId || selectedStatus;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <button className={triggerClass}>
            <CalendarIcon className="h-3.5 w-3.5 text-[#5C7377]" />
            {selectedDate ? format(selectedDate, "MMM d, yyyy") : "Filter by date"}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto rounded-xl border-[#DCE8E7] p-0">
          <Calendar mode="single" selected={selectedDate} onSelect={onDateChange} />
        </PopoverContent>
      </Popover>

      <Select value={selectedSpecialistId} onValueChange={onSpecialistChange}>
        <SelectTrigger className={`w-48 ${triggerClass}`}>
          <SelectValue placeholder="Filter by specialist" />
        </SelectTrigger>
        <SelectContent className="rounded-lg border-[#DCE8E7]">
          {specialists.map((s) => (
            <SelectItem key={s.id} value={s.id} className="text-[13px]">
              {s.fullName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedStatus} onValueChange={onStatusChange}>
        <SelectTrigger className={`w-40 ${triggerClass}`}>
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent className="rounded-lg border-[#DCE8E7]">
          {STATUS_OPTIONS.map((status) => (
            <SelectItem key={status} value={status} className="text-[13px]">
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <button
          onClick={onClear}
          className="flex h-9 items-center gap-1.5 rounded-lg px-3 text-[13px] font-medium text-[#5C7377] transition hover:bg-[#F5F8F8]"
        >
          <X className="h-3.5 w-3.5" />
          Clear filters
        </button>
      )}
    </div>
  );
}