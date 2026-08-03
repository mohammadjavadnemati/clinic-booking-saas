import { apiClient } from "@/lib/api-client";
import { Business, Service, Specialist, WorkingHour, Booking, DashboardStats } from "@/lib/types";
import { getServicesByBusiness } from "@/lib/api/public";



// ---- Business ----
export async function getMyBusiness(): Promise<Business | null> {
  try {
    const { data } = await apiClient.get<Business>("/business/my-business");
    return data;
  } catch (err: any) {
    if (err.response?.status === 404) return null;
    throw err;
  }
}

export async function createBusiness(payload: Omit<Business, "id">): Promise<Business> {
  const { data } = await apiClient.post<Business>("/business", payload);
  return data;
}

export async function updateBusiness(id: string, payload: Omit<Business, "id">): Promise<Business> {
  const { data } = await apiClient.put<Business>(`/business/${id}`, payload);
  return data;
}

// ---- Services ----
export async function createService(payload: {
  name: string;
  description?: string;
  price: number;
  durationMinutes: number;
}): Promise<Service> {
  const { data } = await apiClient.post<Service>("/service", payload);
  return data;
}

export async function updateService(
  id: string,
  payload: { name: string; description?: string; price: number; durationMinutes: number; isActive: boolean }
): Promise<Service> {
  const { data } = await apiClient.put<Service>(`/service/${id}`, payload);
  return data;
}

export async function deleteService(id: string): Promise<void> {
  await apiClient.delete(`/service/${id}`);
}

// ---- Specialists ----
export async function createSpecialist(payload: {
  fullName: string;
  imageUrl?: string;
  specialty?: string;
  description?: string;
}): Promise<Specialist> {
  const { data } = await apiClient.post<Specialist>("/specialist", payload);
  return data;
}

export async function updateSpecialist(
  id: string,
  payload: { fullName: string; imageUrl?: string; specialty?: string; description?: string; isActive: boolean }
): Promise<Specialist> {
  const { data } = await apiClient.put<Specialist>(`/specialist/${id}`, payload);
  return data;
}

export async function deleteSpecialist(id: string): Promise<void> {
  await apiClient.delete(`/specialist/${id}`);
}

export async function setSpecialistWorkingHours(
  specialistId: string,
  workingHours: WorkingHour[]
): Promise<void> {
  await apiClient.put(`/specialist/${specialistId}/working-hours`, { workingHours });
}


export async function getBusinessBookings(filters?: {
  date?: string; // "yyyy-MM-dd"
  specialistId?: string;
  status?: string;
}): Promise<Booking[]> {
  const { data } = await apiClient.get<Booking[]>("/booking/business-bookings", {
    params: filters,
  });
  return data;
}

export async function updateBookingStatus(id: string, status: string): Promise<Booking> {
  const { data } = await apiClient.put<Booking>(`/booking/${id}/status`, { status });
  return data;
}


export async function getDashboardStats(): Promise<DashboardStats> {
  const { data } = await apiClient.get<DashboardStats>("/analytics/dashboard");
  return data;
}