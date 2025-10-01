import { useState } from "react";
import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useImplicitTracking } from "@/hooks/useImplicitTracking";
import { Scan } from "lucide-react";

const EmotionalScan = () => {
  const { track } = useImplicitTracking();
  const [selectedTheme, setSelectedTheme] = useState<string>('');
  const [selectedGesture, setSelectedGesture] = useState<string>('');
  const [gestureStartTime, setGestureStartTime] = useState<number>(0);

  const themes = [
    { id: 'warm', name: 'Chaleureux', emoji: '🔥', color: 'from-orange-500 to-red-500' },
    { id: 'cool', name: 'Apaisant', emoji: '❄️', color: 'from-blue-500 to-cyan-500' },
    { id: 'nature', name: 'Nature', emoji: '🌿', color: 'from-green-500 to-emerald-500' },
    { id: 'cosmos', name: 'Cosmique', emoji: '✨', color: 'from-purple-500 to-pink-500' },
  ];

  const gestures = [
    { id: 'long_exhale', name: 'Expiration longue', emoji: '🌬️' },
    { id: 'shake', name: 'Secouer', emoji: '💫' },
    { id: 'breathe', name: 'Respirer', emoji: '🫁' },
  ];

  const handleThemeSelect = (theme: string) => {
    setSelectedTheme(theme);
    track({
      instrument: "SAM",
      item_id: "valence",
      proxy: "choice",
      value: theme
    });
  };

  const handleGestureSelect = (gesture: string) => {
    setSelectedGesture(gesture);
    setGestureStartTime(Date.now());
    track({
      instrument: "SAM",
      item_id: "arousal",
      proxy: "choice",
      value: gesture
    });
  };

  const handleGestureComplete = () => {
    if (gestureStartTime > 0) {
      const duration = Date.now() - gestureStartTime;
      track({
        instrument: "SAM",
        item_id: "arousal",
        proxy: "duration",
        value: duration
      });
      setGestureStartTime(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-calm">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <Scan className="h-12 w-12 text-primary animate-pulse-soft" />
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              La Galerie des Masques
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Une galerie de masques flottants. À chaque geste, un masque s'anime et vient se poser près de vous.
          </p>
          <p className="text-sm text-primary animate-pulse-soft">
            🎭 Votre avatar se transforme sous vos yeux 🎭
          </p>
        </div>

        <Card className="max-w-4xl mx-auto border-0 shadow-glow p-8 animate-scale-in space-y-8">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-center">Choisis ton thème</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {themes.map(theme => (
                <button
                  key={theme.id}
                  onClick={() => handleThemeSelect(theme.id)}
                  className={`p-6 rounded-xl bg-gradient-to-br ${theme.color} transition-all hover:scale-105 ${
                    selectedTheme === theme.id ? 'ring-4 ring-primary scale-105' : 'opacity-70'
                  }`}
                >
                  <div className="text-4xl mb-2">{theme.emoji}</div>
                  <p className="text-white font-semibold">{theme.name}</p>
                </button>
              ))}
            </div>
          </div>

          {selectedTheme && (
            <div className="animate-fade-in">
              <h3 className="text-xl font-semibold mb-4 text-center">Choisis ton geste</h3>
              <div className="grid grid-cols-3 gap-4">
                {gestures.map(gesture => (
                  <button
                    key={gesture.id}
                    onClick={() => handleGestureSelect(gesture.id)}
                    className={`p-6 rounded-xl bg-card border-2 transition-all hover:scale-105 ${
                      selectedGesture === gesture.id ? 'border-primary scale-105' : 'border-muted'
                    }`}
                  >
                    <div className="text-4xl mb-2">{gesture.emoji}</div>
                    <p className="font-semibold">{gesture.name}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedGesture && gestureStartTime > 0 && (
            <div className="text-center animate-fade-in">
              <Button size="lg" onClick={handleGestureComplete}>
                Terminer le geste
              </Button>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
};

export default EmotionalScan;
