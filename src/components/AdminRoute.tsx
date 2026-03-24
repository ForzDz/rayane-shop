import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface AdminRouteProps {
  children: React.ReactNode;
}

/**
 * AdminRoute : protège les routes d'admin (admin + staff).
 */
export const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user, loading, role, loadingRole } = useAuth();
  const location = useLocation();

  if (loading || loadingRole) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">جاري التحميل...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role !== "admin" && role !== "staff") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

