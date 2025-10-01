import { Navigate } from "react-router-dom";
import { useUserRole, UserRole } from "@/hooks/useUserRole";
import { ReactNode } from "react";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  redirectTo?: string;
}

export function RoleGuard({ children, allowedRoles, redirectTo = "/app/home" }: RoleGuardProps) {
  const { role, isLoading } = useUserRole();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-calm flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse-soft text-primary text-xl">Chargement...</div>
        </div>
      </div>
    );
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}