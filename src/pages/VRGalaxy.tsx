import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Play, Pause, Eye, Gauge } from "lucide-react";
import { useState, useEffect } from "react";
import { useImplicitTracking } from "@/hooks/useImplicitTracking";
import { useCollections } from "@/hooks/useCollections";
import GalaxyScene from "@/components/GalaxyScene";
import ConstellationGallery from "@/components/ConstellationGallery";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

interface Constellation {
  id: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  timestamp: number;
  starsCount: number;
  tension: number;
  name: string;
}

const VRGalaxy = () => {
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<number>(0);
  const [starsActivated, setStarsActivated] = useState(0);
  const [constellations, setConstellations] = useState<Constellation[]>([]);
  const [showBadge, setShowBadge] = useState(false);
  const [badgeText, setBadgeText] = useState("");
  const [tension, setTension] = useState(0.5);
  const [comfortMode, setComfortMode] = useState(false);
  
  const { track } = useImplicitTracking();
  const { collections, unlockItem } = useCollections();
  const { toast } = useToast();

  // Simuler tension POMS
  useEffect(() => {
    if (sessionActive) {
      const interval = setInterval(() => {
        setTension(prev => {
          const change = (Math.random() - 0.5) * 0.1;
          return Math.max(0, Math.min(1, prev + change));
        });
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [sessionActive]);

  const calculateRarity = (stars: number, duration: number, tensionFinal: number): 'common' | 'rare' | 'epic' | 'legendary' => {
    const score = stars * 10 + (duration / 1000) * 2 + (1 - tensionFinal) * 50;
    const rand = Math.random();
    
    if (score > 200 && rand > 0.95) return 'legendary';
    if (score > 150 && rand > 0.85) return 'epic';
    if (score > 100 && rand > 0.70) return 'rare';
    return 'common';
  };

  const constellationNames = [
    "Orion le Calme", "Cassiopée Sereine", "Andromède Apaisée",
    "Pégase Libéré", "Draco Zen", "Lyra Lumineuse",
    "Cygne Cosmique", "Phoenix Renaissant", "Ursa Tranquille"
  ];

  const handleStartSession = () => {
    setSessionActive(true);
    setSessionStartTime(Date.now());
    setStarsActivated(0);
    
    track({
      instrument: "SSQ",
      item_id: "vr_galaxy_start",
      proxy: "start",
      value: "initiated"
    });

    track({
      instrument: "POMS",
      item_id: "tension_baseline",
      proxy: "start",
      value: String(tension)
    });
    
    toast({
      title: "🌌 Galaxie activée",
      description: "Crée ta constellation émotionnelle",
    });
  };

  const handleEndSession = () => {
    const duration = Date.now() - sessionStartTime;
    const rarity = calculateRarity(starsActivated, duration, tension);
    
    const newConstellation: Constellation = {
      id: `constellation-${Date.now()}`,
      rarity,
      timestamp: Date.now(),
      starsCount: starsActivated,
      tension,
      name: constellationNames[Math.floor(Math.random() * constellationNames.length)]
    };
    
    setConstellations(prev => [newConstellation, ...prev]);

    const badges = {
      low: "🌠 Exploration énergique !",
      medium: "🌌 Voyage équilibré",
      high: "🌿 Tension relâchée",
    };

    const badgeType = tension > 0.7 ? 'high' : tension > 0.4 ? 'medium' : 'low';
    setBadgeText(badges[badgeType]);
    setShowBadge(true);

    if (duration < 60000) {
      track({
        instrument: "SSQ",
        item_id: "discomfort",
        proxy: "skip",
        value: "<1min",
        context: { duration: String(duration), comfort_mode: String(comfortMode) }
      });
    } else {
      track({
        instrument: "SSQ",
        item_id: "comfort",
        proxy: "completion",
        value: "success",
        context: { 
          duration: String(duration),
          stars: String(starsActivated),
          rarity,
          comfort_mode: String(comfortMode)
        }
      });
    }

    track({
      instrument: "POMS",
      item_id: "tension_final",
      proxy: "completion",
      value: String(tension),
      context: { change: String(tension - 0.5) }
    });

    if (collections.constellations?.items[0] && rarity !== 'common') {
      unlockItem('constellations', collections.constellations.items[0].id);
    }

    setSessionActive(false);
    setTimeout(() => setShowBadge(false), 5000);
  };

  const handleStarActivated = () => {
    setStarsActivated(prev => prev + 1);
    
    if ('AudioContext' in window) {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.frequency.value = 800 + Math.random() * 400;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      
      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + 0.3);
    }
  };

  const handleComfortMode = () => {
    setComfortMode(!comfortMode);
    track({
      instrument: "SSQ",
      item_id: "comfort_adjustment",
      proxy: "choice",
      value: comfortMode ? "normal_mode" : "comfort_mode"
    });
    
    toast({
      title: comfortMode ? "Mode normal activé" : "🛡️ Mode confort activé",
      description: comfortMode ? "Effets visuels normaux" : "Effets réduits pour ton confort",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-indigo-950 to-purple-950">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {!sessionActive && (
          <>
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-4"
            >
              <div className="flex items-center justify-center space-x-3">
                <Sparkles className="h-12 w-12 text-yellow-400 animate-pulse" />
                <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                  La Constellation Émotionnelle
                </h1>
              </div>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Explore l'univers infini et crée ta propre constellation. Chaque étoile représente une émotion.
              </p>
              <motion.p 
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-sm text-yellow-400"
              >
                🌠 Ton voyage cosmique t'attend 🌠
              </motion.p>
            </motion.div>

            <Card className="max-w-4xl mx-auto border-0 shadow-glow-legendary bg-gradient-to-br from-indigo-950/50 to-purple-950/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <Eye className="h-6 w-6 text-purple-400" />
                    <span className="text-white">Exploration Stellaire</span>
                  </span>
                  {starsActivated > 0 && (
                    <span className="text-sm font-normal text-yellow-400">
                      {starsActivated} étoiles ✨
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-center gap-4 flex-wrap">
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-glow-intense hover:scale-105 transition-transform"
                    onClick={handleStartSession}
                  >
                    <Play className="mr-2 h-5 w-5" />
                    Commencer l'exploration
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={handleComfortMode}
                    className="border-purple-500/50 text-purple-300 hover:bg-purple-950/50"
                  >
                    <Gauge className="mr-2 h-5 w-5" />
                    {comfortMode ? "Mode Normal" : "Mode Confort"}
                  </Button>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { name: 'Exploration Calme', emoji: '🌙', color: 'from-indigo-600 to-purple-600' },
                    { name: 'Voyage Équilibré', emoji: '⚖️', color: 'from-purple-600 to-pink-600' },
                    { name: 'Aventure Dynamique', emoji: '⚡', color: 'from-pink-600 to-red-600' }
                  ].map((mode) => (
                    <motion.div
                      key={mode.name}
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Card className={`border-0 bg-gradient-to-br ${mode.color} cursor-pointer`}>
                        <CardContent className="pt-6 text-center text-white">
                          <span className="text-4xl mb-2 block">{mode.emoji}</span>
                          <p className="font-medium">{mode.name}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {sessionActive && (
          <div className="relative">
            <GalaxyScene 
              isActive={sessionActive}
              tension={tension}
              onStarActivated={handleStarActivated}
            />

            <div className="absolute top-8 right-8 flex flex-col gap-3 z-20">
              <Button
                variant="outline"
                className="bg-black/50 hover:bg-black/70 border-white/30 text-white backdrop-blur"
                onClick={handleEndSession}
              >
                <Pause className="mr-2 h-4 w-4" />
                Terminer
              </Button>
              
              <div className="bg-black/50 backdrop-blur rounded-lg p-3 border border-white/30">
                <div className="flex items-center gap-2 text-white text-sm">
                  <Gauge className="h-4 w-4" />
                  <div className="w-24 h-2 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-green-400 to-red-400"
                      animate={{ width: `${tension * 100}%` }}
                    />
                  </div>
                </div>
                <p className="text-xs text-white/70 mt-1">
                  {tension > 0.7 ? 'Tendu' : tension > 0.4 ? 'Équilibré' : 'Détendu'}
                </p>
              </div>
            </div>
          </div>
        )}

        <AnimatePresence>
          {showBadge && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: -50 }}
              className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
            >
              <Card className="border-0 shadow-glow-legendary bg-gradient-to-r from-yellow-500 via-purple-500 to-blue-500">
                <CardContent className="p-6 text-center">
                  <p className="text-2xl font-bold text-white">{badgeText}</p>
                  <p className="text-sm text-white/80 mt-2">Constellation sauvegardée ✨</p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {!sessionActive && constellations.length > 0 && (
          <Card className="max-w-6xl mx-auto border-0 shadow-glow bg-gradient-to-br from-indigo-950/50 to-purple-950/50 backdrop-blur">
            <CardContent className="pt-6">
              <ConstellationGallery constellations={constellations} />
            </CardContent>
          </Card>
        )}

        {!sessionActive && collections.constellations && collections.constellations.unlockedCount > 0 && (
          <Card className="max-w-4xl mx-auto border-0 shadow-glow bg-gradient-to-br from-purple-950/50 to-blue-950/50 backdrop-blur">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <p className="text-sm font-semibold text-purple-300">🌌 Collection Cosmique</p>
                <div className="flex justify-center gap-4 flex-wrap">
                  {collections.constellations.items.filter(item => item.unlocked).map(item => (
                    <motion.div
                      key={item.id}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="text-center p-3 rounded-lg bg-gradient-to-br from-purple-900/50 to-blue-900/50 border border-purple-500/30"
                    >
                      <span className="text-3xl block">{item.emoji}</span>
                      <p className="text-xs text-gray-300 mt-1">{item.name}</p>
                    </motion.div>
                  ))}
                </div>
                <p className="text-xs text-purple-300">
                  {collections.constellations.unlockedCount}/{collections.constellations.totalItems} constellations
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default VRGalaxy;
