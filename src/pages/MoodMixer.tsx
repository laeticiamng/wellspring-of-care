import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useImplicitTracking } from "@/hooks/useImplicitTracking";
import { Music2, Volume2 } from "lucide-react";

const MoodMixer = () => {
  const { track } = useImplicitTracking();
  const [valence, setValence] = useState(50);
  const [arousal, setArousal] = useState(50);
  const [isPlaying, setIsPlaying] = useState(false);
  const [listenTime, setListenTime] = useState(0);
  const [mixSaved, setMixSaved] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setListenTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleValenceChange = (value: number[]) => {
    setValence(value[0]);
    track({
      instrument: "SAM",
      item_id: "valence",
      proxy: "choice",
      value: value[0] > 50 ? "up" : "down"
    });
  };

  const handleArousalChange = (value: number[]) => {
    setArousal(value[0]);
    track({
      instrument: "SAM",
      item_id: "arousal",
      proxy: "choice",
      value: value[0] > 50 ? "up" : "down"
    });
  };

  const handlePlay = () => {
    setIsPlaying(true);
    setListenTime(0);
  };

  const handleStop = () => {
    setIsPlaying(false);
    if (listenTime > 0) {
      track({
        instrument: "SAM",
        item_id: "stability",
        proxy: "duration",
        value: listenTime * 1000
      });
    }
  };

  const handleSaveMix = () => {
    setMixSaved(true);
    setTimeout(() => setMixSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-calm">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <Music2 className="h-12 w-12 text-primary animate-float" />
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Le Studio DJ des Émotions
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Studio futuriste. Les sliders modulent musique, basses et lumières en direct.
          </p>
          <p className="text-sm text-primary animate-pulse-soft">
            🎛️ Devenez le DJ de votre état intérieur 🎛️
          </p>
        </div>

        <Card className="max-w-4xl mx-auto border-0 shadow-glow p-8 animate-scale-in space-y-8">
          <div className="text-center">
            <Music2 className="w-16 h-16 mx-auto mb-4 text-primary animate-pulse-soft" />
            <h2 className="text-2xl font-bold mb-2">Studio DJ des Émotions</h2>
            <p className="text-muted-foreground">
              Ajuste les sliders pour créer ton mix émotionnel parfait
            </p>
          </div>

          <div 
            className="p-8 rounded-xl transition-all duration-500"
            style={{
              background: `linear-gradient(135deg, 
                hsl(${valence * 3.6}, 70%, ${50 + arousal * 0.3}%), 
                hsl(${(valence + 60) * 3.6}, 70%, ${50 + arousal * 0.3}%)
              )`,
            }}
          >
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between text-white font-semibold">
                  <span>😔 Tristesse</span>
                  <span>Valence</span>
                  <span>Joie 😊</span>
                </div>
                <Slider
                  value={[valence]}
                  onValueChange={handleValenceChange}
                  min={0}
                  max={100}
                  step={1}
                  className="cursor-pointer"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-white font-semibold">
                  <span>😴 Calme</span>
                  <span>Énergie</span>
                  <span>Actif 🔥</span>
                </div>
                <Slider
                  value={[arousal]}
                  onValueChange={handleArousalChange}
                  min={0}
                  max={100}
                  step={1}
                  className="cursor-pointer"
                />
              </div>
            </div>

            <div className="flex justify-center gap-4 mt-8">
              <Button
                size="lg"
                variant="secondary"
                onClick={isPlaying ? handleStop : handlePlay}
                className="gap-2"
              >
                <Volume2 className="w-5 h-5" />
                {isPlaying ? 'Stop' : 'Écouter'}
              </Button>
              <Button
                size="lg"
                variant="secondary"
                onClick={handleSaveMix}
              >
                💾 Sauvegarder
              </Button>
            </div>

            {isPlaying && (
              <p className="text-center text-white mt-4 animate-pulse-soft">
                Écoute: {listenTime}s
              </p>
            )}

            {mixSaved && (
              <p className="text-center text-white mt-4 animate-fade-in font-semibold">
                ✨ Mix sauvegardé !
              </p>
            )}
          </div>
        </Card>
      </main>
    </div>
  );
};

export default MoodMixer;
