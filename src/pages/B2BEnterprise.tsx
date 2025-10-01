import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, LineChart, Sparkles, Shield, Zap } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";

export default function B2BEnterprise() {
  const navigate = useNavigate();
  const { isB2BEmployee, isB2BManager } = useUserRole();

  const handleEmployeeAccess = () => {
    navigate("/app/home");
  };

  const handleManagerAccess = () => {
    navigate("/app/rh");
  };

  return (
    <div className="min-h-screen bg-gradient-calm">
      <Helmet>
        <title>Entreprise - EmotionsCare</title>
        <meta name="description" content="Plateforme bien-être pour entreprises - Employés & Managers" />
      </Helmet>

      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
            <Building2 className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Espace Entreprise</span>
          </div>
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
            Bien-être au travail, simplifié
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Une plateforme immersive pour vos collaborateurs, des insights anonymisés pour vos managers
          </p>
        </div>

        {/* Two Access Modes */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          {/* Employés */}
          <Card className="border-2 hover:border-primary transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-2xl">Espace Employés</CardTitle>
              <CardDescription className="text-base">
                Modules immersifs pour les pauses bien-être quotidiennes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Expériences immersives</p>
                    <p className="text-sm text-muted-foreground">Nyvée, Music Therapy, VR Breath, Journal...</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Confidentialité totale</p>
                    <p className="text-sm text-muted-foreground">Vos données restent privées, jamais vues individuellement</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Pauses rapides</p>
                    <p className="text-sm text-muted-foreground">Sessions courtes adaptées au rythme professionnel</p>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={handleEmployeeAccess}
                className="w-full mt-6"
                size="lg"
                disabled={!isB2BEmployee && !isB2BManager}
              >
                Accéder aux modules
              </Button>
            </CardContent>
          </Card>

          {/* Managers/RH */}
          <Card className="border-2 hover:border-primary transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mb-4">
                <LineChart className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-2xl">Espace RH/Managers</CardTitle>
              <CardDescription className="text-base">
                Vision agrégée et anonymisée des données d'équipe
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <LineChart className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Heatmap Vibes</p>
                    <p className="text-sm text-muted-foreground">Visualisation des tendances d'équipe par période</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">K-anonymat (min 5)</p>
                    <p className="text-sm text-muted-foreground">Aucune donnée individuelle visible, agrégats uniquement</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Phrases actionnables</p>
                    <p className="text-sm text-muted-foreground">Suggestions d'actions basées sur l'IA</p>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleManagerAccess}
                className="w-full mt-6"
                size="lg"
                variant="outline"
                disabled={!isB2BManager}
              >
                Accéder au tableau de bord RH
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Security Notice */}
        <Card className="max-w-3xl mx-auto bg-muted/50 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <Shield className="w-6 h-6 text-primary mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Garantie de confidentialité</h3>
                <p className="text-sm text-muted-foreground">
                  Les managers n'ont accès qu'à des synthèses d'équipe sous forme de phrases textuelles. 
                  Aucune donnée individuelle (scores, réponses, identité) n'est jamais exposée. 
                  Le système respecte le principe de k-anonymat avec un minimum de 5 personnes par équipe.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}