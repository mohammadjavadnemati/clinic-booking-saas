"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Service } from "@/lib/types";
import { createService, updateService } from "@/lib/api/admin";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const serviceSchema = z.object({
  name: z.string().min(2, "Service name is required"),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be 0 or more"),
  durationMinutes: z.coerce.number().min(5, "Duration must be at least 5 minutes"),
  isActive: z.boolean(),
});

type ServiceFormInput = z.input<typeof serviceSchema>;
type ServiceFormValues = z.output<typeof serviceSchema>;

interface ServiceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: Service | null; // null = creating a new service
  onSaved: (service: Service) => void;
}

const inputClass =
  "block w-full rounded-lg border border-[#DCE8E7] bg-white px-3.5 py-2.5 text-[14px] text-[#14262A] outline-none transition placeholder:text-[#9AAAAD] focus:border-[#1F6E71] focus:ring-4 focus:ring-[#1F6E71]/10";
const labelClass = "text-[13px] font-medium text-[#14262A]";

export function ServiceFormDialog({ open, onOpenChange, service, onSaved }: ServiceFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ServiceFormInput, unknown, ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      durationMinutes: 30,
      isActive: true,
    },
  });

  useEffect(() => {
    if (open) {
      reset(
        service
          ? {
              name: service.name,
              description: service.description || "",
              price: service.price,
              durationMinutes: service.durationMinutes,
              isActive: service.isActive,
            }
          : {
              name: "",
              description: "",
              price: 0,
              durationMinutes: 30,
              isActive: true,
            }
      );
    }
  }, [open, service, reset]);

  const isActive = watch("isActive");

  const onSubmit = async (values: ServiceFormValues) => {
    setIsSubmitting(true);
    try {
      let result: Service;
      if (service) {
        result = await updateService(service.id, values);
        toast.success("Service updated successfully");
      } else {
        result = await createService(values);
        toast.success("Service created successfully");
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
            {service ? "Edit service" : "Add new service"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-2 space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="name" className={labelClass}>
              Service name
            </label>
            <input id="name" className={inputClass} {...register("name")} />
            {errors.name && (
              <p className="text-[13px] text-[#B54634]">{errors.name.message}</p>
            )}
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="price" className={labelClass}>
                Price ($)
              </label>
              <input
                id="price"
                type="number"
                step="0.01"
                className={inputClass}
                {...register("price")}
              />
              {errors.price && (
                <p className="text-[13px] text-[#B54634]">{errors.price.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="durationMinutes" className={labelClass}>
                Duration (minutes)
              </label>
              <input
                id="durationMinutes"
                type="number"
                className={inputClass}
                {...register("durationMinutes")}
              />
              {errors.durationMinutes && (
                <p className="text-[13px] text-[#B54634]">{errors.durationMinutes.message}</p>
              )}
            </div>
          </div>

          {service && (
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
              {isSubmitting ? "Saving…" : service ? "Save changes" : "Create service"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}