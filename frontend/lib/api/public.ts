import { apiClient } from "@/lib/api-client";
import { Business, Service, Specialist, WorkingHour } from "@/lib/types";

export async function getBusinessById(id: string): Promise<Business> {
  const { data } = await apiClient.get<Business>(`/business/${id}`);
  return data;
}

export async function getServicesByBusiness(businessId: string): Promise<Service[]> {
  const { data } = await apiClient.get<Service[]>(`/service/business/${businessId}`);
  return data;
}

export async function getSpecialistsByBusiness(businessId: string): Promise<Specialist[]> {
  const { data } = await apiClient.get<Specialist[]>(`/specialist/business/${businessId}`);
  return data;
}

export async function getSpecialistWorkingHours(specialistId: string): Promise<WorkingHour[]> {
  const { data } = await apiClient.get<WorkingHour[]>(`/specialist/${specialistId}/working-hours`);
  return data;
}