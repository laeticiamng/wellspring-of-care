import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Building2, Users, BarChart3, Shield, Zap, Heart } from "lucide-react";
import { Helmet } from "react-helmet";

export default function B2BLanding() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-accent/5 to-background">
      <Helmet>
        <title>EmotionsCare Entreprise | Bien-être au travail</title>
        <meta name="description" content="Solution de bien-être émotionnel pour entreprises avec modules immersifs et tableau de bord RH anonymisé." />
      </Helmet>

      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg">EmotionsCare</span>
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Entreprise</span>
          </div>
          <Button onClick={() => navigate("/auth")} variant="outline">
            Connexion
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          Le bien-être émotionnel au cœur de votre entreprise
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Offrez à vos collaborateurs des modules immersifs innovants et suivez la santé émotionnelle de vos équipes en toute confidentialité.
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" onClick={() => navigate("/auth")}>
            Demander une démo
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate("/")}>
            Version Particuliers
          </Button>
        </div>
      </section>

      {/* Two paths */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Employés */}
          <Card className="p-8 bg-gradient-to-br from-secondary/10 to-background border-2 hover:border-secondary transition-all">
            <Users className="h-12 w-12 text-secondary mb-4" />
            <h2 className="text-2xl font-bold mb-4">Pour vos collaborateurs</h2>
            <p className="text-muted-foreground mb-6">
              Des modules immersifs pour des pauses bien-être efficaces : VR, musique thérapeutique, respiration guidée, journal émotionnel...
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-2">
                <Heart className="h-5 w-5 text-secondary mt-0.5" />
                <span>Pauses émotionnelles gamifiées</span>
              </li>
              <li className="flex items-start gap-2">
                <Zap className="h-5 w-5 text-secondary mt-0.5" />
                <span>Modules VR & musique adaptative</span>
              </li>
              <li className="flex items-start gap-2">
                <Shield className="h-5 w-5 text-secondary mt-0.5" />
                <span>Données 100% privées et anonymisées</span>
              </li>
            </ul>
          </Card>

          {/* RH/Managers */}
          <Card className="p-8 bg-gradient-to-br from-primary/10 to-background border-2 hover:border-primary transition-all">
            <BarChart3 className="h-12 w-12 text-primary mb-4" />
            <h2 className="text-2xl font-bold mb-4">Pour vos managers RH</h2>
            <p className="text-muted-foreground mb-6">
              Un tableau de bord agrégé et anonymisé pour suivre la santé émotionnelle de vos équipes et agir efficacement.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-2">
                <BarChart3 className="h-5 w-5 text-primary mt-0.5" />
                <span>Heatmap émotionnelle par équipe</span>
              </li>
              <li className="flex items-start gap-2">
                <Shield className="h-5 w-5 text-primary mt-0.5" />
                <span>K-anonymat (min 5 personnes)</span>
              </li>
              <li className="flex items-start gap-2">
                <Zap className="h-5 w-5 text-primary mt-0.5" />
                <span>Actions recommandées par IA</span>
              </li>
            </ul>
          </Card>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16 bg-accent/5 rounded-2xl">
        <h2 className="text-3xl font-bold text-center mb-12">Une plateforme unique</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Confidentialité absolue</h3>
            <p className="text-sm text-muted-foreground">
              Aucune donnée individuelle accessible aux RH, agrégation anonymisée seulement.
            </p>
          </div>
          <div className="text-center">
            <div className="h-16 w-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="h-8 w-8 text-secondary" />
            </div>
            <h3 className="font-semibold mb-2">Immersion & gamification</h3>
            <p className="text-sm text-muted-foreground">
              VR, musique adaptative, respiration, journal... 22 modules innovants.
            </p>
          </div>
          <div className="text-center">
            <div className="h-16 w-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="h-8 w-8 text-accent" />
            </div>
            <h3 className="font-semibold mb-2">Vision d'équipe</h3>
            <p className="text-sm text-muted-foreground">
              Heatmap par équipe, phrases actionnables, exports PDF pour managers.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Prêt à transformer le bien-être dans votre entreprise ?</h2>
        <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
          Contactez-nous pour une démo personnalisée et découvrez comment EmotionsCare peut améliorer la santé émotionnelle de vos équipes.
        </p>
        <Button size="lg" onClick={() => navigate("/auth")}>
          Demander une démo
        </Button>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 EmotionsCare Entreprise. Bien-être émotionnel au travail.</p>
        </div>
      </footer>
    </div>
  );
}
