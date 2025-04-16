import { User } from './user';

export type UserRole = 'admin' | 'doctor' | 'nurse' | 'receptionist' | 'patient';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}
