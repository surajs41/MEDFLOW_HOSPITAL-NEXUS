import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";
import { UserRole } from "@/types/auth";
import { 
  Home, Users, Calendar, FileText, Receipt, Package2, Settings, ChevronLeft, 
  ChevronRight, LogOut, UserPlus, Activity, Stethoscope, Clipboard, UserCog
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { ReactNode } from "react";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  userRole: UserRole;
  children?: ReactNode;
}

export const Sidebar = ({ isOpen, toggleSidebar, userRole }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const isActiveRoute = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  // Define menu items based on user role
  const getMenuItems = () => {
    const commonItems = [
      { label: "Dashboard", icon: Home, path: userRole === "admin" ? "/admin/dashboard" : "/dashboard" },
    ];
    
    if (userRole === "admin") {
      return [
        ...commonItems,
        { label: "User Management", icon: UserCog, path: "/admin/users" },
        { label: "Patient Records", icon: FileText, path: "/admin/patients" },
        { label: "Appointments", icon: Calendar, path: "/admin/appointments" },
        { label: "Billing", icon: Receipt, path: "/admin/billing" },
        { label: "Inventory", icon: Package2, path: "/admin/inventory" },
        { label: "Settings", icon: Settings, path: "/admin/settings" },
      ];
    }
    
    if (userRole === "doctor") {
      return [
        ...commonItems,
        { label: "My Patients", icon: Users, path: "/patients" },
        { label: "Appointments", icon: Calendar, path: "/appointments" },
        { label: "Medical Records", icon: FileText, path: "/records" },
        { label: "Prescriptions", icon: Clipboard, path: "/prescriptions" },
      ];
    }
    
    if (userRole === "nurse") {
      return [
        ...commonItems,
        { label: "Patient Care", icon: Activity, path: "/patient-care" },
        { label: "Appointments", icon: Calendar, path: "/appointments" },
        { label: "Medical Records", icon: FileText, path: "/records" },
      ];
    }
    
    if (userRole === "receptionist") {
      return [
        ...commonItems,
        { label: "Appointments", icon: Calendar, path: "/appointments" },
        { label: "Patient Registration", icon: UserPlus, path: "/register-patient" },
        { label: "Billing", icon: Receipt, path: "/billing" },
      ];
    }
    
    // Default for patients
    return [
      ...commonItems,
      { label: "My Appointments", icon: Calendar, path: "/appointments" },
      { label: "Medical Records", icon: FileText, path: "/records" },
      { label: "Prescriptions", icon: Clipboard, path: "/prescriptions" },
      { label: "Billing", icon: Receipt, path: "/billing" },
    ];
  };

  const menuItems = getMenuItems();

  return (
    <div
      className={cn(
        "bg-white border-r border-gray-200 h-full transition-all duration-300 flex flex-col shadow-sm relative",
        isOpen ? "w-64" : "w-20"
      )}
    >
      {/* Logo and brand */}
      <div className={cn(
        "h-16 flex items-center px-4",
        isOpen ? "justify-between" : "justify-center"
      )}>
        {isOpen ? (
          <div className="flex items-center space-x-2">
            <Stethoscope className="text-hospital-primary h-8 w-8" />
            <span className="font-bold text-xl text-hospital-dark">MedicoCare</span>
          </div>
        ) : (
          <Stethoscope className="text-hospital-primary h-8 w-8" />
        )}
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar} 
          className={cn(
            "rounded-full hover:bg-gray-100",
            !isOpen && "hidden"
          )}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
      </div>

      {/* Menu items */}
      <div className="flex-1 py-6 overflow-y-auto">
        <nav className="px-2 space-y-1">
          {menuItems.map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              className={cn(
                "w-full justify-start mb-1",
                isOpen ? "px-3" : "px-0 justify-center",
                isActiveRoute(item.path)
                  ? "bg-hospital-light text-hospital-primary font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              )}
              onClick={() => navigate(item.path)}
            >
              <item.icon className={cn("h-5 w-5", isOpen && "mr-3")} />
              {isOpen && <span>{item.label}</span>}
            </Button>
          ))}
        </nav>
      </div>

      {/* Logout button */}
      <div className="p-4 border-t border-gray-200">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start text-gray-600 hover:bg-gray-50 hover:text-gray-900",
            !isOpen && "justify-center px-0"
          )}
          onClick={logout}
        >
          <LogOut className={cn("h-5 w-5", isOpen && "mr-3")} />
          {isOpen && <span>Logout</span>}
        </Button>
      </div>

      {/* Collapse button (when sidebar is collapsed) */}
      {!isOpen && (
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="absolute -right-3 top-20 bg-white border border-gray-200 rounded-full shadow-sm"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default Sidebar;
