import { IsoInstant, Uuid } from './api.models';

export type Role = 'ROLE_ADMIN' | 'ROLE_USER';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  userId: Uuid;
  fullName: string;
  email: string;
  role: Role;
  expiresAt: IsoInstant;
}

export interface AuthSession extends AuthResponse {
  authenticatedAt: IsoInstant;
}
