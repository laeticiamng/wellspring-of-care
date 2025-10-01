import { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useImplicitTracking } from "@/hooks/useImplicitTracking";
import { useCollections } from "@/hooks/useCollections";
import { Volume2, VolumeX, Cloud } from "lucide-react";

const Nyvee = () => {
  const { track } = useImplicitTracking();
  const { collections, unlockItem } = useCollections();
  const [mode, setMode] = useState<'silence' | 'voice'>('silence');
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathCount, setBreathCount] = useState(0);
  const startTimeRef = useRef<number>(0);
  const followRatioRef = useRef<number>(0);

  useEffect(() => {
    if (isBreathing) {
      startTimeRef.current = Date.now();
    } else if (startTimeRef.current > 0) {
      const duration = Date.now() - startTimeRef.current;
      if (duration > 30000) {
        track({
          instrument: "STAI6",
          item_id: "tension",
          proxy: "repeat",
          value: "completed",
          context: { duration: String(duration) }
        });
        
        if (breathCount >= 10 && collections.cocons) {
          const locked = collections.cocons.items.filter(c => !c.unlocked);
          if (locked.length > 0) {
            const random = locked[Math.floor(Math.random() * locked.length)];
            unlockItem('cocons', random.id);
          }
        }
      }
    }
  }, [isBreathing, breathCount, collections.cocons]);

  const handleModeChange = (newMode: 'silence' | 'voice') => {
    setMode(newMode);
    track({
      instrument: "STAI6",
      item_id: "calm",
      proxy: "choice",
      value: newMode
    });
  };

  const handleBreathCycle = () => {
    setBreathCount(prev => prev + 1);
    followRatioRef.current = Math.min(1, followRatioRef.current + 0.1);
    
    if (breathCount > 0 && breathCount % 5 === 0) {
      track({
        instrument: "STAI6",
        item_id: "restless",
        proxy: "cadence_followed",
        value: followRatioRef.current,
        context: { pattern: "4-7-8" }
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-calm">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <Cloud className="h-12 w-12 text-primary animate-float" />
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              La Bulle Respirante
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Une immense bulle suspendue respire avec vous. Plus vous respirez calmement, plus elle révèle des constellations cachées.
          </p>
          <p className="text-sm text-primary animate-pulse-soft">
            ✨ Inspirez des étoiles, expirez la lumière ✨
          </p>
        </div>

        <div className="flex justify-center gap-4 mb-6">
          <Button
            variant={mode === 'silence' ? 'default' : 'outline'}
            onClick={() => handleModeChange('silence')}
            className="gap-2"
          >
            <VolumeX className="w-4 h-4" />
            Silence
          </Button>
          <Button
            variant={mode === 'voice' ? 'default' : 'outline'}
            onClick={() => handleModeChange('voice')}
            className="gap-2"
          >
            <Volume2 className="w-4 h-4" />
            Guidage vocal
          </Button>
        </div>

        <Card className="max-w-4xl mx-auto border-0 shadow-glow p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/20 animate-pulse-soft" />
          
          <div className="relative z-10 flex flex-col items-center justify-center space-y-8">
            <div 
              className={`w-64 h-64 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 border-4 border-primary/40 transition-all duration-1000 ${
                isBreathing ? 'scale-110 opacity-80' : 'scale-100 opacity-100'
              } animate-float flex items-center justify-center`}
              style={{
                boxShadow: '0 0 60px rgba(var(--primary), 0.3)',
              }}
            >
              <span className="text-6xl animate-shimmer">🫧</span>
            </div>

            <div className="text-center space-y-4">
              <p className="text-2xl font-semibold">
                {isBreathing ? 'Respire avec la bulle...' : 'Prêt à commencer ?'}
              </p>
              <p className="text-muted-foreground">
                Cycles complétés : {breathCount}
              </p>
            </div>

            <Button
              size="lg"
              onClick={() => {
                setIsBreathing(!isBreathing);
                if (!isBreathing) {
                  handleBreathCycle();
                }
              }}
              className="animate-bounce-soft"
            >
              {isBreathing ? 'Pause' : 'Commencer'}
            </Button>
          </div>
        </Card>

        {collections.cocons && collections.cocons.unlockedCount > 0 && (
          <Card className="max-w-4xl mx-auto border-0 shadow-soft p-6 animate-fade-in">
            <h3 className="text-xl font-semibold mb-4">🌟 Cocons débloqués</h3>
            <div className="grid grid-cols-5 gap-4">
              {collections.cocons.items.map(cocon => (
                <div
                  key={cocon.id}
                  className={`p-4 rounded-lg text-center transition-all ${
                    cocon.unlocked 
                      ? 'bg-primary/10 border-2 border-primary/40' 
                      : 'bg-muted opacity-40'
                  }`}
                >
                  <div className="text-3xl mb-2">{cocon.emoji}</div>
                  <p className="text-xs">{cocon.unlocked ? cocon.name : '???'}</p>
                </div>
              ))}
            </div>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Nyvee;
