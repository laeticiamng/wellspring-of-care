import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { DJStudio } from "@/components/DJStudio";
import { MoodSlider } from "@/components/MoodSlider";
import { MixVisualizer } from "@/components/MixVisualizer";
import { MixGallery } from "@/components/MixGallery";
import BadgeReveal from "@/components/BadgeReveal";
import { Button } from "@/components/ui/button";
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

  useEffect(() => {
    loadSavedMixes();
    startSession();
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
    }
    if (navigator.vibrate && Math.abs(value - 50) > 45) {
      navigator.vibrate(50);
    }
  };

  const handleArousalChange = (value: number) => {
    setArousal(value);
    if (Math.abs(value - arousal) > 10) {
      scratchSound.play();
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

      const mixToSave = {
        ...currentMix,
        id: Date.now(),
        badge: data.badge,
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
        description: `"${currentMix.mood}" ajouté à ta playlist`,
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-primary/10 to-background relative overflow-hidden">
      <Header />
      
      <DJStudio valence={valence} arousal={arousal} />
      
      <main className="container mx-auto px-4 py-8 space-y-8 relative z-10">
        <div className="text-center space-y-4 animate-fade-in">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-glow">
            Mix ton Mood 🎛️✨
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Deviens le DJ de tes émotions. Slide pour créer ton mix unique.
          </p>
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
