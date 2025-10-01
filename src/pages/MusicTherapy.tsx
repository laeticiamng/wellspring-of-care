import { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useImplicitTracking } from "@/hooks/useImplicitTracking";
import { useCollections } from "@/hooks/useCollections";
import { Play, Pause, SkipForward, Music } from "lucide-react";

const MusicTherapy = () => {
  const { track } = useImplicitTracking();
  const { collections, unlockItem } = useCollections();
  const [preset, setPreset] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [listenTime, setListenTime] = useState(0);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      startTimeRef.current = Date.now();
      interval = setInterval(() => {
        setListenTime(prev => prev + 1);
      }, 1000);
    } else if (startTimeRef.current > 0) {
      const duration = Date.now() - startTimeRef.current;
      track({
        instrument: "POMS",
        item_id: "tension",
        proxy: "duration",
        value: duration
      });
      
      if (duration > 120000 && collections.fragments) {
        const locked = collections.fragments.items.filter(f => !f.unlocked);
        if (locked.length > 0) {
          const random = locked[Math.floor(Math.random() * locked.length)];
          unlockItem('fragments', random.id);
        }
      }
    }
    return () => clearInterval(interval);
  }, [isPlaying, collections.fragments]);

  const presets = [
    { id: 'calm', name: 'Calme', emoji: '🌊', description: 'Sons apaisants' },
    { id: 'energy', name: 'Énergie', emoji: '⚡', description: 'Rythmes dynamiques' },
    { id: 'focus', name: 'Focus', emoji: '🎯', description: 'Concentration' },
    { id: 'sleep', name: 'Sommeil', emoji: '🌙', description: 'Sons doux' },
  ];

  const handlePresetSelect = (presetId: string) => {
    setPreset(presetId);
    track({
      instrument: "POMS",
      item_id: "tension",
      proxy: "choice",
      value: presetId
    });
  };

  const handleSkip = () => {
    if (listenTime < 30) {
      track({
        instrument: "POMS",
        item_id: "fatigue",
        proxy: "skip",
        value: "early"
      });
    }
    setIsPlaying(false);
    setListenTime(0);
  };

  return (
    <div className="min-h-screen bg-gradient-calm">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <Music className="h-12 w-12 text-primary animate-float" />
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              La Forêt Sonore
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Les arbres vibrent et chantent avec les musiques. Touchez un tronc, marchez, le rythme change.
          </p>
          <p className="text-sm text-primary animate-pulse-soft">
            🎶 Composez un fragment de mélodie rien qu'à vous 🎶
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {presets.map(p => (
            <button
              key={p.id}
              onClick={() => handlePresetSelect(p.id)}
              className={`p-6 rounded-xl bg-card border-2 transition-all hover:scale-105 ${
                preset === p.id ? 'border-primary scale-105' : 'border-muted'
              }`}
            >
              <div className="text-4xl mb-2">{p.emoji}</div>
              <p className="font-semibold mb-1">{p.name}</p>
              <p className="text-xs text-muted-foreground">{p.description}</p>
            </button>
          ))}
        </div>

        <Card className="max-w-4xl mx-auto border-0 shadow-glow p-8 animate-scale-in">
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-6xl mb-4 animate-float">🎵</div>
              <p className="text-2xl font-semibold mb-2">
                {isPlaying ? 'En écoute...' : preset ? 'Prêt à commencer' : 'Choisis un preset'}
              </p>
              {isPlaying && (
                <p className="text-muted-foreground">
                  {Math.floor(listenTime / 60)}:{(listenTime % 60).toString().padStart(2, '0')}
                </p>
              )}
            </div>

            {preset && (
              <div className="flex justify-center gap-4">
                <Button
                  size="lg"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="gap-2"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  {isPlaying ? 'Pause' : 'Jouer'}
                </Button>
                {isPlaying && (
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleSkip}
                    className="gap-2"
                  >
                    <SkipForward className="w-5 h-5" />
                    Skip
                  </Button>
                )}
              </div>
            )}
          </div>
        </Card>

        {collections.fragments && collections.fragments.unlockedCount > 0 && (
          <Card className="max-w-4xl mx-auto border-0 shadow-soft p-6 animate-fade-in">
            <h3 className="text-xl font-semibold mb-4">🎼 Fragments Mélodiques débloqués</h3>
            <div className="grid grid-cols-5 gap-4">
              {collections.fragments.items.map(fragment => (
                <div
                  key={fragment.id}
                  className={`p-4 rounded-lg text-center transition-all ${
                    fragment.unlocked 
                      ? 'bg-primary/10 border-2 border-primary/40' 
                      : 'bg-muted opacity-40'
                  }`}
                >
                  <div className="text-3xl mb-2">{fragment.emoji}</div>
                  <p className="text-xs">{fragment.unlocked ? fragment.name : '???'}</p>
                  {fragment.unlocked && (
                    <span className={`inline-block mt-1 px-2 py-1 rounded text-xs ${
                      fragment.rarity === 'legendary' ? 'bg-yellow-500/20 text-yellow-500' :
                      fragment.rarity === 'epic' ? 'bg-purple-500/20 text-purple-500' :
                      fragment.rarity === 'rare' ? 'bg-blue-500/20 text-blue-500' :
                      'bg-gray-500/20 text-gray-500'
                    }`}>
                      {fragment.rarity}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}
      </main>
    </div>
  );
};

export default MusicTherapy;
