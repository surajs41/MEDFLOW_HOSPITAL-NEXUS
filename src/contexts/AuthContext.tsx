import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { User, UserRole, AuthContextType } from '../types/user';
import { useToast } from "@/components/ui/use-toast";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users database for demo purposes
const MOCK_USERS = [
  {
    id: '1',
    email: 'admin@gmail.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin' as UserRole,
    phone: '9876543210',
    dateOfBirth: '1980-01-01',
    address: '123 Admin Street',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone: string;
  dateOfBirth: string;
  address: string;
  specialization?: string;
  assignedDoctor?: string;
  department?: string;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(false);

  // Function to clear all users except mock users
  const clearAllUsers = () => {
    localStorage.setItem('users', JSON.stringify(MOCK_USERS));
    localStorage.removeItem('user');
    setUser(null);
    toast({
      title: "System Reset",
      description: "All user data has been cleared.",
    });
  };

  useEffect(() => {
    // Initialize mock users if no users exist
    const storedUsers = localStorage.getItem('users');
    if (!storedUsers) {
      localStorage.setItem('users', JSON.stringify(MOCK_USERS));
    }

    // Check for stored user data on component mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const register = async (data: RegisterData) => {
    try {
      setLoading(true);
      // Get existing users
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Check if email already exists
      if (users.some((u: User) => u.email === data.email)) {
        throw new Error('Email already registered');
      }

      // Create new user with role-specific data
      const newUser: User = {
        id: Date.now().toString(),
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone,
        dateOfBirth: data.dateOfBirth,
        address: data.address,
        role: data.role,
        ...(data.role === 'doctor' && { specialization: data.specialization }),
        ...(data.role === 'patient' && { assignedDoctor: data.assignedDoctor }),
        ...(data.role === 'nurse' && { department: data.department }),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Add new user to users list
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));

      // Set current user
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));

      // Trigger storage event to update other components
      window.dispatchEvent(new Event('storage'));

      toast({
        title: "Registration Successful",
        description: "Your account has been created successfully.",
      });
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "Failed to create account",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      console.log('Attempting login for email:', email);
      
      const matchedUser = users.find((u: User) => 
        u.email === email && u.password === password
      );

      if (!matchedUser) {
        console.error('Login failed: Invalid credentials');
        throw new Error('Invalid email or password');
      }

      console.log('Login successful for user:', { ...matchedUser, password: '[REDACTED]' });
      
      setUser(matchedUser);
      localStorage.setItem('user', JSON.stringify(matchedUser));

      toast({
        title: "Login Successful",
        description: `Welcome back, ${matchedUser.name}!`,
      });

      return true; // Return success status
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "Invalid credentials",
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    console.log('User logged out');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      setLoading(true);
      if (!user) throw new Error('No user logged in');

      // Get all users
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Update user in users list
      const updatedUsers = users.map((u: User) => {
        if (u.id === user.id) {
          const updatedUser = {
            ...u,
            ...data,
            updatedAt: new Date().toISOString()
          };
          return updatedUser;
        }
        return u;
      });

      // Update users list in localStorage
      localStorage.setItem('users', JSON.stringify(updatedUsers));

      // Update current user
      const updatedUser = {
        ...user,
        ...data,
        updatedAt: new Date().toISOString()
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async () => {
    try {
      if (!user) throw new Error('No user logged in');

      // Get all users
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Remove user from users list
      const updatedUsers = users.filter((u: User) => u.id !== user.id);
      
      // Update users list in localStorage
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      // Clear current user
      setUser(null);
      localStorage.removeItem('user');

      toast({
        title: "Account Deleted",
        description: "Your account has been permanently deleted.",
      });
    } catch (error) {
      toast({
        title: "Deletion Failed",
        description: error instanceof Error ? error.message : "Failed to delete account",
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        register,
        login,
        logout,
        updateProfile,
        deleteAccount,
        clearAllUsers
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
