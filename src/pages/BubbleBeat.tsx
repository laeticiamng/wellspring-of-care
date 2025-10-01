import { useState, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useImplicitTracking } from "@/hooks/useImplicitTracking";
import { useCollections } from "@/hooks/useCollections";
import { Sparkles, Circle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import BubbleLab from "@/components/BubbleLab";

const BubbleBeat = () => {
  const { track } = useImplicitTracking();
  const { collections, unlockItem } = useCollections();
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [bubbleCount, setBubbleCount] = useState(0);
  const [stressLevel, setStressLevel] = useState(5);
  const [showBadge, setShowBadge] = useState(false);
  const [badgeText, setBadgeText] = useState("");
  const [sessionStarted, setSessionStarted] = useState(false);

  useEffect(() => {
    if (sessionStarted && !isPlaying) {
      // Track initial stress level
      track({
        instrument: "PSS10",
        item_id: "initial_stress",
        proxy: "baseline",
        value: stressLevel
      });
    }
  }, [sessionStarted, stressLevel]);

  const handleBubbleInteraction = useCallback((type: 'pop' | 'float' | 'grow') => {
    setBubbleCount(prev => prev + 1);
    
    // Track interaction type as stress proxy
    track({
      instrument: "PSS10",
      item_id: "bubble_interaction",
      proxy: type,
      value: type === 'pop' ? 3 : type === 'float' ? 1 : 2
    });

    // Decrease stress with each interaction
    setStressLevel(prev => Math.max(1, prev - 0.1));

    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(type === 'pop' ? 30 : 50);
    }

    // Unlock rare bubbles
    if (bubbleCount > 0 && bubbleCount % 15 === 0 && collections.bulles) {
      const locked = collections.bulles.items.filter(b => !b.unlocked);
      if (locked.length > 0) {
        const random = locked[Math.floor(Math.random() * locked.length)];
        unlockItem('bulles', random.id);
        toast({
          title: "🫧 Bulle rare débloquée !",
          description: random.name,
        });
        if ('vibrate' in navigator) {
          navigator.vibrate([100, 50, 100]);
        }
      }
    }
  }, [bubbleCount, collections.bulles, track, unlockItem, toast]);

  const handleStart = useCallback(() => {
    setIsPlaying(true);
    setSessionStarted(true);
    setBubbleCount(0);
    setShowBadge(false);
    
    track({
      instrument: "PSS10",
      item_id: "session_start",
      proxy: "initiation",
      value: stressLevel
    });
  }, [stressLevel, track]);

  const handleEnd = useCallback(() => {
    setIsPlaying(false);
    
    // Track final stress level
    track({
      instrument: "PSS10",
      item_id: "session_end",
      proxy: "completion",
      value: stressLevel
    });

    // Show badge based on stress reduction
    const stressReduction = 5 - stressLevel;
    let badge = "";
    if (stressReduction > 3) {
      badge = "Stress libéré 🌿";
    } else if (stressReduction > 1.5) {
      badge = "Plus léger aujourd'hui ✨";
    } else {
      badge = "Relâchement en cours 🌊";
    }
    
    setBadgeText(badge);
    setShowBadge(true);
    
    toast({
      title: badge,
      description: `${bubbleCount} bulles éclatées`,
    });
  }, [stressLevel, bubbleCount, track, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-4 animate-fade-in">
          <div className="flex items-center justify-center space-x-3">
            <Sparkles className="h-12 w-12 text-primary animate-pulse-soft" />
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Le Labo des Bulles
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Joue avec tes bulles intérieures 🫧
          </p>
          <p className="text-sm text-primary/80">
            {isPlaying ? `${bubbleCount} bulles éclatées` : "Clique pour commencer l'expérience"}
          </p>
        </div>

        {!isPlaying && !showBadge ? (
          <Card className="max-w-2xl mx-auto border-0 shadow-glow p-8 text-center space-y-6 animate-scale-in">
            <Circle className="h-24 w-24 mx-auto text-primary/30 animate-float" />
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Prêt à libérer ton stress ?</h2>
              <p className="text-muted-foreground">
                Éclate, fais flotter ou grossir les bulles pour relâcher la pression
              </p>
              <Button size="lg" onClick={handleStart} className="gap-2">
                <Sparkles className="h-5 w-5" />
                Commencer l'expérience
              </Button>
            </div>
          </Card>
        ) : showBadge ? (
          <Card className="max-w-2xl mx-auto border-0 shadow-glow p-8 text-center space-y-6 animate-scale-in">
            <div className="text-6xl mb-4 animate-bounce">🫧</div>
            <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              {badgeText}
            </h2>
            <p className="text-xl text-muted-foreground">
              {bubbleCount} bulles éclatées
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" onClick={handleStart} variant="outline">
                Encore une partie ? 🎮
              </Button>
              <Button size="lg" onClick={() => window.location.href = '/app/nyvee'}>
                Essaie Nyvée 🌌
              </Button>
            </div>
          </Card>
        ) : (
          <BubbleLab
            isActive={isPlaying}
            stressLevel={stressLevel}
            onBubbleInteraction={handleBubbleInteraction}
            onEnd={handleEnd}
          />
        )}

        {collections.bulles && collections.bulles.unlockedCount > 0 && (
          <Card className="max-w-4xl mx-auto border-0 shadow-soft p-6 animate-fade-in">
            <h3 className="text-xl font-semibold mb-4">🫧 Bulles Rares débloquées</h3>
            <div className="grid grid-cols-4 gap-4">
              {collections.bulles.items.map(bulle => (
                <div
                  key={bulle.id}
                  className={`p-4 rounded-lg text-center transition-all ${
                    bulle.unlocked 
                      ? 'bg-primary/10 border-2 border-primary/40' 
                      : 'bg-muted opacity-40'
                  }`}
                >
                  <div className="text-3xl mb-2">{bulle.emoji}</div>
                  <p className="text-xs">{bulle.unlocked ? bulle.name : '???'}</p>
                </div>
              ))}
            </div>
          </Card>
        )}
      </main>
    </div>
  );
};

export default BubbleBeat;
