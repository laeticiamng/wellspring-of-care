import { useEffect, useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import InteractiveBubble from "./InteractiveBubble";

interface BubbleLabProps {
  isActive: boolean;
  stressLevel: number;
  onBubbleInteraction: (type: 'pop' | 'float' | 'grow') => void;
  onEnd: () => void;
}

interface BubbleData {
  id: number;
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  hue: number;
}

const BubbleLab = ({ isActive, stressLevel, onBubbleInteraction, onEnd }: BubbleLabProps) => {
  const [bubbles, setBubbles] = useState<BubbleData[]>([]);
  const [sessionTime, setSessionTime] = useState(0);

  // Generate bubbles based on stress level
  useEffect(() => {
    if (!isActive) return;

    const bubbleInterval = setInterval(() => {
      const newBubble: BubbleData = {
        id: Date.now() + Math.random(),
        x: Math.random() * 90,
        y: 100,
        size: 40 + Math.random() * 40,
        speedY: stressLevel > 3 ? -2 - Math.random() * 2 : -0.5 - Math.random() * 1,
        speedX: (Math.random() - 0.5) * 0.5,
        hue: stressLevel > 3 ? 280 + Math.random() * 40 : 180 + Math.random() * 60
      };

      setBubbles(prev => [...prev, newBubble].slice(-15));
    }, stressLevel > 3 ? 300 : 800);

    return () => clearInterval(bubbleInterval);
  }, [isActive, stressLevel]);

  // Animate bubbles
  useEffect(() => {
    if (!isActive) return;

    const animationInterval = setInterval(() => {
      setBubbles(prev => prev
        .map(bubble => ({
          ...bubble,
          y: bubble.y + bubble.speedY,
          x: bubble.x + bubble.speedX
        }))
        .filter(bubble => bubble.y > -10)
      );
    }, 50);

    return () => clearInterval(animationInterval);
  }, [isActive]);

  // Session timer
  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive]);

  const handleBubblePop = useCallback((id: number) => {
    setBubbles(prev => prev.filter(b => b.id !== id));
    onBubbleInteraction('pop');
  }, [onBubbleInteraction]);

  const handleBubbleFloat = useCallback((id: number) => {
    onBubbleInteraction('float');
  }, [onBubbleInteraction]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="max-w-6xl mx-auto border-0 shadow-glow relative overflow-hidden min-h-[600px] bg-gradient-to-br from-background via-primary/5 to-primary/10 animate-fade-in">
      {/* Background particles */}
      <div className="absolute inset-0 opacity-30">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/40 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Stats overlay */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
        <div className="bg-background/80 backdrop-blur-sm px-4 py-2 rounded-full border border-primary/20">
          <p className="text-sm font-medium">
            Temps: {formatTime(sessionTime)}
          </p>
        </div>
        <div className="bg-background/80 backdrop-blur-sm px-4 py-2 rounded-full border border-primary/20">
          <p className="text-sm font-medium flex items-center gap-2">
            Stress
            <span className="inline-block w-20 h-2 bg-muted rounded-full overflow-hidden">
              <span 
                className="block h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 transition-all duration-500"
                style={{ width: `${(stressLevel / 5) * 100}%` }}
              />
            </span>
          </p>
        </div>
        <Button 
          onClick={onEnd}
          variant="outline"
          size="sm"
          className="bg-background/80 backdrop-blur-sm"
        >
          Terminer
        </Button>
      </div>

      {/* Interactive bubbles */}
      <div className="absolute inset-0">
        {bubbles.map(bubble => (
          <InteractiveBubble
            key={bubble.id}
            id={bubble.id}
            x={bubble.x}
            y={bubble.y}
            size={bubble.size}
            hue={bubble.hue}
            onPop={handleBubblePop}
            onFloat={handleBubbleFloat}
          />
        ))}
      </div>

      {/* Center guide */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center space-y-2 opacity-60">
          <p className="text-4xl animate-pulse-soft">🫧</p>
          <p className="text-sm text-muted-foreground">
            Clique pour éclater • Laisse flotter
          </p>
        </div>
      </div>
    </Card>
  );
};

export default BubbleLab;
