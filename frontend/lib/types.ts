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