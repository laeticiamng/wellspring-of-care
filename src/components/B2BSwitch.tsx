import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUserRole } from "@/hooks/useUserRole";
import { Users, Building2, BarChart3, Heart, Briefcase } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export function B2BSwitch() {
  const navigate = useNavigate();
  const { isB2BEmployee, isManager, profile } = useUserRole();

  // Only show for B2B users
  if (!isB2BEmployee && !isManager) {
    return null;
  }

  const handleEmployeeMode = () => {
    toast.success("Mode Employé activé 💚");
    navigate("/app/home");
  };

  const handleManagerMode = () => {
    toast.success("Mode Manager activé 👔");
    navigate(`/app/rh?orgId=${profile?.org_id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-8 right-8 z-50"
    >
      <Card className="p-4 bg-background/95 backdrop-blur-sm shadow-elegant min-w-[280px]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-primary" />
            <span className="font-semibold text-sm">Mode Entreprise</span>
          </div>
          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
            {profile?.org_id ? 'Actif' : 'Inactif'}
          </span>
        </div>

        <div className="space-y-2">
          {isB2BEmployee && (
            <Button 
              variant="outline" 
              size="sm"
              className="w-full justify-start"
              onClick={handleEmployeeMode}
            >
              <Heart className="mr-2 h-4 w-4" />
              Modules bien-être
            </Button>
          )}
          
          {isManager && (
            <Button 
              variant="outline" 
              size="sm"
              className="w-full justify-start"
              onClick={handleManagerMode}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Tableau de bord RH
            </Button>
          )}
        </div>

        <p className="text-xs text-muted-foreground mt-3 leading-tight">
          {isManager 
            ? "Agrégats anonymisés uniquement" 
            : "Données 100% privées"}
        </p>
      </Card>
    </motion.div>
  );
}
