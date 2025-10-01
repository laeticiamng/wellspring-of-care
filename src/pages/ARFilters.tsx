import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Smile, Sparkles, Award } from "lucide-react";
import { useState, useEffect } from "react";
import { useImplicitTracking } from "@/hooks/useImplicitTracking";
import { useCollections } from "@/hooks/useCollections";
import { MirrorRoom } from "@/components/MirrorRoom";
import { EmotionFilter } from "@/components/EmotionFilter";
import { FilterGallery } from "@/components/FilterGallery";
import BadgeReveal from "@/components/BadgeReveal";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface Filter {
  id: string;
  emoji: string;
  name: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  color: string;
  uses: number;
  maxUses: number;
  unlocked: boolean;
  description: string;
}

const ARFilters = () => {
  const [sessionActive, setSessionActive] = useState(false);
  const [affectLevel, setAffectLevel] = useState(50);
  const [interactions, setInteractions] = useState(0);
  const [activeFilter, setActiveFilter] = useState<Filter | null>(null);
  const [showBadge, setShowBadge] = useState(false);
  const [sessionBadge, setSessionBadge] = useState<any>(null);
  const [showGallery, setShowGallery] = useState(false);
  const { track } = useImplicitTracking();
  const { collections, unlockItem } = useCollections();

  const [filters, setFilters] = useState<Filter[]>([
    { id: 'f1', emoji: '✨', name: 'Étoile Dorée', rarity: 'common', color: 'rgba(251, 191, 36, 0.6)', uses: 0, maxUses: 5, unlocked: true, description: 'Un classique lumineux' },
    { id: 'f2', emoji: '🌸', name: 'Fleur de Joie', rarity: 'common', color: 'rgba(236, 72, 153, 0.6)', uses: 0, maxUses: 5, unlocked: true, description: 'Douceur printanière' },
    { id: 'f3', emoji: '🌟', name: 'Nova Éclatante', rarity: 'rare', color: 'rgba(59, 130, 246, 0.6)', uses: 0, maxUses: 8, unlocked: true, description: 'Explosion cosmique' },
    { id: 'f4', emoji: '💫', name: 'Comète Magique', rarity: 'rare', color: 'rgba(147, 51, 234, 0.6)', uses: 0, maxUses: 8, unlocked: false, description: 'Traverse le ciel' },
    { id: 'f5', emoji: '🌙', name: 'Lune Mystique', rarity: 'epic', color: 'rgba(168, 85, 247, 0.6)', uses: 0, maxUses: 10, unlocked: false, description: 'Pouvoir lunaire' },
    { id: 'f6', emoji: '☀️', name: 'Soleil Radieux', rarity: 'epic', color: 'rgba(251, 146, 60, 0.6)', uses: 0, maxUses: 10, unlocked: false, description: 'Chaleur divine' },
    { id: 'f7', emoji: '🌈', name: 'Arc-en-ciel', rarity: 'legendary', color: 'rgba(244, 114, 182, 0.6)', uses: 0, maxUses: 15, unlocked: false, description: 'Toutes les émotions' },
    { id: 'f8', emoji: '👑', name: 'Couronne Céleste', rarity: 'legendary', color: 'rgba(234, 179, 8, 0.6)', uses: 0, maxUses: 15, unlocked: false, description: 'Royauté émotionnelle' },
  ]);

  // Start session with PANAS-PA tracking
  const startSession = () => {
    setSessionActive(true);
    setInteractions(0);
    setAffectLevel(50);
    
    // Init PANAS-PA implicit tracking
    track({
      instrument: "PANAS",
      item_id: "pa_session_start",
      proxy: "engagement",
      value: "ar_mirror_start",
      context: { session_type: 'mirror_room' }
    });

    // Select random unlocked filter
    const unlockedFilters = filters.filter(f => f.unlocked);
    if (unlockedFilters.length > 0) {
      const randomFilter = unlockedFilters[Math.floor(Math.random() * unlockedFilters.length)];
      setActiveFilter(randomFilter);
    }

    // Play start sound
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  // Handle facial interactions
  const handleInteraction = (type: 'wink' | 'smile' | 'head') => {
    setInteractions(prev => prev + 1);
    
    // Increase affect on positive interactions
    if (type === 'smile' || type === 'wink') {
      setAffectLevel(prev => Math.min(100, prev + 10));
    }

    // Track interaction
    track({
      instrument: "PANAS",
      item_id: "pa_positive",
      proxy: "expression",
      value: type,
      context: { affect_level: String(affectLevel) }
    });

    // Haptic feedback
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(30);
    }

    // Sound feedback
    toast.success(
      type === 'smile' ? '😊 Sourire capté !' :
      type === 'wink' ? '😉 Clin d\'œil magique !' :
      '✨ Mouvement détecté !',
      { duration: 1000 }
    );
  };

  // Complete filter session
  const completeFilterSession = () => {
    if (!activeFilter) return;

    // Update filter uses
    setFilters(prev => prev.map(f => 
      f.id === activeFilter.id 
        ? { ...f, uses: Math.min(f.uses + 1, f.maxUses) }
        : f
    ));

    // Check for unlocks based on interactions
    if (interactions >= 5) {
      const lockedFilters = filters.filter(f => !f.unlocked);
      if (lockedFilters.length > 0) {
        const rarityChance = Math.random();
        let unlockRarity: Filter['rarity'];
        
        if (rarityChance < 0.05) unlockRarity = 'legendary';
        else if (rarityChance < 0.2) unlockRarity = 'epic';
        else if (rarityChance < 0.5) unlockRarity = 'rare';
        else unlockRarity = 'common';

        const candidateFilters = lockedFilters.filter(f => f.rarity === unlockRarity);
        if (candidateFilters.length > 0) {
          const unlockFilter = candidateFilters[0];
          setFilters(prev => prev.map(f =>
            f.id === unlockFilter.id ? { ...f, unlocked: true } : f
          ));
          
          toast.success(`🎉 Nouveau filtre ${unlockRarity} débloqué : ${unlockFilter.name}!`);
        }
      }
    }

    // Generate badge based on affect
    const badge = generateBadge();
    setSessionBadge(badge);
    setShowBadge(true);
    
    // Reset active filter
    setActiveFilter(null);
  };

  // Generate verbal badge
  const generateBadge = () => {
    const rarityRoll = Math.random();
    
    if (affectLevel > 80) {
      return {
        name: interactions > 10 ? "Reflet Lumineux" : "Sourire Capté",
        emoji: "🌞",
        rarity: rarityRoll < 0.1 ? 'legendary' : (rarityRoll < 0.3 ? 'epic' : 'rare'),
        description: "Ton énergie illumine les miroirs magiques ✨"
      };
    } else if (affectLevel > 50) {
      return {
        name: "Énergie Douce",
        emoji: "🌸",
        rarity: rarityRoll < 0.3 ? 'rare' : 'common',
        description: "Les miroirs reflètent ta sérénité"
      };
    } else {
      return {
        name: "Reflet Paisible",
        emoji: "🌙",
        rarity: 'common',
        description: "Continue d'explorer tes émotions"
      };
    }
  };

  // End session
  const endSession = () => {
    // Final tracking
    track({
      instrument: "PANAS",
      item_id: "pa_session_end",
      proxy: "completion",
      value: String(interactions),
      context: { 
        final_affect: String(affectLevel),
        interactions: String(interactions)
      }
    });

    setSessionActive(false);
    setActiveFilter(null);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-black">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <motion.div 
            className="flex items-center justify-center space-x-3"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Camera className="h-12 w-12 text-yellow-400 animate-pulse" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              La Chambre des Reflets
            </h1>
          </motion.div>
          <p className="text-white/70 max-w-2xl mx-auto">
            Salle de miroirs magiques. Un clin d'œil déclenche une pluie d'étoiles, un sourire fait briller ton reflet ✨
          </p>
        </div>

        {/* Main Experience */}
        {!sessionActive ? (
          <Card className="max-w-4xl mx-auto border-0 shadow-glow bg-gradient-to-br from-purple-950/40 to-indigo-950/40 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-6 w-6 text-yellow-400" />
                  <span className="text-white">Prêt à explorer tes reflets ?</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowGallery(!showGallery)}
                  className="text-white/70 hover:text-white"
                >
                  <Award className="h-5 w-5 mr-2" />
                  Ma Collection
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-4 py-12">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-8xl"
                >
                  🪞
                </motion.div>
                <p className="text-white/80 text-lg">
                  Entre dans la salle des miroirs magiques
                </p>
                <p className="text-white/60 text-sm max-w-md mx-auto">
                  Tes expressions faciales activeront des filtres émotionnels qui évoluent avec toi
                </p>
                <Button
                  size="lg"
                  onClick={startSession}
                  className="bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 text-white font-bold hover:scale-105 transition-transform"
                >
                  <Camera className="mr-2 h-5 w-5" />
                  Entrer dans les Miroirs
                </Button>
              </div>

              {/* Collection Preview */}
              {!showGallery && (
                <div className="grid grid-cols-4 gap-3 p-4 rounded-lg bg-white/5">
                  {filters.slice(0, 4).map((filter, i) => (
                    <motion.div
                      key={filter.id}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="text-center"
                    >
                      <div className="text-4xl mb-1 opacity-50">
                        {filter.unlocked ? filter.emoji : '🔒'}
                      </div>
                      <p className="text-xs text-white/50">{filter.unlocked ? filter.name : 'Locked'}</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="max-w-6xl mx-auto border-0 shadow-2xl overflow-hidden">
            <CardContent className="p-0">
              {/* Mirror Room Scene */}
              <div className="relative aspect-video bg-black">
                <MirrorRoom 
                  affectLevel={affectLevel}
                  onInteraction={handleInteraction}
                />
                
                {/* Active Filter Overlay */}
                {activeFilter && (
                  <EmotionFilter
                    activeFilter={activeFilter}
                    affectLevel={affectLevel}
                    onFilterComplete={completeFilterSession}
                  />
                )}

                {/* Session Stats */}
                <div className="absolute top-4 left-4 space-y-2">
                  <div className="px-4 py-2 rounded-full bg-black/50 backdrop-blur-sm border border-white/20">
                    <p className="text-white text-sm">
                      ✨ Interactions: <span className="font-bold text-yellow-400">{interactions}</span>
                    </p>
                  </div>
                  <div className="px-4 py-2 rounded-full bg-black/50 backdrop-blur-sm border border-white/20">
                    <p className="text-white text-sm">
                      💫 Affect: <span className="font-bold text-pink-400">{affectLevel}%</span>
                    </p>
                  </div>
                </div>

                {/* Exit Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={endSession}
                  className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm border border-white/20 text-white hover:bg-black/70"
                >
                  Terminer
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filter Gallery */}
        {showGallery && !sessionActive && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <FilterGallery 
              filters={filters}
              onFilterSelect={(filter) => {
                setActiveFilter({...filter});
                startSession();
              }}
            />
          </motion.div>
        )}
      </main>

      {/* Badge Reveal Modal */}
      <AnimatePresence>
        {showBadge && sessionBadge && (
          <BadgeReveal
            badge={sessionBadge}
            onClose={() => {
              setShowBadge(false);
              setShowGallery(true);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ARFilters;
