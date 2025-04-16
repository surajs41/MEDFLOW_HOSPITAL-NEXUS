import { useEffect, useState, ReactNode } from "react";
import { useNavigate, Outlet, useLocation, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Sidebar } from "./Sidebar";
import { Toaster } from "@/components/ui/toaster";
import { Loader2 } from "lucide-react";
import TopNavBar from "./TopNavBar";
import { LayoutDashboard, Users } from "lucide-react";

interface DashboardLayoutProps {
  children?: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { isAuthenticated, loading, user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-hospital-light">
        <Loader2 className="h-8 w-8 animate-spin text-hospital-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="h-screen flex overflow-hidden bg-hospital-light">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
        userRole={user.role}
      >
        {user?.role === "admin" && (
          <>
            <Link
              to="/admin/dashboard"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
                location.pathname === "/admin/dashboard"
                  ? "bg-muted text-primary"
                  : ""
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              Admin Dashboard
            </Link>
            <Link
              to="/admin/users"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
                location.pathname === "/admin/users"
                  ? "bg-muted text-primary"
                  : ""
              }`}
            >
              <Users className="h-4 w-4" />
              Manage Users
            </Link>
          </>
        )}
      </Sidebar>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavBar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <div className="flex-1 overflow-auto p-6">
          {children || <Outlet />}
        </div>
      </div>
      
      <Toaster />
    </div>
  );
};

export default DashboardLayout;
