import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { 
  Users, 
  MessageCircle, 
  Heart, 
  Plus,
  Calendar,
  MapPin,
  Clock,
  Star,
  ThumbsUp,
  Share2,
  UserPlus
} from "lucide-react";
import { useCommunity } from "@/hooks/useCommunity";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const Community = () => {
  const { user } = useAuth();
  const { groups, posts, loading, joinGroup, createPost, addComment } = useCommunity();
  const [newPostContent, setNewPostContent] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [commentContent, setCommentContent] = useState<{ [key: string]: string }>({});

  const handleJoinGroup = async (groupId: string) => {
    const success = await joinGroup(groupId);
    if (success) {
      toast.success("Groupe rejoint avec succès !");
    } else {
      toast.error("Erreur lors de l'adhésion au groupe");
    }
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) {
      toast.error("Veuillez écrire un message");
      return;
    }
    
    const success = await createPost("Message de la communauté", newPostContent, selectedGroup);
    if (success) {
      toast.success("Message publié !");
      setNewPostContent("");
    } else {
      toast.error("Erreur lors de la publication");
    }
  };

  const handleAddComment = async (postId: string) => {
    const content = commentContent[postId];
    if (!content?.trim()) {
      toast.error("Veuillez écrire un commentaire");
      return;
    }
    
    const success = await addComment(postId, content);
    if (success) {
      toast.success("Commentaire ajouté !");
      setCommentContent({ ...commentContent, [postId]: "" });
    } else {
      toast.error("Erreur lors de l'ajout du commentaire");
    }
  };

  const communityGroups_fallback = [
    {
      id: 1,
      name: "Gestion de l'anxiété",
      description: "Partagez vos techniques pour surmonter l'anxiété au quotidien",
      members: 1247,
      posts: 156,
      category: "Support",
      lastActivity: "Il y a 2h",
      trending: true,
      icon: "🧘‍♀️"
    },
    {
      id: 2,
      name: "Méditation débutants",
      description: "Groupe d'entraide pour ceux qui commencent la méditation",
      members: 892,
      posts: 89,
      category: "Méditation",
      lastActivity: "Il y a 4h",
      trending: false,
      icon: "🌸"
    },
    {
      id: 3,
      name: "Parents épanouis",
      description: "Soutien et conseils pour un parentage bienveillant",
      members: 654,
      posts: 234,
      category: "Famille",
      lastActivity: "Il y a 1h",
      trending: true,
      icon: "👨‍👩‍👧‍👦"
    },
    {
      id: 4,
      name: "Bien-être au travail",
      description: "Gérer le stress professionnel et trouver l'équilibre",
      members: 432,
      posts: 67,
      category: "Professionnel",
      lastActivity: "Il y a 6h",
      trending: false,
      icon: "💼"
    }
  ];

  const recentPosts = [
    {
      id: 1,
      author: {
        name: "Marie L.",
        avatar: "/api/placeholder/40/40",
        badge: "Membre actif"
      },
      group: "Gestion de l'anxiété",
      content: "Aujourd'hui j'ai réussi à gérer une crise d'angoisse grâce aux techniques de respiration qu'on a partagées ici. Merci à tous pour votre soutien ! 💙",
      timestamp: "Il y a 3h",
      likes: 24,
      comments: 8,
      tags: ["victoire", "respiration"]
    },
    {
      id: 2,
      author: {
        name: "Pierre M.",
        avatar: "/api/placeholder/40/40",
        badge: "Nouveau membre"
      },
      group: "Méditation débutants",
      content: "Première semaine de méditation terminée ! C'est difficile de rester concentré mais je sens déjà une différence dans mon sommeil. Des conseils pour maintenir la motivation ?",
      timestamp: "Il y a 5h",
      likes: 12,
      comments: 15,
      tags: ["débutant", "sommeil"]
    },
    {
      id: 3,
      author: {
        name: "Sarah K.",
        avatar: "/api/placeholder/40/40",
        badge: "Modérateur"
      },
      group: "Parents épanouis",
      content: "Rappel bienveillant : être parent parfait n'existe pas. Nous faisons tous de notre mieux et c'est déjà énorme. Vous êtes formidables ! 🌟",
      timestamp: "Il y a 1j",
      likes: 45,
      comments: 22,
      tags: ["encouragement", "bienveillance"]
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: "Cercle de parole - Anxiété",
      date: "Demain",
      time: "19:00",
      duration: "1h30",
      participants: 12,
      maxParticipants: 15,
      facilitator: "Dr. Emma Wilson",
      type: "En ligne",
      category: "Support"
    },
    {
      id: 2,
      title: "Méditation collective",
      date: "Vendredi",
      time: "18:30",
      duration: "45 min",
      participants: 28,
      maxParticipants: 30,
      facilitator: "Marc Dubois",
      type: "En ligne",
      category: "Méditation"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-calm">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold flex items-center justify-center space-x-3">
            <Users className="h-10 w-10 text-primary" />
            <span>Communauté EmotionsCare</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Rejoignez une communauté bienveillante de personnes qui partagent 
            leur parcours vers un meilleur bien-être émotionnel
          </p>
        </div>

        {/* Stats */}
        <Card className="border-0 shadow-soft bg-gradient-primary/5 border border-primary/10">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-primary">15,234</div>
                <p className="text-sm text-muted-foreground">Membres actifs</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-secondary">4,567</div>
                <p className="text-sm text-muted-foreground">Messages aujourd'hui</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-accent">89</div>
                <p className="text-sm text-muted-foreground">Groupes de soutien</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">24/7</div>
                <p className="text-sm text-muted-foreground">Support disponible</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Groups */}
            <Card className="border-0 shadow-soft">
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span>Groupes de soutien</span>
                </CardTitle>
                <Button className="bg-gradient-primary text-primary-foreground border-0 shadow-glow">
                  <Plus className="mr-2 h-4 w-4" />
                  Créer un groupe
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <p className="text-center text-muted-foreground">Chargement...</p>
                ) : groups.length === 0 ? (
                  <p className="text-center text-muted-foreground">Aucun groupe disponible</p>
                ) : (
                  groups.map((group) => (
                    <div key={group.id} className="p-4 rounded-lg border border-border/50 hover:border-primary/20 transition-colors group">
                      <div className="flex items-start space-x-4">
                        <div className="text-3xl group-hover:scale-110 transition-transform">
                          {group.icon}
                        </div>
                        
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold">{group.name}</h3>
                            <Badge variant="outline">{group.member_count} membres</Badge>
                          </div>
                          
                          <p className="text-sm text-muted-foreground">{group.description}</p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <span className="flex items-center space-x-1">
                                <Users className="h-3 w-3" />
                                <span>{group.member_count}</span>
                              </span>
                            </div>
                            
                            <Button size="sm" variant="outline" onClick={() => handleJoinGroup(group.id)}>
                              <UserPlus className="mr-1 h-3 w-3" />
                              Rejoindre
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* New Post */}
            {user && (
              <Card className="border-0 shadow-soft">
                <CardContent className="pt-6 space-y-4">
                  <Textarea
                    placeholder="Partagez votre expérience avec la communauté..."
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <Button onClick={handleCreatePost} className="bg-gradient-primary">
                    <Plus className="mr-2 h-4 w-4" />
                    Publier
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Recent Posts */}
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  <span>Messages récents</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <p className="text-center text-muted-foreground">Chargement...</p>
                ) : posts.length === 0 ? (
                  <p className="text-center text-muted-foreground">Aucun message pour le moment</p>
                ) : (
                  posts.map((post) => {
                    const group = groups.find(g => g.id === post.group_id);
                    return (
                      <div key={post.id} className="space-y-3 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                        {/* Post Header */}
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{user?.email?.split('@')[0] || "Membre"}</span>
                              {group && (
                                <>
                                  <span className="text-xs text-muted-foreground">dans</span>
                                  <Badge className="text-xs bg-gradient-primary text-primary-foreground">
                                    {group.name}
                                  </Badge>
                                </>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {new Date(post.created_at).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                        </div>
                        
                        {/* Post Content */}
                        <div>
                          <h4 className="font-medium text-sm mb-1">{post.title}</h4>
                          <p className="text-sm leading-relaxed">{post.content}</p>
                        </div>
                        
                        {/* Post Actions */}
                        <div className="flex items-center space-x-4">
                          <Button size="sm" variant="ghost" className="text-xs">
                            <ThumbsUp className="mr-1 h-3 w-3" />
                            {post.likes_count}
                          </Button>
                          <Button size="sm" variant="ghost" className="text-xs">
                            <MessageCircle className="mr-1 h-3 w-3" />
                            {post.comments_count}
                          </Button>
                        </div>

                        {/* Comment Section */}
                        {user && (
                          <div className="pt-3 border-t space-y-2">
                            <Textarea
                              placeholder="Ajouter un commentaire..."
                              value={commentContent[post.id] || ""}
                              onChange={(e) => setCommentContent({ ...commentContent, [post.id]: e.target.value })}
                              className="min-h-[60px] text-sm"
                            />
                            <Button size="sm" onClick={() => handleAddComment(post.id)}>
                              Commenter
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Events */}
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span>Événements à venir</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="space-y-3 p-4 rounded-lg border border-border/50 hover:border-primary/20 transition-colors">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge className="bg-gradient-healing text-accent-foreground">
                          {event.category}
                        </Badge>
                        <Badge variant="outline">{event.type}</Badge>
                      </div>
                      
                      <h4 className="font-medium">{event.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        Animé par {event.facilitator}
                      </p>
                    </div>
                    
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-3 w-3" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-3 w-3" />
                        <span>{event.time} ({event.duration})</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-3 w-3" />
                        <span>{event.participants}/{event.maxParticipants} participants</span>
                      </div>
                    </div>
                    
                    <Button size="sm" className="w-full bg-gradient-primary text-primary-foreground border-0">
                      Participer
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Community Guidelines */}
            <Card className="border-0 shadow-soft bg-gradient-healing/10 border border-accent/20">
              <CardHeader>
                <CardTitle className="text-accent">🤝 Règles de la communauté</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="space-y-2">
                  <p className="flex items-center space-x-2">
                    <Heart className="h-3 w-3 text-accent" />
                    <span>Bienveillance et respect mutuel</span>
                  </p>
                  <p className="flex items-center space-x-2">
                    <Star className="h-3 w-3 text-accent" />
                    <span>Partage constructif d'expériences</span>
                  </p>
                  <p className="flex items-center space-x-2">
                    <Users className="h-3 w-3 text-accent" />
                    <span>Soutien sans jugement</span>
                  </p>
                  <p className="flex items-center space-x-2">
                    <MessageCircle className="h-3 w-3 text-accent" />
                    <span>Confidentialité respectée</span>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Support Resources */}
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle>🆘 Ressources d'urgence</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Si vous traversez une crise, n'hésitez pas à contacter :
                </p>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="font-medium">SOS Amitié</p>
                    <p className="text-muted-foreground">09 72 39 40 50</p>
                  </div>
                  <div>
                    <p className="font-medium">Suicide Écoute</p>
                    <p className="text-muted-foreground">01 45 39 40 00</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="w-full">
                  Plus de ressources
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Community;