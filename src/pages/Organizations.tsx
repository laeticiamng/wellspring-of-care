import { useState } from "react";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Building2, 
  Users, 
  TrendingUp, 
  Heart,
  Plus,
  Settings,
  BarChart3,
  Calendar
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const Organizations = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const organizations = [
    {
      id: 1,
      name: "TechCorp France",
      members: 45,
      plan: "Enterprise",
      wellness_score: 85,
      active_sessions: 12
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-calm">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">
              Organisations B2B
            </h1>
            <p className="text-muted-foreground">
              Gérez le bien-être de vos équipes
            </p>
          </div>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary text-primary-foreground">
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle organisation
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Créer une organisation</DialogTitle>
                <DialogDescription>
                  Configurez votre espace de bien-être pour votre entreprise
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="org-name">Nom de l'organisation</Label>
                  <Input id="org-name" placeholder="Ex: TechCorp France" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="org-size">Nombre d'employés</Label>
                  <Input id="org-size" type="number" placeholder="Ex: 100" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="org-industry">Secteur d'activité</Label>
                  <Input id="org-industry" placeholder="Ex: Technologie" />
                </div>
                <Button className="w-full bg-gradient-secondary">
                  Créer l'organisation
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { icon: Users, label: "Employés actifs", value: "156", change: "+12%" },
            { icon: Heart, label: "Score de bien-être", value: "85/100", change: "+5pts" },
            { icon: TrendingUp, label: "Engagement", value: "92%", change: "+8%" },
            { icon: Calendar, label: "Sessions ce mois", value: "342", change: "+15%" }
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="border-0 shadow-soft">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-gradient-primary/10 p-3 rounded-full">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <Badge variant="outline" className="text-xs text-green-600 border-green-200">
                      {stat.change}
                    </Badge>
                  </div>
                  <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Organizations List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Vos organisations</h2>
          
          {organizations.map((org) => (
            <Card key={org.id} className="border-0 shadow-soft hover:shadow-glow transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-gradient-primary p-4 rounded-lg">
                      <Building2 className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-1">{org.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {org.members} membres
                        </span>
                        <Badge className="bg-gradient-secondary text-secondary-foreground">
                          {org.plan}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right mr-6">
                      <p className="text-sm text-muted-foreground mb-1">Score de bien-être</p>
                      <p className="text-2xl font-bold text-primary">{org.wellness_score}%</p>
                    </div>
                    <Button variant="outline" size="icon">
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button className="bg-gradient-primary">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Analytics
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Team Wellness Dashboard */}
        <Card className="border-0 shadow-soft">
          <CardHeader>
            <CardTitle>Dashboard de bien-être d'équipe</CardTitle>
            <CardDescription>
              Visualisez l'état émotionnel global de vos équipes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Stress</span>
                  <span className="text-sm text-muted-foreground">Faible</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: '30%' }} />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Engagement</span>
                  <span className="text-sm text-muted-foreground">Élevé</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-primary" style={{ width: '92%' }} />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Satisfaction</span>
                  <span className="text-sm text-muted-foreground">Très élevée</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-healing" style={{ width: '88%' }} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing Plans for B2B */}
        <Card className="border-0 shadow-soft bg-gradient-primary/5">
          <CardHeader>
            <CardTitle>Plans entreprise</CardTitle>
            <CardDescription>
              Choisissez le plan adapté à la taille de votre organisation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  name: "Starter",
                  price: "49€",
                  period: "/mois",
                  users: "Jusqu'à 50 utilisateurs",
                  features: ["Dashboard basique", "Chat IA", "Support email"]
                },
                {
                  name: "Professional",
                  price: "149€",
                  period: "/mois",
                  users: "Jusqu'à 200 utilisateurs",
                  features: ["Tout Starter", "Analytics avancés", "API access", "Support prioritaire"],
                  popular: true
                },
                {
                  name: "Enterprise",
                  price: "Sur mesure",
                  period: "",
                  users: "Utilisateurs illimités",
                  features: ["Tout Professional", "Onboarding dédié", "Account manager", "SLA garanti"]
                }
              ].map((plan, index) => (
                <Card key={index} className={`border-0 ${plan.popular ? 'ring-2 ring-primary shadow-glow' : 'shadow-soft'}`}>
                  <CardContent className="p-6">
                    {plan.popular && (
                      <Badge className="bg-gradient-primary text-primary-foreground mb-4">
                        Populaire
                      </Badge>
                    )}
                    <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                    <div className="mb-4">
                      <span className="text-3xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground">{plan.period}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-6">{plan.users}</p>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm">
                          <Heart className="h-4 w-4 text-primary mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button className={`w-full ${plan.popular ? 'bg-gradient-primary' : 'bg-gradient-secondary'}`}>
                      Choisir ce plan
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Organizations;
