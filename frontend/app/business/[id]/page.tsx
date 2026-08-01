"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getBusinessById, getServicesByBusiness, getSpecialistsByBusiness } from "@/lib/api/public";
import { Business, Service, Specialist } from "@/lib/types";
import { ServiceCard } from "@/components/service-card";
import { SpecialistCard } from "@/components/specialist-card";

export default function BusinessProfilePage() {
  const params = useParams();
  const businessId = params.id as string;

  const [business, setBusiness] = useState<Business | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [businessData, servicesData, specialistsData] = await Promise.all([
          getBusinessById(businessId),
          getServicesByBusiness(businessId),
          getSpecialistsByBusiness(businessId),
        ]);

        setBusiness(businessData);
        setServices(servicesData.filter((s) => s.isActive));
        setSpecialists(specialistsData.filter((s) => s.isActive));
      } catch {
        setError("Unable to load this business. Please check the link and try again.");
      } finally {
        setIsLoading(false);
      }
    }

    if (businessId) {
      loadData();
    }
  }, [businessId]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl space-y-6 px-4 py-10">
        <div className="h-24 w-full animate-pulse rounded-2xl bg-[#DCE8E7]/50" />
        <div className="h-64 w-full animate-pulse rounded-2xl bg-[#DCE8E7]/50" />
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F8F8]">
        <p className="text-[14px] text-[#5C7377]">{error || "Business not found."}</p>
      </div>
    );
  }

  const initials = business.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[#F5F8F8]">
      <div className="mx-auto max-w-4xl px-6 py-14">
        {/* Business header */}
        <div className="flex items-center gap-4">
          {business.logoUrl ? (
            <img
              src={business.logoUrl}
              alt={business.name}
              className="h-16 w-16 rounded-full border border-[#DCE8E7] object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#1F6E71]/10 text-[18px] font-semibold text-[#1F6E71]">
              {initials}
            </div>
          )}
          <div>
            <h1
              className="text-[26px] leading-tight text-[#14262A]"
              style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
            >
              {business.name}
            </h1>
            {business.address && (
              <p className="mt-0.5 text-[13px] text-[#5C7377]">{business.address}</p>
            )}
            {business.phoneNumber && (
              <p className="text-[13px] text-[#5C7377]">{business.phoneNumber}</p>
            )}
          </div>
        </div>

        {business.description && (
          <p className="mt-5 max-w-2xl text-[14px] leading-6 text-[#5C7377]">
            {business.description}
          </p>
        )}

        <div className="my-10 h-px bg-[#DCE8E7]" />

        {/* Services */}
        <section>
          <h2
            className="text-[13px] font-medium uppercase tracking-[0.1em] text-[#5C7377]"
          >
            Our services
          </h2>
          {services.length === 0 ? (
            <p className="mt-4 text-[14px] text-[#9AAAAD]">No services available yet.</p>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} businessId={business.id} />
              ))}
            </div>
          )}
        </section>

        <div className="my-10 h-px bg-[#DCE8E7]" />

        {/* Specialists */}
        <section>
          <h2
            className="text-[13px] font-medium uppercase tracking-[0.1em] text-[#5C7377]"
          >
            Our specialists
          </h2>
          {specialists.length === 0 ? (
            <p className="mt-4 text-[14px] text-[#9AAAAD]">No specialists listed yet.</p>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {specialists.map((specialist) => (
                <SpecialistCard key={specialist.id} specialist={specialist} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}