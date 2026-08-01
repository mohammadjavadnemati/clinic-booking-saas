import { apiClient } from "@/lib/api-client";
import { Booking } from "@/lib/types";

export async function createBooking(payload: {
  serviceId: string;
  specialistId: string;
  startTime: string; // ISO UTC
  customerNote?: string;
}): Promise<Booking> {
  const { data } = await apiClient.post<Booking>("/booking", payload);
  return data;
}

export async function getMyBookings(): Promise<Booking[]> {
  const { data } = await apiClient.get<Booking[]>("/booking/my-bookings");
  return data;
}