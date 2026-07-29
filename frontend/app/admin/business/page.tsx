"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { getMyBusiness, createBusiness, updateBusiness } from "@/lib/api/admin";
import { Business } from "@/lib/types";

const businessSchema = z.object({
  name: z.string().min(2, "Business name is required"),
  description: z.string().optional(),
  address: z.string().optional(),
  phoneNumber: z.string().optional(),
  logoUrl: z.string().optional(),
});

type BusinessFormValues = z.infer<typeof businessSchema>;

export default function AdminBusinessPage() {
  const [business, setBusiness] = useState<Business | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BusinessFormValues>({
    resolver: zodResolver(businessSchema),
  });

  useEffect(() => {
    async function load() {
      const data = await getMyBusiness();
      setBusiness(data);
      if (data) reset(data);
      setIsLoading(false);
    }
    load();
  }, [reset]);

  const onSubmit = async (values: BusinessFormValues) => {
    setIsSubmitting(true);
    try {
      if (business) {
        const updated = await updateBusiness(business.id, values);
        setBusiness(updated);
        toast.success("Business info updated successfully");
      } else {
        const created = await createBusiness(values);
        setBusiness(created);
        toast.success("Business created successfully");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <p className="text-[14px] text-[#5C7377]">Loading…</p>;
  }

  const inputClass =
    "block w-full rounded-lg border border-[#DCE8E7] bg-white px-3.5 py-2.5 text-[14px] text-[#14262A] outline-none transition placeholder:text-[#9AAAAD] focus:border-[#1F6E71] focus:ring-4 focus:ring-[#1F6E71]/10";
  const labelClass = "text-[13px] font-medium text-[#14262A]";

  return (
    <div className="max-w-2xl">
      <div className="rounded-2xl border border-[#DCE8E7] bg-white p-7">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#5C7377]">
          Business profile
        </p>
        <h1
          className="mt-2 text-[24px] leading-tight text-[#14262A]"
          style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
        >
          {business ? "Business information" : "Create your business"}
        </h1>
        <p className="mt-1.5 text-[14px] text-[#5C7377]">
          {business
            ? "Update the information customers see on your public profile"
            : "Set up your business profile to start accepting bookings"}
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="name" className={labelClass}>
              Business name
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

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="address" className={labelClass}>
                Address
              </label>
              <input id="address" className={inputClass} {...register("address")} />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="phoneNumber" className={labelClass}>
                Phone number
              </label>
              <input id="phoneNumber" className={inputClass} {...register("phoneNumber")} />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="logoUrl" className={labelClass}>
              Logo URL
            </label>
            <input
              id="logoUrl"
              placeholder="https://..."
              className={inputClass}
              {...register("logoUrl")}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex h-11 items-center justify-center rounded-lg bg-[#1F6E71] px-6 text-[14px] font-medium text-white transition hover:bg-[#175457] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Saving…" : business ? "Save changes" : "Create business"}
          </button>
        </form>

        {business && (
          <p className="mt-5 border-t border-[#DCE8E7] pt-4 text-[13px] text-[#5C7377]">
            Your public page:{" "}
            
              href={`/business/${business.id}`}
              target="_blank"
              className="font-medium text-[#1F6E71] underline-offset-4 hover:underline"
Your public page: <a href={`/business/${business.id}`} target="_blank" className="font-medium text-[#1F6E71] underline-offset-4 hover:underline">/business/{business.id}</a>
          </p>
        )}
      </div>
    </div>
  );
}