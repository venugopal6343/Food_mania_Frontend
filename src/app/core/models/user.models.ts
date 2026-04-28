import { IsoInstant, Uuid } from './api.models';
import { Role } from './auth.models';

export interface UserProfileResponse {
  id: Uuid;
  fullName: string;
  email: string;
  role: Role;
  createdAt: IsoInstant;
}
