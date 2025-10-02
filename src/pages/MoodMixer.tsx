import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { DJStudio } from "@/components/DJStudio";
import { MoodSlider } from "@/components/MoodSlider";
import { MixVisualizer } from "@/components/MixVisualizer";
import { MixGallery } from "@/components/MixGallery";
import BadgeReveal from "@/components/BadgeReveal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Howl } from "howler";

const scratchSound = new Howl({
  src: ['/sounds/scratch.mp3'],
  volume: 0.3,
  html5: true
});

const dropSound = new Howl({
  src: ['/sounds/bass-drop.mp3'],
  volume: 0.4,
  html5: true
});

const MoodMixer = () => {
  const { toast } = useToast();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [valence, setValence] = useState(50); // 0-100: negative to positive
  const [arousal, setArousal] = useState(50); // 0-100: calm to energized
  const [currentMix, setCurrentMix] = useState<any>(null);
  const [savedMixes, setSavedMixes] = useState<any[]>([]);
  const [showBadge, setShowBadge] = useState(false);
  const [currentBadge, setCurrentBadge] = useState<any>(null);
  const [isStabilized, setIsStabilized] = useState(false);
  const [userLevel, setUserLevel] = useState(1);
  const [totalXP, setTotalXP] = useState(0);
  const [combo, setCombo] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [unlockedSets, setUnlockedSets] = useState<string[]>([]);

  const djSets = [
    { id: 'set1', name: '🎵 Set Débutant', unlockLevel: 1 },
    { id: 'set2', name: '🎶 Set Pro', unlockLevel: 3 },
    { id: 'set3', name: '🎧 Set Expert', unlockLevel: 5 },
    { id: 'set4', name: '🔥 Set Légendaire', unlockLevel: 8 },
  ];

  useEffect(() => {
    loadSavedMixes();
    startSession();
    
    const saved = localStorage.getItem('mood_mixer_progress');
    if (saved) {
      const { level, xp, sets } = JSON.parse(saved);
      setUserLevel(level || 1);
      setTotalXP(xp || 0);
      setUnlockedSets(sets || []);
    }
  }, []);

  useEffect(() => {
    // Check if mix is stabilized (no change for 2 seconds)
    const timer = setTimeout(() => {
      setIsStabilized(true);
      updateCurrentMix();
    }, 2000);

    setIsStabilized(false);
    return () => clearTimeout(timer);
  }, [valence, arousal]);

  const loadSavedMixes = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const saved = localStorage.getItem(`mood_mixes_${user.id}`);
    if (saved) {
      setSavedMixes(JSON.parse(saved));
    }
  };

  const startSession = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase.functions.invoke('assess-start', {
        body: { 
          instruments: ['SAM'],
          context: { 
            valence,
            arousal,
            type: 'mood_mix'
          }
        }
      });

      if (error) throw error;
      setSessionId(data.session_id);
    } catch (error) {
      console.error('Error starting session:', error);
    }
  };

  const updateCurrentMix = () => {
    const mix = {
      valence,
      arousal,
      mood: getMoodName(valence, arousal),
      color: getMoodColor(valence, arousal),
      tempo: 60 + (arousal * 1.4), // 60-200 BPM
      timestamp: Date.now()
    };
    setCurrentMix(mix);

    // Rare drop detection (20% chance on specific combinations)
    if (isRareMix(valence, arousal)) {
      if (Math.random() < 0.2) {
        dropSound.play();
        toast({
          title: "🌟 Mix Rare débloqué!",
          description: "Texture cosmique ajoutée à ta collection",
        });
      }
    }
  };

  const handleValenceChange = (value: number) => {
    setValence(value);
    if (Math.abs(value - valence) > 10) {
      scratchSound.play();
      setCombo(prev => prev + 1);
    }
    if (navigator.vibrate && Math.abs(value - 50) > 45) {
      navigator.vibrate(50);
    }
  };

  const handleArousalChange = (value: number) => {
    setArousal(value);
    if (Math.abs(value - arousal) > 10) {
      scratchSound.play();
      setCombo(prev => prev + 1);
    }
    if (navigator.vibrate && Math.abs(value - 50) > 45) {
      navigator.vibrate(50);
    }
  };

  const saveMix = async () => {
    if (!currentMix || !sessionId) return;

    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }

    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase.functions.invoke('assess-submit', {
        body: { 
          session_id: sessionId,
          responses: {
            valence,
            arousal,
            mood: currentMix.mood
          }
        }
      });

      if (error) throw error;

      // Calculate XP
      const baseXP = 50;
      const comboBonus = Math.min(combo * 5, 100);
      const rareBonus = isRareMix(valence, arousal) ? 150 : 0;
      const totalXPGain = baseXP + comboBonus + rareBonus;
      
      const newXP = totalXP + totalXPGain;
      const newLevel = Math.floor(newXP / 500) + 1;
      const leveledUp = newLevel > userLevel;

      // Check for set unlocks
      const newUnlocks = djSets.filter(set => 
        set.unlockLevel <= newLevel && !unlockedSets.includes(set.id)
      ).map(set => set.id);

      if (leveledUp) {
        setUserLevel(newLevel);
        setShowLevelUp(true);
        setTimeout(() => setShowLevelUp(false), 3000);
      }

      if (newUnlocks.length > 0) {
        setUnlockedSets([...unlockedSets, ...newUnlocks]);
      }

      setTotalXP(newXP);
      setCombo(0);

      localStorage.setItem('mood_mixer_progress', JSON.stringify({
        level: newLevel,
        xp: newXP,
        sets: [...unlockedSets, ...newUnlocks]
      }));

      const mixToSave = {
        ...currentMix,
        id: Date.now(),
        badge: data.badge,
        xpGain: totalXPGain,
        combo,
        savedAt: new Date().toISOString()
      };

      const newMixes = [mixToSave, ...savedMixes].slice(0, 20);
      setSavedMixes(newMixes);
      localStorage.setItem(`mood_mixes_${user.id}`, JSON.stringify(newMixes));

      setCurrentBadge({
        name: data.badge || getMoodBadge(valence, arousal),
        description: data.message || "Ton mix émotionnel est sauvegardé",
        rarity: isRareMix(valence, arousal) ? 'legendary' : 'epic'
      });
      setShowBadge(true);

      toast({
        title: "Mix sauvegardé! 🎶",
        description: `+${totalXPGain} XP | Combo x${combo}`,
      });

      // Start new session
      startSession();
    } catch (error) {
      console.error('Error saving mix:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le mix",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getMoodName = (v: number, a: number): string => {
    if (v > 70 && a > 70) return "Euphorique 🔥";
    if (v > 70 && a < 30) return "Serein ☀️";
    if (v < 30 && a > 70) return "Intense ⚡";
    if (v < 30 && a < 30) return "Mélancolique 🌙";
    if (v > 60) return "Joyeux 🌸";
    if (v < 40) return "Sombre 🌊";
    if (a > 60) return "Énergique 💫";
    if (a < 40) return "Calme 🍃";
    return "Équilibré ⚖️";
  };

  const getMoodColor = (v: number, a: number): string => {
    const hue = v * 1.2; // 0-120 (red to green)
    const saturation = 70 + (a * 0.3);
    const lightness = 50 + (v * 0.2);
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  const getMoodBadge = (v: number, a: number): string => {
    if (v > 80) return "Mood élevé ✨";
    if (a < 20) return "Calme lumineux 🌙";
    if (a > 80) return "Énergie canalisée 🔥";
    if (v > 60 && a < 40) return "Douceur rayonnante 🌸";
    return "Mix harmonieux 🎵";
  };

  const isRareMix = (v: number, a: number): boolean => {
    // Perfect corners or perfect center
    return (
      (v > 95 && a > 95) || // Top-right corner
      (v < 5 && a < 5) ||   // Bottom-left corner
      (v > 95 && a < 5) ||  // Top-left corner
      (v < 5 && a > 95) ||  // Bottom-right corner
      (Math.abs(v - 50) < 5 && Math.abs(a - 50) < 5) // Perfect center
    );
  };

  const xpToNextLevel = (userLevel * 500) - totalXP;
  const progressPercent = (totalXP % 500) / 5;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-primary/10 to-background relative overflow-hidden">
      <Header />
      
      {/* Level up animation */}
      {showLevelUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm pointer-events-none">
          <Card className="max-w-md bg-gradient-primary border-primary/50 shadow-glow animate-scale-in">
            <div className="p-8 text-center space-y-4">
              <div className="text-6xl animate-bounce">🎧</div>
              <h2 className="text-4xl font-bold">DJ Niveau {userLevel}!</h2>
              <p className="text-muted-foreground">Nouveau set débloqué</p>
            </div>
          </Card>
        </div>
      )}
      
      <DJStudio valence={valence} arousal={arousal} />
      
      <main className="container mx-auto px-4 py-8 space-y-8 relative z-10">
        <div className="text-center space-y-4 animate-fade-in">
          <div className="flex items-center justify-center gap-3">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-glow">
              Mix ton Mood 🎛️✨
            </h1>
            <div className="px-3 py-1 bg-primary/20 rounded-full">
              <span className="text-sm font-bold text-primary">Niv.{userLevel}</span>
            </div>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Deviens le DJ de tes émotions. Slide pour créer ton mix unique.
          </p>
          <div className="max-w-md mx-auto space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Combo: x{combo}</span>
              <span className="text-primary">{totalXP} XP ({xpToNextLevel} vers niv.{userLevel + 1})</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-primary transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
          
          {/* Sets débloqués */}
          <div className="flex justify-center gap-2 flex-wrap">
            {djSets.map(set => (
              <div
                key={set.id}
                className={`px-3 py-1 rounded-full text-xs ${
                  unlockedSets.includes(set.id)
                    ? 'bg-primary/20 text-primary border border-primary/40'
                    : userLevel >= set.unlockLevel
                    ? 'bg-accent/20 text-accent border border-accent/40 animate-pulse'
                    : 'bg-muted/50 text-muted-foreground opacity-50'
                }`}
              >
                {set.name}
              </div>
            ))}
          </div>
        </div>

        <MixVisualizer 
          valence={valence} 
          arousal={arousal}
          color={getMoodColor(valence, arousal)}
          isStabilized={isStabilized}
        />

        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-6">
            <MoodSlider
              label="Valence"
              emoji="😔 → 😊"
              value={valence}
              onChange={handleValenceChange}
              color={getMoodColor(valence, 50)}
            />
            
            <MoodSlider
              label="Arousal"
              emoji="😴 → ⚡"
              value={arousal}
              onChange={handleArousalChange}
              color={getMoodColor(50, arousal)}
            />
          </div>

          {currentMix && isStabilized && (
            <div className="text-center space-y-4 animate-scale-in">
              <div className="inline-block px-8 py-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full backdrop-blur-sm border border-primary/30">
                <p className="text-2xl font-bold" style={{ color: currentMix.color }}>
                  {currentMix.mood}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {Math.round(currentMix.tempo)} BPM
                </p>
              </div>

              <Button
                size="lg"
                onClick={saveMix}
                disabled={isLoading}
                className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
              >
                {isLoading ? "Sauvegarde..." : "Sauvegarder ce Mix 🎶"}
              </Button>
            </div>
          )}
        </div>

        {savedMixes.length > 0 && (
          <MixGallery mixes={savedMixes} />
        )}
      </main>

      {showBadge && currentBadge && (
        <BadgeReveal
          badge={currentBadge}
          onClose={() => setShowBadge(false)}
        />
      )}
    </div>
  );
};

export default MoodMixer;
