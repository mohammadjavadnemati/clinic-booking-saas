import { apiClient } from "@/lib/api-client";
import { Booking, Payment} from "@/lib/types";


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

export async function initiatePayment(bookingId: string): Promise<{ paymentId: string; redirectUrl: string }> {
  const { data } = await apiClient.post("/payment/initiate", { bookingId });
  return data;
}

export async function submitPaymentCallback(
  paymentId: string,
  status: "success" | "failure"
): Promise<Payment> {
  const { data } = await apiClient.post<Payment>(`/payment/${paymentId}/callback`, { status });
  return data;
}

export async function getPaymentByBooking(bookingId: string): Promise<Payment | null> {
  try {
    const { data } = await apiClient.get<Payment>(`/payment/booking/${bookingId}`);
    return data;
  } catch (err: any) {
    if (err.response?.status === 404) return null;
    throw err;
  }
}