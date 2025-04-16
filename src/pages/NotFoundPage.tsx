
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const NotFoundPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const handleGoHome = () => {
    if (isAuthenticated) {
      if (user?.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-hospital-light p-4">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-8xl font-bold text-hospital-primary">404</h1>
        <h2 className="text-2xl font-semibold text-hospital-dark">Page not found</h2>
        <p className="text-hospital-muted">
          Sorry, the page you are looking for doesn't exist or has been moved.
        </p>
        <Button onClick={handleGoHome} className="bg-hospital-primary hover:bg-hospital-accent">
          Return Home
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
