"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { WorkingHour } from "@/lib/types";
import { getSpecialistWorkingHours } from "@/lib/api/public";
import { setSpecialistWorkingHours } from "@/lib/api/admin";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const DAYS = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

interface DayRow {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isDayOff: boolean;
}

interface WorkingHoursDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  specialistId: string | null;
  specialistName: string;
}

function buildDefaultRows(existing: WorkingHour[]): DayRow[] {
  return DAYS.map((day) => {
    const found = existing.find((w) => w.dayOfWeek === day.value);
    return {
      dayOfWeek: day.value,
      startTime: found?.startTime || "09:00",
      endTime: found?.endTime || "17:00",
      isDayOff: found ? found.isDayOff : day.value === 0 || day.value === 6, // default weekends off
    };
  });
}

const timeInputClass =
  "h-9 w-[112px] rounded-lg border border-[#DCE8E7] bg-white px-2.5 text-[13px] text-[#14262A] outline-none transition focus:border-[#1F6E71] focus:ring-4 focus:ring-[#1F6E71]/10";

export function WorkingHoursDialog({
  open,
  onOpenChange,
  specialistId,
  specialistName,
}: WorkingHoursDialogProps) {
  const [rows, setRows] = useState<DayRow[]>(buildDefaultRows([]));
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function load() {
      if (!open || !specialistId) return;
      setIsLoading(true);
      try {
        const existing = await getSpecialistWorkingHours(specialistId);
        setRows(buildDefaultRows(existing));
      } catch {
        toast.error("Failed to load working hours");
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [open, specialistId]);

  const updateRow = (dayOfWeek: number, patch: Partial<DayRow>) => {
    setRows((prev) =>
      prev.map((r) => (r.dayOfWeek === dayOfWeek ? { ...r, ...patch } : r))
    );
  };

  const handleSave = async () => {
    if (!specialistId) return;
    setIsSaving(true);
    try {
      const payload: WorkingHour[] = rows.map((r) => ({
        id: "00000000-0000-0000-0000-000000000000",
        dayOfWeek: r.dayOfWeek,
        startTime: r.startTime,
        endTime: r.endTime,
        isDayOff: r.isDayOff,
      }));
      await setSpecialistWorkingHours(specialistId, payload);
      toast.success("Working hours updated");
      onOpenChange(false);
    } catch {
      toast.error("Failed to save working hours. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-2xl border-[#DCE8E7] p-7">
        <DialogHeader>
          <DialogTitle
            className="text-[19px] text-[#14262A]"
            style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
          >
            Working hours
          </DialogTitle>
          <p className="text-[13px] text-[#5C7377]">{specialistName}</p>
        </DialogHeader>

        {isLoading ? (
          <p className="text-[14px] text-[#5C7377]">Loading…</p>
        ) : (
          <div className="mt-2 space-y-2">
            {rows.map((row) => {
              const dayLabel = DAYS.find((d) => d.value === row.dayOfWeek)?.label;
              return (
                <div
                  key={row.dayOfWeek}
                  className="flex flex-wrap items-center gap-3 rounded-lg border border-[#DCE8E7] px-3.5 py-2.5"
                >
                  <div className="w-24 shrink-0 text-[13px] font-medium text-[#14262A]">
                    {dayLabel}
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch
                      checked={!row.isDayOff}
                      onCheckedChange={(checked) =>
                        updateRow(row.dayOfWeek, { isDayOff: !checked })
                      }
                    />
                    <span className="text-[12px] text-[#5C7377]">
                      {row.isDayOff ? "Closed" : "Open"}
                    </span>
                  </div>

                  {!row.isDayOff && (
                    <div className="ml-auto flex items-center gap-2">
                      <input
                        type="time"
                        value={row.startTime}
                        onChange={(e) =>
                          updateRow(row.dayOfWeek, { startTime: e.target.value })
                        }
                        className={timeInputClass}
                      />
                      <span className="text-[13px] text-[#9AAAAD]">to</span>
                      <input
                        type="time"
                        value={row.endTime}
                        onChange={(e) =>
                          updateRow(row.dayOfWeek, { endTime: e.target.value })
                        }
                        className={timeInputClass}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <DialogFooter className="mt-4">
          <button
            onClick={handleSave}
            disabled={isSaving || isLoading}
            className="flex h-11 w-full items-center justify-center rounded-lg bg-[#1F6E71] text-[14px] font-medium text-white transition hover:bg-[#175457] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-6"
          >
            {isSaving ? "Saving…" : "Save working hours"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}