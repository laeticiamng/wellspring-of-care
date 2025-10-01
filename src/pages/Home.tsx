import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserRole } from "@/hooks/useUserRole";

export default function Home() {
  const navigate = useNavigate();
  const { role, isLoading } = useUserRole();

  useEffect(() => {
    if (!isLoading) {
      // Rediriger vers le dashboard approprié selon le rôle
      if (role === 'manager_b2b' || role === 'admin') {
        navigate('/app/rh-dashboard', { replace: true });
      } else {
        navigate('/app/dashboard', { replace: true });
      }
    }
  }, [role, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-calm flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse-soft text-primary text-xl">Chargement...</div>
        </div>
      </div>
    );
  }

  return null;
}
