"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllBusinesses } from "@/lib/api/public";
import { Business } from "@/lib/types";

export default function BusinessesListPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getAllBusinesses();
        setBusinesses(data);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F8F8]">
      <div className="mx-auto max-w-3xl px-4 py-14">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#5C7377]">
          Directory
        </p>
        <h1
          className="mt-2 text-[26px] leading-tight text-[#14262A]"
          style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
        >
          Browse businesses
        </h1>

        {isLoading ? (
          <div className="mt-8 space-y-3">
            <div className="h-20 w-full animate-pulse rounded-2xl bg-[#DCE8E7]/60" />
            <div className="h-20 w-full animate-pulse rounded-2xl bg-[#DCE8E7]/60" />
          </div>
        ) : businesses.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-[#DCE8E7] bg-white py-12 text-center">
            <p className="text-[14px] text-[#9AAAAD]">No businesses available yet.</p>
          </div>
        ) : (
          <div className="mt-8 space-y-3">
            {businesses.map((business) => {
              const initials = business.name
                .split(" ")
                .map((w) => w[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();

              return (
                <Link
                  key={business.id}
                  href={`/business/${business.id}`}
                  className="block rounded-2xl border border-[#DCE8E7] bg-white p-5 transition hover:border-[#1F6E71]/30 hover:bg-[#1F6E71]/5"
                >
                  <div className="flex items-center gap-4">
                    {business.logoUrl ? (
                      <img
                        src={business.logoUrl}
                        alt={business.name}
                        className="h-12 w-12 shrink-0 rounded-full border border-[#DCE8E7] object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#1F6E71]/10 text-[14px] font-semibold text-[#1F6E71]">
                        {initials}
                      </div>
                    )}
                    <div>
                      <p className="text-[15px] font-medium text-[#14262A]">
                        {business.name}
                      </p>
                      {business.address && (
                        <p className="text-[13px] text-[#5C7377]">{business.address}</p>
                      )}
                    </div>
                  </div>

                  {business.description && (
                    <p className="mt-3 text-[13px] leading-5 text-[#5C7377]">
                      {business.description}
                    </p>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}