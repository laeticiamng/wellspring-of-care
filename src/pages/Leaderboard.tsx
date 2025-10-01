import { useState, useEffect } from 'react';
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { SkyScene } from "@/components/SkyScene";
import { AuraGallery } from "@/components/AuraGallery";
import { useAuras } from "@/hooks/useAuras";
import { useAuth } from "@/contexts/AuthContext";
import { useImplicitTracking } from "@/hooks/useImplicitTracking";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Users, Eye, History } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Badge } from '@/components/ui/badge';

const Leaderboard = () => {
  const { user } = useAuth();
  const { 
    userAura, 
    isLoadingAura, 
    communityAuras, 
    isLoadingCommunity,
    auraHistory,
    isLoadingHistory,
    rareCatalog,
  } = useAuras();
  const { track } = useImplicitTracking();
  
  const [viewMode, setViewMode] = useState<'personal' | 'community'>('personal');
  const [showGallery, setShowGallery] = useState(false);

  useEffect(() => {
    // Track page view
    track({
      instrument: 'navigation',
      item_id: 'aura_sky',
      proxy: 'completion',
      value: 1,
      context: { surface: 'leaderboard', view: viewMode }
    });
  }, [viewMode]);

  const handleToggleView = () => {
    const newMode = viewMode === 'personal' ? 'community' : 'personal';
    setViewMode(newMode);
    
    toast.success(
      newMode === 'community' 
        ? 'Vue collective activée 🌌' 
        : 'Vue personnelle activée ✨',
      { duration: 2000 }
    );
    
    track({
      instrument: 'interaction',
      item_id: 'toggle_view',
      proxy: 'choice',
      value: newMode,
      context: { surface: 'leaderboard' }
    });
  };

  if (isLoadingAura) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#1a1a2e] to-[#16213e] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-20 h-20 rounded-full bg-gradient-to-r from-primary to-accent opacity-50"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {!showGallery ? (
        <div className="relative h-[calc(100vh-4rem)]">
          {/* Controls overlay */}
          <div className="absolute top-4 right-4 z-20 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleView}
              className="bg-background/80 backdrop-blur border-primary/20"
            >
              {viewMode === 'personal' ? (
                <>
                  <Users className="w-4 h-4 mr-2" />
                  Vue Collective
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  Mon Aura
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowGallery(true)}
              className="bg-background/80 backdrop-blur border-accent/20"
            >
              <History className="w-4 h-4 mr-2" />
              Galerie
            </Button>
          </div>

          {/* Sky Scene */}
          <SkyScene
            userAura={userAura}
            communityAuras={viewMode === 'community' ? communityAuras : undefined}
            mode={viewMode}
            onAuraClick={() => {
              if (userAura?.is_rare) {
                toast.success(`Aura ${userAura.rare_type} débloquée ! ✨`, {
                  description: rareCatalog?.find(r => r.aura_type === userAura.rare_type)?.description,
                });
              }
            }}
          />

          {/* Rare auras progress */}
          {viewMode === 'personal' && rareCatalog && rareCatalog.length > 0 && (
            <motion.div
              className="absolute bottom-20 right-4 z-10"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              <Card className="w-64 border-primary/20 bg-background/80 backdrop-blur">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    Auras Rares
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {rareCatalog.slice(0, 4).map((rare) => {
                    const isUnlocked = userAura?.rare_type === rare.aura_type;
                    return (
                      <div
                        key={rare.id}
                        className={`flex items-center justify-between p-2 rounded-lg ${
                          isUnlocked 
                            ? 'bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30' 
                            : 'bg-secondary/20'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{rare.icon}</span>
                          <div>
                            <p className="text-xs font-medium">{rare.name}</p>
                            <p className="text-[10px] text-muted-foreground">{rare.rarity_level}</p>
                          </div>
                        </div>
                        {isUnlocked ? (
                          <Badge variant="outline" className="text-xs">Débloquée</Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">🔒</span>
                        )}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      ) : (
        <div className="container max-w-6xl mx-auto px-4 py-8">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Galerie des Auras
            </h1>
            <Button
              variant="outline"
              onClick={() => setShowGallery(false)}
              className="border-primary/20"
            >
              Retour au Ciel
            </Button>
          </div>
          
          <AuraGallery history={auraHistory || []} />
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
