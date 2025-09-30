import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Video, 
  Calendar, 
  Clock,
  Star,
  MapPin,
  Award,
  MessageCircle,
  Heart,
  Brain,
  Users,
  CheckCircle,
  Phone
} from "lucide-react";
import { useTherapy } from "@/hooks/useTherapy";
import { useState } from "react";
import { toast } from "sonner";

const Therapy = () => {
  const { therapists, sessions, loading, bookSession, cancelSession } = useTherapy();
  const [bookingTherapist, setBookingTherapist] = useState<string | null>(null);

  const handleBookSession = async (therapistId: string) => {
    setBookingTherapist(therapistId);
    const scheduledAt = new Date();
    scheduledAt.setDate(scheduledAt.getDate() + 1); // Tomorrow
    scheduledAt.setHours(14, 0, 0, 0); // 14:00
    
    const success = await bookSession(therapistId, scheduledAt);
    if (success) {
      toast.success("Session réservée avec succès !");
    } else {
      toast.error("Erreur lors de la réservation");
    }
    setBookingTherapist(null);
  };

  const handleCancelSession = async (sessionId: string) => {
    const success = await cancelSession(sessionId);
    if (success) {
      toast.success("Session annulée");
    } else {
      toast.error("Erreur lors de l'annulation");
    }
  };

  const therapists_fallback = [
    {
      id: 1,
      name: "Dr. Sarah Lopez",
      title: "Psychologue clinicienne",
      specialties: ["Anxiété", "Dépression", "Thérapie cognitive"],
      rating: 4.9,
      reviewsCount: 127,
      experience: "8 ans",
      languages: ["Français", "Anglais", "Espagnol"],
      price: "€80/session",
      nextAvailable: "Demain 14:00",
      image: "/api/placeholder/80/80",
      verified: true,
      description: "Spécialisée dans les troubles anxieux et la thérapie cognitive-comportementale.",
      sessionTypes: ["Individuel", "Couple", "En ligne"]
    },
    {
      id: 2,
      name: "Marc Dubois",
      title: "Thérapeute EMDR",
      specialties: ["Trauma", "EMDR", "Stress post-traumatique"],
      rating: 4.8,
      reviewsCount: 89,
      experience: "12 ans",
      languages: ["Français"],
      price: "€90/session",
      nextAvailable: "Jeudi 16:30",
      image: "/api/placeholder/80/80",
      verified: true,
      description: "Expert en thérapie EMDR pour le traitement des traumatismes.",
      sessionTypes: ["Individuel", "En ligne"]
    },
    {
      id: 3,
      name: "Emma Wilson",
      title: "Coach en bien-être",
      specialties: ["Méditation", "Mindfulness", "Gestion du stress"],
      rating: 4.9,
      reviewsCount: 156,
      experience: "6 ans",
      languages: ["Français", "Anglais"],
      price: "€60/session",
      nextAvailable: "Aujourd'hui 18:00",
      image: "/api/placeholder/80/80",
      verified: true,
      description: "Accompagnement en pleine conscience et techniques de relaxation.",
      sessionTypes: ["Individuel", "Groupe", "En ligne"]
    }
  ];


  const therapyTypes = [
    {
      icon: Brain,
      title: "Thérapie cognitive",
      description: "Modifiez les pensées négatives",
      color: "bg-gradient-primary"
    },
    {
      icon: Heart,
      title: "Thérapie émotionnelle",
      description: "Explorez et gérez vos émotions",
      color: "bg-gradient-secondary"
    },
    {
      icon: Users,
      title: "Thérapie de couple",
      description: "Renforcez votre relation",
      color: "bg-gradient-healing"
    },
    {
      icon: Video,
      title: "Thérapie en ligne",
      description: "Consultations à distance",
      color: "bg-secondary"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-calm">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold flex items-center justify-center space-x-3">
            <Video className="h-10 w-10 text-primary" />
            <span>Thérapie Professionnelle</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Consultez des thérapeutes certifiés depuis chez vous ou en cabinet. 
            Première consultation gratuite pour tous les nouveaux membres.
          </p>
        </div>

        {/* Promo Banner */}
        <Card className="border-0 shadow-soft bg-gradient-primary text-primary-foreground">
          <CardContent className="p-6 text-center space-y-4">
            <h2 className="text-2xl font-bold">🎉 Offre spéciale nouveau membre</h2>
            <p className="text-primary-foreground/90">
              Votre première consultation de 45 minutes est offerte. 
              Commencez votre parcours thérapeutique dès aujourd'hui !
            </p>
            <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
              <CheckCircle className="mr-2 h-5 w-5" />
              Réserver ma consultation gratuite
            </Button>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Therapy Types */}
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle>Types de thérapies disponibles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {therapyTypes.map((type, index) => {
                    const Icon = type.icon;
                    return (
                      <div key={index} className="p-4 rounded-lg border border-border/50 hover:border-primary/20 transition-colors group">
                        <div className="flex items-center space-x-3">
                          <div className={`${type.color} p-3 rounded-full group-hover:scale-110 transition-transform`}>
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-medium">{type.title}</h3>
                            <p className="text-sm text-muted-foreground">{type.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Therapists */}
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Nos thérapeutes certifiés</span>
                  <Button variant="outline">
                    Voir tous les profils
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {loading ? (
                  <p className="text-center text-muted-foreground">Chargement...</p>
                ) : therapists.length === 0 ? (
                  <p className="text-center text-muted-foreground">Aucun thérapeute disponible</p>
                ) : (
                  therapists.map((therapist) => (
                    <div key={therapist.id} className="p-6 rounded-lg border border-border/50 hover:border-primary/20 transition-colors space-y-4">
                      {/* Therapist Header */}
                      <div className="flex items-start space-x-4">
                        <Avatar className="h-20 w-20 ring-2 ring-primary/20">
                          <AvatarImage src={therapist.avatar_url || undefined} alt={therapist.full_name} />
                          <AvatarFallback>{therapist.full_name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center space-x-2">
                                <h3 className="text-lg font-semibold">{therapist.full_name}</h3>
                                {therapist.available && (
                                  <Badge className="bg-gradient-secondary text-secondary-foreground">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Disponible
                                  </Badge>
                                )}
                              </div>
                              <p className="text-muted-foreground">{therapist.specialization}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-semibold text-primary">€{therapist.price_per_session}</p>
                              <p className="text-sm text-muted-foreground">par session</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 fill-primary text-primary" />
                              <span className="font-medium">{therapist.rating}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <span className="text-sm text-muted-foreground">
                                {therapist.languages?.join(", ") || "Français"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Description */}
                      <p className="text-sm text-muted-foreground">{therapist.bio}</p>
                      
                      {/* Actions */}
                      <div className="flex space-x-3">
                        <Button 
                          className="bg-gradient-primary text-primary-foreground border-0 shadow-glow"
                          onClick={() => handleBookSession(therapist.id)}
                          disabled={bookingTherapist === therapist.id}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {bookingTherapist === therapist.id ? "Réservation..." : "Prendre rendez-vous"}
                        </Button>
                        <Button variant="outline">
                          <MessageCircle className="mr-2 h-4 w-4" />
                          Contacter
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Sessions */}
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span>Mes prochaines sessions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <p className="text-sm text-muted-foreground">Chargement...</p>
                ) : sessions.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Aucune session prévue</p>
                ) : (
                  sessions.map((session) => {
                    const therapist = therapists.find(t => t.id === session.therapist_id);
                    return (
                      <div key={session.id} className="space-y-3 p-4 rounded-lg border border-border/50">
                        <div className="flex items-center justify-between">
                          <Badge 
                            variant={session.status === "scheduled" ? "default" : "outline"}
                            className={session.status === "scheduled" ? "bg-gradient-secondary text-secondary-foreground" : ""}
                          >
                            {session.status === "scheduled" ? "Confirmé" : session.status === "completed" ? "Terminé" : "Annulé"}
                          </Badge>
                          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                            <Video className="h-3 w-3" />
                            <span>En ligne</span>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-sm">Thérapie individuelle</h4>
                          <p className="text-sm text-muted-foreground">{therapist?.full_name || "Thérapeute"}</p>
                        </div>
                        
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(session.scheduled_at).toLocaleDateString('fr-FR')}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-3 w-3" />
                            <span>{new Date(session.scheduled_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} ({session.duration_minutes} min)</span>
                          </div>
                        </div>
                        
                        {session.notes && (
                          <p className="text-xs text-muted-foreground bg-muted/30 p-2 rounded">
                            {session.notes}
                          </p>
                        )}
                        
                        {session.status === "scheduled" && (
                          <div className="flex gap-2">
                            <Button size="sm" className="flex-1 bg-gradient-primary text-primary-foreground border-0">
                              Rejoindre
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex-1"
                              onClick={() => handleCancelSession(session.id)}
                            >
                              Annuler
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>

            {/* Emergency Support */}
            <Card className="border-0 shadow-soft bg-gradient-healing/10 border border-accent/20">
              <CardHeader>
                <CardTitle className="text-accent">🆘 Support d'urgence</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  En cas de crise ou de pensées suicidaires, contactez immédiatement :
                </p>
                
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-destructive/20 hover:bg-destructive/10"
                  >
                    <Phone className="mr-2 h-4 w-4 text-destructive" />
                    <div className="text-left">
                      <p className="font-medium">SAMU : 15</p>
                      <p className="text-xs text-muted-foreground">Urgences médicales</p>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-primary/20 hover:bg-primary/10"
                  >
                    <MessageCircle className="mr-2 h-4 w-4 text-primary" />
                    <div className="text-left">
                      <p className="font-medium">SOS Amitié</p>
                      <p className="text-xs text-muted-foreground">Écoute 24h/24</p>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Insurance Info */}
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="text-lg">💳 Prise en charge</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="space-y-2">
                  <p className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-secondary" />
                    <span>Remboursement Sécurité Sociale (psychologues)</span>
                  </p>
                  <p className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-secondary" />
                    <span>Prise en charge mutuelles</span>
                  </p>
                  <p className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-secondary" />
                    <span>Paiement en plusieurs fois</span>
                  </p>
                  <p className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-secondary" />
                    <span>Première consultation gratuite</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Therapy;