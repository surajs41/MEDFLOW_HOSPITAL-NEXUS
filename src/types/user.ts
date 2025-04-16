export type UserRole = 'admin' | 'doctor' | 'nurse' | 'receptionist' | 'patient';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  role: UserRole;
  specialization?: string;
  assignedDoctor?: string;
  department?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  role: UserRole;
  specialization?: string;
  assignedDoctor?: string;
  department?: string;
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  specialization?: string;
  assignedDoctor?: string;
  department?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  register: (data: RegisterData) => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  deleteAccount: () => Promise<void>;
  clearAllUsers: () => void;
} 