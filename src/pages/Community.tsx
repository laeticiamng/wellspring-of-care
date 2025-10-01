import { useEffect } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCommunity } from '@/hooks/useCommunity';
import { useImplicitTracking } from '@/hooks/useImplicitTracking';
import { HouseAvatar } from '@/components/HouseAvatar';
import { ComposeCard } from '@/components/ComposeCard';
import { VillageFeed } from '@/components/VillageFeed';
import { toast } from 'sonner';

const Community = () => {
  const { user } = useAuth();
  const { posts, houseState, empathyTemplates, createPost, addComment, refetchHouseState } = useCommunity();
  const { track } = useImplicitTracking();

  useEffect(() => {
    // Track page view
    track({
      instrument: 'navigation',
      item_id: 'community_village',
      proxy: 'completion',
      value: 1,
      context: { surface: 'community' }
    });
  }, []);

  const handleCreatePost = async (content: string) => {
    const success = await createPost('', content);
    if (success) {
      await refetchHouseState();
      toast.success('Maison illuminée +1 ✨', {
        description: 'Ta lumière brille dans le Village',
        duration: 2000,
      });
      
      track({
        instrument: 'engagement',
        item_id: 'community_post',
        proxy: 'completion',
        value: 1,
        context: { surface: 'community' }
      });
    }
    return success;
  };

  const handleAddComment = async (postId: string, content: string, isEmpathy: boolean) => {
    const success = await addComment(postId, content, isEmpathy);
    if (success) {
      track({
        instrument: 'empathy',
        item_id: postId,
        proxy: 'choice',
        value: isEmpathy ? 'template_used' : 'custom_response',
        context: { surface: 'community' }
      });
    }
    return success;
  };

  // Stats du Village
  const totalPosts = posts.length;
  const totalInteractions = posts.reduce((sum, p) => sum + (p.reply_count || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/20 to-accent/5">
      <Header />
      
      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* Header Section - Village Bienveillant */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Sparkles className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Le Village Bienveillant
                </h1>
                <p className="text-muted-foreground">
                  Chaque message allume une maison ✨
                </p>
              </div>
            </div>
            
            {user && (
              <HouseAvatar 
                lightIntensity={houseState?.light_intensity || 0} 
                size="lg"
                showLabel
              />
            )}
          </div>
        </div>

        {/* Stats du Village */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card className="border-primary/20 bg-gradient-to-br from-background/95 to-primary/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lumières allumées</CardTitle>
              <Sparkles className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPosts}</div>
              <p className="text-xs text-muted-foreground">Messages partagés</p>
            </CardContent>
          </Card>
          
          <Card className="border-accent/20 bg-gradient-to-br from-background/95 to-accent/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Écoutes bienveillantes</CardTitle>
              <Users className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalInteractions}</div>
              <p className="text-xs text-muted-foreground">Réponses empathiques</p>
            </CardContent>
          </Card>
          
          <Card className="border-primary/20 bg-gradient-to-br from-background/95 to-secondary/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ta progression</CardTitle>
              <Sparkles className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{houseState?.acts_of_care || 0}</div>
              <p className="text-xs text-muted-foreground">Actes de douceur</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Main Content - La Place du Village */}
          <div className="md:col-span-2 space-y-6">
            {/* Composer une nouvelle lumière */}
            <ComposeCard 
              empathyTemplates={empathyTemplates}
              onPost={handleCreatePost}
            />

            {/* Feed du Village */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  La Place du Village
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Les messages sans réponse en premier — à aider ✨
                </p>
              </CardHeader>
              <CardContent>
                <VillageFeed 
                  posts={posts}
                  empathyTemplates={empathyTemplates}
                  onReply={handleAddComment}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Ressources & Infos */}
          <div className="space-y-6">
            {/* Ressources d'urgence */}
            <Card className="border-destructive/20 bg-gradient-to-br from-background/95 to-destructive/5">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <span className="text-lg">🆘</span>
                  Ressources d'urgence
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold">Suicide Écoute</p>
                  <p className="text-muted-foreground">01 45 39 40 00 (24/7)</p>
                </div>
                <div>
                  <p className="font-semibold">SOS Amitié</p>
                  <p className="text-muted-foreground">09 72 39 40 50 (24/7)</p>
                </div>
                <div>
                  <p className="font-semibold">Fil Santé Jeunes</p>
                  <p className="text-muted-foreground">0 800 235 236</p>
                </div>
              </CardContent>
            </Card>

            {/* Charte du Village */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <span className="text-lg">📜</span>
                  Charte du Village
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>✨ Écoute bienveillante avant tout</p>
                <p>🤍 Respect absolu de chacun</p>
                <p>🌿 Pas de jugement, uniquement du soutien</p>
                <p>💙 Confidentialité respectée</p>
                <p>🫂 Entraide et empathie</p>
              </CardContent>
            </Card>

            {/* Prochains Cocons */}
            <Card className="border-accent/20 bg-gradient-to-br from-background/95 to-accent/5">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <span className="text-lg">🕊️</span>
                  Prochains Cocons
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="p-3 rounded-lg bg-background/50 border border-border/50">
                  <p className="font-semibold">Écoute 2 min</p>
                  <p className="text-xs text-muted-foreground">Demain, 19h — 2 places</p>
                </div>
                <div className="p-3 rounded-lg bg-background/50 border border-border/50">
                  <p className="font-semibold">Silence partagé</p>
                  <p className="text-xs text-muted-foreground">Vendredi, 20h — 3 places</p>
                </div>
                <p className="text-xs text-center text-muted-foreground pt-2">
                  Bientôt disponible 🌙
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
