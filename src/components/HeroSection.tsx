import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Brain, 
  Users, 
  Video, 
  MessageCircle, 
  BookOpen,
  ArrowRight,
  Star,
  CheckCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const HeroSection = () => {
  const { user } = useAuth();
  const features = [
    {
      icon: Brain,
      title: "IA Thérapeutique",
      description: "Analyse émotionnelle avancée et recommandations personnalisées",
      color: "bg-gradient-primary"
    },
    {
      icon: Users,
      title: "Communauté",
      description: "Rejoignez des groupes de soutien bienveillants",
      color: "bg-gradient-secondary"
    },
    {
      icon: Video,
      title: "Thérapie en ligne",
      description: "Consultations avec des thérapeutes certifiés",
      color: "bg-gradient-healing"
    },
    {
      icon: BookOpen,
      title: "Journal intime",
      description: "Suivez votre évolution émotionnelle quotidienne",
      color: "bg-secondary"
    }
  ];

  const testimonials = [
    {
      name: "Marie L.",
      text: "EmotionsCare m'a aidée à retrouver confiance en moi.",
      rating: 5,
      badge: "Utilisatrice depuis 6 mois"
    },
    {
      name: "Pierre M.",
      text: "L'IA comprend vraiment mes émotions. Révolutionnaire.",
      rating: 5,
      badge: "Thérapeute partenaire"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-calm">
      {/* Hero Main */}
      <section className="container mx-auto px-4 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge className="bg-gradient-primary text-primary-foreground border-0">
                ✨ Plateforme #1 de bien-être émotionnel
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Prenez soin de votre 
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  {" "}santé mentale
                </span>
                <br />
                avec l'IA
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed">
                EmotionsCare combine intelligence artificielle et accompagnement humain 
                pour vous aider à mieux comprendre et gérer vos émotions au quotidien.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-primary text-primary-foreground border-0 shadow-glow hover:scale-105 transition-transform"
                asChild
              >
                <Link to={user ? "/dashboard" : "/auth"}>
                  {user ? "Accéder au tableau de bord" : "Commencer gratuitement"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-primary/20 hover:border-primary/40"
                asChild
              >
                <Link to={user ? "/chat" : "/auth"}>
                  <Video className="mr-2 h-5 w-5" />
                  {user ? "Essayer l'IA" : "Voir la démo"}
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 pt-4">
              {[
                { number: "50K+", label: "Utilisateurs actifs" },
                { number: "95%", label: "Satisfaction" },
                { number: "24/7", label: "Support IA" }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="text-2xl font-bold text-primary">{stat.number}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Interactive Demo */}
          <div className="relative">
            <Card className="border-0 shadow-heal bg-background/95 backdrop-blur">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <div className="h-3 w-3 bg-gradient-secondary rounded-full animate-pulse-soft"></div>
                    <p className="text-sm text-muted-foreground">IA en écoute...</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-sm">"Je me sens un peu anxieux aujourd'hui..."</p>
                    </div>
                    
                    <div className="bg-gradient-primary/10 rounded-lg p-4 border border-primary/20">
                      <div className="flex items-start space-x-3">
                        <Brain className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-primary">Emma IA</p>
                          <p className="text-sm text-muted-foreground">
                            Je comprends ton sentiment. Veux-tu essayer une technique de respiration 
                            apaisante ? Je peux aussi te proposer une méditation de 5 minutes.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="text-xs">
                      🫁 Respiration
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs">
                      🧘‍♀️ Méditation
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs">
                      💭 Parler plus
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 animate-float">
              <div className="bg-gradient-healing p-3 rounded-full shadow-heal">
                <Heart className="h-6 w-6 text-accent-foreground" />
              </div>
            </div>
            
            <div className="absolute -bottom-4 -left-4 animate-float" style={{ animationDelay: '2s' }}>
              <div className="bg-gradient-secondary p-3 rounded-full shadow-soft">
                <MessageCircle className="h-6 w-6 text-secondary-foreground" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center space-y-4 mb-12">
          <Badge variant="outline" className="border-primary/20">
            Fonctionnalités principales
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold">
            Tout ce dont vous avez besoin pour votre bien-être
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="border-0 shadow-soft hover:shadow-glow transition-all duration-300 group hover:scale-105">
                <CardContent className="p-6 text-center space-y-4">
                  <div className={`${feature.color} p-3 rounded-full w-fit mx-auto group-hover:scale-110 transition-transform`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ils nous font confiance
          </h2>
          <p className="text-muted-foreground">
            Des milliers d'utilisateurs ont transformé leur bien-être avec EmotionsCare
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 shadow-soft">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-foreground">{testimonial.text}</p>
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{testimonial.name}</p>
                    <Badge variant="outline">{testimonial.badge}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="border-0 shadow-heal bg-gradient-primary text-primary-foreground">
          <CardContent className="p-12 text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Prêt à transformer votre bien-être ?
            </h2>
            <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
              Rejoignez des milliers d'utilisateurs qui ont déjà amélioré leur santé mentale 
              grâce à nos outils innovants d'IA thérapeutique.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary"
                className="bg-white text-primary hover:bg-white/90"
                asChild
              >
                <Link to={user ? "/dashboard" : "/auth"}>
                  <CheckCircle className="mr-2 h-5 w-5" />
                  {user ? "Aller au tableau de bord" : "Commencer maintenant - Gratuit"}
                </Link>
              </Button>
              
              <Button 
                size="lg" 
                variant="outline"
                className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
                asChild
              >
                <Link to={user ? "/therapy" : "/auth"}>
                  Parler à un expert
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default HeroSection;