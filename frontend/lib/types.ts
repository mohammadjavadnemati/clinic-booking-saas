export interface User {
  id: string;
  fullName: string;
  email: string;
  role: "Customer" | "BusinessOwner" | "SuperAdmin";
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface Business {
  id: string;
  name: string;
  description?: string;
  address?: string;
  phoneNumber?: string;
  logoUrl?: string;
}

export interface Service {
  id: string;
  businessId: string;
  name: string;
  description?: string;
  price: number;
  durationMinutes: number;
  isActive: boolean;
}

export interface Specialist {
  id: string;
  businessId: string;
  fullName: string;
  imageUrl?: string;
  specialty?: string;
  description?: string;
  isActive: boolean;
}

export interface WorkingHour {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isDayOff: boolean;
}
export interface Booking {
  id: string;
  businessId: string;
  serviceId: string;
  serviceName: string;
  specialistId: string;
  specialistName: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  startTime: string; // ISO UTC
  endTime: string;   // ISO UTC
  status: "Pending" | "Confirmed" | "Cancelled" | "Completed" | "Rejected";
  customerNote?: string;
  createdAt: string;
}