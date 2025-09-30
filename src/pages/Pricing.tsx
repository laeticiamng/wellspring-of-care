import Header from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Heart, Star, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Pricing = () => {
  const plans = [
    {
      name: "Gratuit",
      price: "0€",
      period: "/mois",
      description: "Pour découvrir EmotionsCare",
      icon: Heart,
      color: "bg-gradient-calm",
      features: [
        "3 conversations IA par jour",
        "Journal émotionnel basique",
        "5 séances de méditation",
        "Accès communauté limité",
        "Support email"
      ],
      cta: "Commencer gratuitement",
      popular: false
    },
    {
      name: "Premium",
      price: "19€",
      period: "/mois",
      description: "Pour un suivi complet",
      icon: Star,
      color: "bg-gradient-primary",
      features: [
        "Conversations IA illimitées",
        "Journal avec analytics avancés",
        "Toutes les méditations",
        "Accès complet communauté",
        "3 sessions thérapie/mois",
        "Suivi personnalisé",
        "Support prioritaire",
        "Téléchargement de contenus"
      ],
      cta: "Passer à Premium",
      popular: true
    },
    {
      name: "Famille",
      price: "39€",
      period: "/mois",
      description: "Pour toute la famille",
      icon: Zap,
      color: "bg-gradient-secondary",
      features: [
        "Tout du plan Premium",
        "Jusqu'à 5 profils",
        "Dashboard famille",
        "Sessions familiales",
        "Contrôle parental",
        "Espace privé par membre",
        "Rapports mensuels",
        "Onboarding familial"
      ],
      cta: "Essayer Famille",
      popular: false
    }
  ];

  const faqs = [
    {
      question: "Puis-je changer de plan à tout moment ?",
      answer: "Oui, vous pouvez modifier votre abonnement à tout moment. Les changements prennent effet immédiatement."
    },
    {
      question: "Y a-t-il un engagement ?",
      answer: "Non, tous nos plans sont sans engagement. Vous pouvez résilier à tout moment."
    },
    {
      question: "Les données sont-elles confidentielles ?",
      answer: "Absolument. Toutes vos données sont chiffrées et protégées selon les normes les plus strictes."
    },
    {
      question: "Puis-je essayer Premium gratuitement ?",
      answer: "Oui, nous offrons 7 jours d'essai gratuit pour le plan Premium."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-calm">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <Badge className="bg-gradient-primary text-primary-foreground border-0">
            Offre spéciale
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold">
            Choisissez votre parcours
            <br />
            de <span className="bg-gradient-primary bg-clip-text text-transparent">bien-être</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Des plans adaptés à vos besoins, pour prendre soin de votre santé mentale
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <Card 
                key={index}
                className={`border-0 shadow-soft hover:shadow-glow transition-all ${
                  plan.popular ? 'ring-2 ring-primary scale-105' : ''
                }`}
              >
                <CardContent className="p-8">
                  {plan.popular && (
                    <Badge className="bg-gradient-primary text-primary-foreground border-0 mb-4">
                      ⭐ Plus populaire
                    </Badge>
                  )}

                  <div className={`${plan.color} p-4 rounded-full w-fit mb-6`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-muted-foreground mb-6">{plan.description}</p>

                  <div className="mb-6">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>

                  <Button 
                    className={`w-full mb-8 ${plan.popular ? 'bg-gradient-primary' : 'bg-gradient-secondary'}`}
                    asChild
                  >
                    <Link to="/auth">
                      {plan.cta}
                    </Link>
                  </Button>

                  <ul className="space-y-4">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <Check className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Enterprise Section */}
        <Card className="border-0 shadow-elegant bg-gradient-primary/5 mb-20">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Solution B2B pour entreprises
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Offrez le meilleur à vos équipes avec notre solution dédiée aux organisations
            </p>
            <Button className="bg-gradient-secondary text-secondary-foreground" size="lg" asChild>
              <Link to="/organizations">
                Découvrir les offres entreprise
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Questions fréquentes
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="border-0 shadow-soft">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-3">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center mt-20">
          <p className="text-muted-foreground mb-6">
            Vous avez des questions ? Notre équipe est là pour vous aider.
          </p>
          <Button variant="outline" size="lg">
            Contacter le support
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Pricing;
