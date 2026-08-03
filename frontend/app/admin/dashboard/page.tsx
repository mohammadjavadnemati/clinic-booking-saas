"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { getDashboardStats } from "@/lib/api/admin";
import { DashboardStats } from "@/lib/types";
import { StatCard } from "@/components/admin/stat-card";
import { CalendarCheck, Clock, DollarSign, Users } from "lucide-react";

const chartTooltipStyle = {
  borderRadius: 12,
  border: "1px solid #DCE8E7",
  backgroundColor: "#FFFFFF",
  fontSize: 13,
  color: "#14262A",
  boxShadow: "0 12px 32px -16px rgba(20,38,42,0.12)",
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch {
        toast.error("Failed to load dashboard stats.");
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-1/3 animate-pulse rounded-lg bg-[#DCE8E7]/60" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="h-24 animate-pulse rounded-2xl bg-[#DCE8E7]/60" />
          <div className="h-24 animate-pulse rounded-2xl bg-[#DCE8E7]/60" />
          <div className="h-24 animate-pulse rounded-2xl bg-[#DCE8E7]/60" />
          <div className="h-24 animate-pulse rounded-2xl bg-[#DCE8E7]/60" />
        </div>
        <div className="h-72 w-full animate-pulse rounded-2xl bg-[#DCE8E7]/60" />
      </div>
    );
  }

  if (!stats) {
    return (
      <p className="text-[14px] text-[#5C7377]">
        You need to set up your business profile first. Go to{" "}
        <a href="/admin/business" className="font-medium text-[#1F6E71] underline-offset-4 hover:underline">
          Business info
        </a>
        .
      </p>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1
          className="text-[24px] leading-tight text-[#14262A]"
          style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
        >
          Dashboard
        </h1>
        <p className="mt-1 text-[14px] text-[#5C7377]">
          An overview of your business performance
        </p>
      </div>

      {/* Top stat cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard title="Total bookings" value={stats.totalBookings} icon={CalendarCheck} />
        <StatCard title="Pending" value={stats.pendingBookings} icon={Clock} />
        <StatCard
          title="Total revenue"
          value={`$${stats.totalRevenue.toFixed(2)}`}
          icon={DollarSign}
        />
        <StatCard title="New customers (this month)" value={stats.newCustomersThisMonth} icon={Users} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Bookings over the last 30 days */}
        <div className="rounded-2xl border border-[#DCE8E7] bg-white p-6">
          <h2 className="text-[15px] font-medium text-[#14262A]">Bookings — last 30 days</h2>
          <div className="mt-4">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={stats.bookingsLast30Days}>
                <CartesianGrid strokeDasharray="3 3" stroke="#DCE8E7" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => value.slice(5)}
                  interval={4}
                  fontSize={12}
                  stroke="#9AAAAD"
                  tickLine={false}
                  axisLine={{ stroke: "#DCE8E7" }}
                />
                <YAxis
                  allowDecimals={false}
                  fontSize={12}
                  stroke="#9AAAAD"
                  tickLine={false}
                  axisLine={{ stroke: "#DCE8E7" }}
                />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#1F6E71"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top services */}
        <div className="rounded-2xl border border-[#DCE8E7] bg-white p-6">
          <h2 className="text-[15px] font-medium text-[#14262A]">Most popular services</h2>
          <div className="mt-4">
            {stats.topServices.length === 0 ? (
              <p className="text-[14px] text-[#9AAAAD]">No booking data yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={stats.topServices} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#DCE8E7" />
                  <XAxis
                    type="number"
                    allowDecimals={false}
                    fontSize={12}
                    stroke="#9AAAAD"
                    tickLine={false}
                    axisLine={{ stroke: "#DCE8E7" }}
                  />
                  <YAxis
                    type="category"
                    dataKey="serviceName"
                    width={100}
                    fontSize={12}
                    stroke="#9AAAAD"
                    tickLine={false}
                    axisLine={{ stroke: "#DCE8E7" }}
                  />
                  <Tooltip contentStyle={chartTooltipStyle} cursor={{ fill: "#F5F8F8" }} />
                  <Bar dataKey="bookingCount" fill="#1F6E71" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Status breakdown */}
      <div className="mt-6 rounded-2xl border border-[#DCE8E7] bg-white p-6">
        <h2 className="text-[15px] font-medium text-[#14262A]">Booking status breakdown</h2>
        <div className="mt-4 grid grid-cols-2 gap-6 sm:grid-cols-4">
          <div>
            <p className="text-[13px] text-[#5C7377]">Pending</p>
            <p
              className="mt-1 text-[22px] leading-none text-[#14262A]"
              style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
            >
              {stats.pendingBookings}
            </p>
          </div>
          <div>
            <p className="text-[13px] text-[#5C7377]">Confirmed</p>
            <p
              className="mt-1 text-[22px] leading-none text-[#14262A]"
              style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
            >
              {stats.confirmedBookings}
            </p>
          </div>
          <div>
            <p className="text-[13px] text-[#5C7377]">Completed</p>
            <p
              className="mt-1 text-[22px] leading-none text-[#14262A]"
              style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
            >
              {stats.completedBookings}
            </p>
          </div>
          <div>
            <p className="text-[13px] text-[#5C7377]">Cancelled / rejected</p>
            <p
              className="mt-1 text-[22px] leading-none text-[#14262A]"
              style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
            >
              {stats.cancelledOrRejectedBookings}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}