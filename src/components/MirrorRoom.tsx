import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface MirrorRoomProps {
  affectLevel: number; // 0-100
  onInteraction: (type: 'wink' | 'smile' | 'head') => void;
}

export const MirrorRoom = ({ affectLevel, onInteraction }: MirrorRoomProps) => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [haloIntensity, setHaloIntensity] = useState(0);
  const [warpEffect, setWarpEffect] = useState(0);

  // Simuler détection faciale
  useEffect(() => {
    const interval = setInterval(() => {
      const random = Math.random();
      if (random < 0.1) {
        onInteraction('smile');
        setHaloIntensity(100);
        setTimeout(() => setHaloIntensity(0), 2000);
      } else if (random < 0.15) {
        onInteraction('wink');
        triggerStarfall();
      } else if (random < 0.2) {
        onInteraction('head');
        setWarpEffect(1);
        setTimeout(() => setWarpEffect(0), 1000);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [onInteraction]);

  const triggerStarfall = () => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      y: -10
    }));
    setParticles(prev => [...prev, ...newParticles]);

    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 3000);
  };

  const getMirrorColor = () => {
    if (affectLevel > 70) return 'from-yellow-400 via-pink-400 to-orange-400';
    if (affectLevel > 40) return 'from-blue-400 via-purple-400 to-pink-400';
    return 'from-blue-600 via-indigo-600 to-purple-600';
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-indigo-950 via-purple-950 to-black">
      {/* Salle miroir avec effet de distorsion */}
      <motion.div
        className="absolute inset-0"
        animate={{
          scale: [1, 1 + warpEffect * 0.1, 1],
          rotate: [0, warpEffect * 5, 0]
        }}
        transition={{ duration: 1 }}
      >
        {/* Miroirs magiques */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full bg-gradient-to-br ${getMirrorColor()} opacity-20 blur-3xl`}
            style={{
              width: `${200 + i * 50}px`,
              height: `${200 + i * 50}px`,
              left: `${20 + i * 15}%`,
              top: `${10 + i * 10}%`,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </motion.div>

      {/* Halo doré au sourire */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          opacity: haloIntensity / 100,
          scale: [1, 1.5, 1]
        }}
        transition={{ duration: 2 }}
      >
        <div className="absolute inset-0 bg-gradient-radial from-yellow-400/50 via-orange-400/30 to-transparent" />
      </motion.div>

      {/* Pluie d'étoiles (clin d'œil) */}
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="absolute text-2xl"
          initial={{ x: `${particle.x}%`, y: '-10%', opacity: 1 }}
          animate={{ y: '110%', opacity: 0 }}
          transition={{ duration: 3, ease: "linear" }}
        >
          ⭐
        </motion.div>
      ))}

      {/* Grille cosmique animée */}
      <svg className="absolute inset-0 w-full h-full opacity-10">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-purple-400"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Indicateur d'interaction */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 text-center space-y-2">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-white/80 text-sm font-medium"
        >
          Souris, cligne, bouge pour activer les miroirs ✨
        </motion.div>
      </div>
    </div>
  );
};
