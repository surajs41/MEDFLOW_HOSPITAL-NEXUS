import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";

// Auth Pages
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import Index from "@/pages/Index";

// Dashboard Pages
import UserDashboard from "@/pages/dashboard/UserDashboard";
import AdminDashboard from "@/pages/dashboard/AdminDashboard";

// User Section Pages
import AppointmentsPage from "@/pages/appointments/AppointmentsPage";
import MedicalRecordsPage from "@/pages/records/MedicalRecordsPage";
import PrescriptionsPage from "@/pages/prescriptions/PrescriptionsPage";
import BillingPage from "@/pages/billing/BillingPage";
import ProfilePage from "@/pages/profile/ProfilePage";
import SettingsPage from "@/pages/settings/SettingsPage";

// Not Found
import NotFoundPage from "@/pages/NotFoundPage";

// Admin Section Pages
import ManageUsersPage from "./pages/admin/ManageUsersPage";
import AdminAppointmentsPage from "./pages/admin/AdminAppointmentsPage";
import AdminRecordsPage from "./pages/admin/AdminRecordsPage";
import AdminBillingPage from "./pages/admin/AdminBillingPage";
import AdminInventoryPage from "./pages/admin/AdminInventoryPage";

// Doctor Section Pages
import DoctorDashboard from "./pages/dashboard/DoctorDashboard";
import BookAppointmentPage from "./pages/appointments/BookAppointmentPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Entry Point - Handles Redirection */}
                <Route path="/" element={<Index />} />
                
                {/* Public Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                
                {/* Protected User Routes */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="dashboard" element={<UserDashboard />} />
                  <Route path="appointments" element={<AppointmentsPage />} />
                  <Route path="records" element={<MedicalRecordsPage />} />
                  <Route path="prescriptions" element={<PrescriptionsPage />} />
                  <Route path="billing" element={<BillingPage />} />
                  <Route path="profile" element={<ProfilePage />} />
                  <Route path="settings" element={<SettingsPage />} />
                  <Route path="doctor" element={<DoctorDashboard />} />
                  <Route path="appointments/book" element={<BookAppointmentPage />} />
                  {/* Add other user routes here */}
                </Route>
                
                {/* Protected Admin Routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <DashboardLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="users" element={<ManageUsersPage />} />
                  <Route path="patients" element={<AdminRecordsPage />} />
                  <Route path="appointments" element={<AdminAppointmentsPage />} />
                  <Route path="billing" element={<AdminBillingPage />} />
                  <Route path="inventory" element={<AdminInventoryPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                </Route>

                {/* 404 Route */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </LanguageProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
