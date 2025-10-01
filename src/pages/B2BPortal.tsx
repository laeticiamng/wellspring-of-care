import { useNavigate } from "react-router-dom";
import { useUserRole } from "@/hooks/useUserRole";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, BarChart3, Heart, Shield } from "lucide-react";
import { Helmet } from "react-helmet";

export default function B2BPortal() {
  const navigate = useNavigate();
  const { isB2BEmployee, isManager, profile } = useUserRole();

  return (
    <div className="min-h-screen bg-gradient-calm p-8">
      <Helmet>
        <title>Portail Entreprise | EmotionsCare</title>
        <meta name="description" content="Portail d'accès pour collaborateurs et managers RH" />
      </Helmet>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Bienvenue sur EmotionsCare Entreprise</h1>
          <p className="text-muted-foreground">
            {profile?.org_id ? 'Choisissez votre espace de travail' : 'Configuration en cours...'}
          </p>
        </div>

        {/* Employee Access */}
        {isB2BEmployee && (
          <Card className="p-8 bg-gradient-to-br from-secondary/10 to-background hover:shadow-lg transition-all">
            <div className="flex items-start gap-4 mb-6">
              <div className="h-12 w-12 bg-secondary/20 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-secondary" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold mb-2">Espace Collaborateur</h2>
                <p className="text-muted-foreground">
                  Accédez aux modules immersifs pour vos pauses bien-être : VR, musique, respiration, journal...
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-2 text-sm">
                <Heart className="h-4 w-4 text-secondary" />
                <span>22 modules immersifs</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-secondary" />
                <span>Données 100% privées</span>
              </div>
            </div>

            <Button 
              className="w-full" 
              size="lg"
              onClick={() => navigate("/app/home")}
            >
              Accéder aux modules
            </Button>
          </Card>
        )}

        {/* Manager Access */}
        {isManager && (
          <Card className="p-8 bg-gradient-to-br from-primary/10 to-background hover:shadow-lg transition-all">
            <div className="flex items-start gap-4 mb-6">
              <div className="h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold mb-2">Espace Manager RH</h2>
                <p className="text-muted-foreground">
                  Tableau de bord avec données agrégées et anonymisées par équipe (min 5 personnes).
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-2 text-sm">
                <BarChart3 className="h-4 w-4 text-primary" />
                <span>Heatmap émotionnelle</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-primary" />
                <span>K-anonymat garanti</span>
              </div>
            </div>

            <Button 
              className="w-full" 
              size="lg"
              onClick={() => navigate(`/app/rh?orgId=${profile?.org_id}`)}
            >
              Accéder au tableau de bord RH
            </Button>
          </Card>
        )}

        {/* Info */}
        <Card className="p-6 bg-accent/5">
          <p className="text-sm text-center text-muted-foreground">
            <Shield className="inline h-4 w-4 mr-1" />
            Vos données sont protégées. Les managers n'ont accès qu'aux agrégats d'équipe anonymisés (min 5 personnes).
          </p>
        </Card>
      </div>
    </div>
  );
}
