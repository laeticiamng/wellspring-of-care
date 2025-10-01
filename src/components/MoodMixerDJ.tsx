import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";

interface MoodMixerDJProps {
  valence: number;
  arousal: number;
  onValenceChange: (value: number) => void;
  onArousalChange: (value: number) => void;
}

export const MoodMixerDJ = ({
  valence,
  arousal,
  onValenceChange,
  onArousalChange,
}: MoodMixerDJProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [waveforms, setWaveforms] = useState<number[]>([]);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number }[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setWaveforms(Array.from({ length: 20 }, () => Math.random() * (arousal + 0.5)));
    }, 100);
    return () => clearInterval(interval);
  }, [arousal]);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setParticles(prev => {
        const newParticles = prev.filter(p => p.y > -50);
        if (Math.random() > 0.3) {
          newParticles.push({
            id: Date.now() + Math.random(),
            x: Math.random() * 400,
            y: 300,
            size: 4 + Math.random() * 8,
          });
        }
        return newParticles.map(p => ({ ...p, y: p.y - 2 }));
      });
    }, 50);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const getColorForValence = () => {
    if (valence < -0.5) return "from-blue-600 to-indigo-600";
    if (valence < 0) return "from-cyan-500 to-blue-500";
    if (valence < 0.5) return "from-green-500 to-emerald-500";
    return "from-yellow-500 to-orange-500";
  };

  const getGlowIntensity = () => {
    const base = 20 + arousal * 40;
    return `0 0 ${base}px rgba(168, 85, 247, ${0.3 + arousal * 0.5})`;
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 border border-purple-500/20 overflow-hidden">
      {/* Background Particles */}
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white/40 blur-sm"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
          }}
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 1 }}
        />
      ))}

      {/* Waveform Visualization */}
      <div className="flex items-end justify-center gap-1 h-32 mb-8">
        {waveforms.map((height, i) => (
          <motion.div
            key={i}
            className={`w-4 rounded-t-lg bg-gradient-to-t ${getColorForValence()}`}
            animate={{
              height: `${height * 80}%`,
            }}
            transition={{
              duration: 0.1,
            }}
            style={{
              boxShadow: getGlowIntensity(),
            }}
          />
        ))}
      </div>

      {/* Center Orb */}
      <motion.div
        className={`mx-auto w-32 h-32 rounded-full bg-gradient-to-br ${getColorForValence()} mb-8`}
        animate={{
          scale: [1, 1 + arousal * 0.3, 1],
          rotate: isPlaying ? 360 : 0,
        }}
        transition={{
          scale: { duration: 2, repeat: Infinity },
          rotate: { duration: 10, ease: "linear", repeat: Infinity },
        }}
        style={{
          boxShadow: getGlowIntensity(),
        }}
      />

      {/* Valence Slider (Horizontal) */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-muted-foreground mb-2">
          <span>😢 Négatif</span>
          <span className="font-semibold text-white">Valence Émotionnelle</span>
          <span>😊 Positif</span>
        </div>
        <Slider
          value={[(valence + 1) * 50]}
          onValueChange={([v]) => onValenceChange((v / 50) - 1)}
          max={100}
          step={1}
          className="[&_[role=slider]]:bg-gradient-to-r [&_[role=slider]]:from-blue-500 [&_[role=slider]]:to-orange-500 [&_[role=slider]]:shadow-lg"
        />
      </div>

      {/* Arousal Slider (Horizontal) */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-muted-foreground mb-2">
          <span>😴 Calme</span>
          <span className="font-semibold text-white">Intensité Émotionnelle</span>
          <span>⚡ Intense</span>
        </div>
        <Slider
          value={[(arousal + 1) * 50]}
          onValueChange={([v]) => onArousalChange((v / 50) - 1)}
          max={100}
          step={1}
          className="[&_[role=slider]]:bg-gradient-to-r [&_[role=slider]]:from-cyan-500 [&_[role=slider]]:to-pink-500 [&_[role=slider]]:shadow-lg"
        />
      </div>

      {/* Play Button */}
      <motion.button
        onClick={() => setIsPlaying(!isPlaying)}
        className={`w-full py-4 rounded-xl font-bold text-white transition-all ${
          isPlaying
            ? "bg-gradient-to-r from-pink-500 to-purple-500"
            : "bg-gradient-to-r from-purple-500 to-indigo-500"
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        style={{
          boxShadow: isPlaying ? getGlowIntensity() : "none",
        }}
      >
        {isPlaying ? "⏸ Pause" : "▶ Mixer les émotions"}
      </motion.button>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4 text-center">
        <div className="p-3 rounded-lg bg-white/5 backdrop-blur">
          <div className="text-xs text-muted-foreground">Mood Score</div>
          <div className="text-2xl font-bold text-white">
            {Math.round((valence + 1) * 50)}
          </div>
        </div>
        <div className="p-3 rounded-lg bg-white/5 backdrop-blur">
          <div className="text-xs text-muted-foreground">Energy Level</div>
          <div className="text-2xl font-bold text-white">
            {Math.round((arousal + 1) * 50)}
          </div>
        </div>
      </div>
    </div>
  );
};
