import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useImplicitTracking } from "@/hooks/useImplicitTracking";
import { useCollections } from "@/hooks/useCollections";
import { Circle } from "lucide-react";

const BubbleBeat = () => {
  const { track } = useImplicitTracking();
  const { collections, unlockItem } = useCollections();
  const [duration, setDuration] = useState<string>('');
  const [hrPreset, setHrPreset] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [bubbleCount, setBubbleCount] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setBubbleCount(prev => prev + 1);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    if (bubbleCount >= 15 && collections.bulles) {
      const locked = collections.bulles.items.filter(b => !b.unlocked);
      if (locked.length > 0) {
        const random = locked[Math.floor(Math.random() * locked.length)];
        unlockItem('bulles', random.id);
      }
      setBubbleCount(0);
    }
  }, [bubbleCount, collections.bulles]);

  const handleDurationSelect = (dur: string) => {
    setDuration(dur);
    track({
      instrument: "PSS10",
      item_id: "overwhelm",
      proxy: "choice",
      value: dur
    });
  };

  const handleHrSelect = (hr: string) => {
    setHrPreset(hr);
    track({
      instrument: "PSS10",
      item_id: "control",
      proxy: "preset",
      value: hr
    });
  };

  return (
    <div className="min-h-screen bg-gradient-calm">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <Circle className="h-12 w-12 text-primary animate-float" />
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Le Labo des Bulles
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Laboratoire coloré de bulles. Tendu, elles éclatent vite. Calme, elles flottent doucement.
          </p>
          <p className="text-sm text-primary animate-pulse-soft">
            🫧 Collectionnez des bulles rares arc-en-ciel 🫧
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {['very_short', 'short', 'medium'].map(dur => (
            <Button
              key={dur}
              variant={duration === dur ? 'default' : 'outline'}
              onClick={() => handleDurationSelect(dur)}
              className="capitalize"
            >
              {dur.replace('_', ' ')}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {['hr_low', 'hr_medium', 'hr_high'].map(hr => (
            <Button
              key={hr}
              variant={hrPreset === hr ? 'default' : 'outline'}
              onClick={() => handleHrSelect(hr)}
              className="capitalize"
            >
              {hr.replace('_', ' ')}
            </Button>
          ))}
        </div>

        <Card className="max-w-4xl mx-auto border-0 shadow-glow p-8 animate-scale-in relative overflow-hidden min-h-[400px]">
          <div className="absolute inset-0">
            {Array.from({ length: Math.min(bubbleCount, 20) }).map((_, i) => (
              <div
                key={i}
                className="absolute w-16 h-16 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 animate-float"
                style={{
                  left: `${Math.random() * 90}%`,
                  top: `${Math.random() * 90}%`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              >
                <span className="text-3xl">🫧</span>
              </div>
            ))}
          </div>

          <div className="relative z-10 text-center space-y-4">
            <p className="text-2xl font-semibold">
              {isPlaying ? 'Bulles flottantes...' : 'Prêt à commencer ?'}
            </p>
            <p className="text-muted-foreground">Bulles créées : {bubbleCount}</p>
            
            {duration && hrPreset && (
              <Button size="lg" onClick={() => setIsPlaying(!isPlaying)}>
                {isPlaying ? 'Stop' : 'Commencer'}
              </Button>
            )}
          </div>
        </Card>

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
