"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Specialist } from "@/lib/types";
import { createSpecialist, updateSpecialist } from "@/lib/api/admin";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const specialistSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  specialty: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  isActive: z.boolean(),
});

type SpecialistFormValues = z.infer<typeof specialistSchema>;

interface SpecialistFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  specialist: Specialist | null;
  onSaved: (specialist: Specialist) => void;
}

const inputClass =
  "block w-full rounded-lg border border-[#DCE8E7] bg-white px-3.5 py-2.5 text-[14px] text-[#14262A] outline-none transition placeholder:text-[#9AAAAD] focus:border-[#1F6E71] focus:ring-4 focus:ring-[#1F6E71]/10";
const labelClass = "text-[13px] font-medium text-[#14262A]";

export function SpecialistFormDialog({
  open,
  onOpenChange,
  specialist,
  onSaved,
}: SpecialistFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SpecialistFormValues>({
    resolver: zodResolver(specialistSchema),
    defaultValues: {
      fullName: "",
      specialty: "",
      description: "",
      imageUrl: "",
      isActive: true,
    },
  });

  useEffect(() => {
    if (open) {
      reset(
        specialist
          ? {
              fullName: specialist.fullName,
              specialty: specialist.specialty || "",
              description: specialist.description || "",
              imageUrl: specialist.imageUrl || "",
              isActive: specialist.isActive,
            }
          : {
              fullName: "",
              specialty: "",
              description: "",
              imageUrl: "",
              isActive: true,
            }
      );
    }
  }, [open, specialist, reset]);

  const isActive = watch("isActive");

  const onSubmit = async (values: SpecialistFormValues) => {
    setIsSubmitting(true);
    try {
      let result: Specialist;
      if (specialist) {
        result = await updateSpecialist(specialist.id, values);
        toast.success("Specialist updated successfully");
      } else {
        result = await createSpecialist(values);
        toast.success("Specialist added successfully");
      }
      onSaved(result);
      onOpenChange(false);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl border-[#DCE8E7] p-7 sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle
            className="text-[20px] text-[#14262A]"
            style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
          >
            {specialist ? "Edit specialist" : "Add new specialist"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-2 space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="fullName" className={labelClass}>
              Full name
            </label>
            <input id="fullName" className={inputClass} {...register("fullName")} />
            {errors.fullName && (
              <p className="text-[13px] text-[#B54634]">{errors.fullName.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="specialty" className={labelClass}>
              Specialty
            </label>
            <input
              id="specialty"
              placeholder="e.g. General Dentistry"
              className={inputClass}
              {...register("specialty")}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="description" className={labelClass}>
              Description
            </label>
            <textarea
              id="description"
              rows={3}
              className={`${inputClass} resize-none`}
              {...register("description")}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="imageUrl" className={labelClass}>
              Image URL
            </label>
            <input
              id="imageUrl"
              placeholder="https://..."
              className={inputClass}
              {...register("imageUrl")}
            />
          </div>

          {specialist && (
            <div className="flex items-center justify-between rounded-lg border border-[#DCE8E7] p-3">
              <label htmlFor="isActive" className={labelClass}>
                Active
              </label>
              <Switch
                id="isActive"
                checked={isActive}
                onCheckedChange={(checked) => setValue("isActive", checked)}
              />
            </div>
          )}

          <DialogFooter>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-11 w-full items-center justify-center rounded-lg bg-[#1F6E71] text-[14px] font-medium text-white transition hover:bg-[#175457] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-6"
            >
              {isSubmitting ? "Saving…" : specialist ? "Save changes" : "Add specialist"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}