import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  brightness: number;
  activated: boolean;
  type: 'normal' | 'rare' | 'legendary';
}

interface GalaxySceneProps {
  isActive: boolean;
  tension: number;
  onStarActivated?: (star: Star) => void;
}

const GalaxyScene = ({ isActive, tension, onStarActivated }: GalaxySceneProps) => {
  const [stars, setStars] = useState<Star[]>([]);
  const [connections, setConnections] = useState<Array<{from: Star, to: Star}>>([]);
  const [lastActivated, setLastActivated] = useState<Star | null>(null);

  // Générer galaxie initiale avec clusters
  useEffect(() => {
    const newStars: Star[] = [];
    
    // Create star clusters
    const clusterCount = 5;
    for (let c = 0; c < clusterCount; c++) {
      const clusterX = Math.random() * 100;
      const clusterY = Math.random() * 100;
      const starsInCluster = 15 + Math.floor(Math.random() * 10);
      
      for (let i = 0; i < starsInCluster; i++) {
        newStars.push({
          id: newStars.length,
          x: clusterX + (Math.random() - 0.5) * 30,
          y: clusterY + (Math.random() - 0.5) * 30,
          size: Math.random() * 4 + 1,
          brightness: Math.random() * 0.6 + 0.4,
          activated: false,
          type: Math.random() > 0.98 ? 'legendary' : Math.random() > 0.90 ? 'rare' : 'normal'
        });
      }
    }
    
    // Add scattered stars
    for (let i = 0; i < 30; i++) {
      newStars.push({
        id: newStars.length,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 0.5,
        brightness: Math.random() * 0.5 + 0.3,
        activated: false,
        type: 'normal'
      });
    }
    
    setStars(newStars);
  }, []);

  // Activer étoile au clic
  const handleStarClick = (star: Star) => {
    if (!isActive || star.activated) return;

    const updatedStar = { ...star, activated: true };
    
    setStars(prev => prev.map(s => s.id === star.id ? updatedStar : s));
    
    // Créer connexion avec dernière étoile activée
    if (lastActivated) {
      setConnections(prev => [...prev, { from: lastActivated, to: updatedStar }]);
    }
    
    setLastActivated(updatedStar);
    onStarActivated?.(updatedStar);

    // Haptic feedback
    if ('vibrate' in navigator) {
      const vibrationPattern = star.type === 'legendary' ? [50, 30, 50, 30, 50] : 
                               star.type === 'rare' ? [50, 30, 50] : [50];
      navigator.vibrate(vibrationPattern);
    }
  };

  // Couleurs adaptées à la tension
  const getSceneColor = () => {
    if (tension > 0.7) return 'from-indigo-950 via-purple-950 to-blue-950'; // Calme
    if (tension > 0.4) return 'from-blue-950 via-indigo-950 to-purple-950'; // Neutre
    return 'from-purple-900 via-pink-900 to-blue-900'; // Énergique
  };

  const getStarColor = (star: Star) => {
    if (star.type === 'legendary') return '#FFD700'; // Or
    if (star.type === 'rare') return '#9333EA'; // Violet
    return '#60A5FA'; // Bleu
  };

  const getStarGlow = (star: Star) => {
    if (star.type === 'legendary') return '0 0 30px rgba(255, 215, 0, 0.8)';
    if (star.type === 'rare') return '0 0 20px rgba(147, 51, 234, 0.6)';
    return '0 0 15px rgba(96, 165, 250, 0.4)';
  };

  return (
    <div className={`relative w-full h-screen bg-gradient-to-br ${getSceneColor()} overflow-hidden`}>
      {/* Nébuleuse de fond */}
      <div className="absolute inset-0 opacity-30">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={`nebula-${i}`}
            className="absolute rounded-full blur-3xl"
            style={{
              width: `${200 + i * 50}px`,
              height: `${200 + i * 50}px`,
              background: `radial-gradient(circle, rgba(147, 51, 234, ${0.3 - i * 0.05}), transparent)`,
              left: `${20 + i * 15}%`,
              top: `${10 + i * 12}%`,
            }}
            animate={{
              x: [0, 30, 0],
              y: [0, -20, 0],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{
              duration: 15 + i * 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Connexions entre étoiles */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {connections.map((conn, i) => (
          <motion.line
            key={`connection-${i}`}
            x1={`${conn.from.x}%`}
            y1={`${conn.from.y}%`}
            x2={`${conn.to.x}%`}
            y2={`${conn.to.y}%`}
            stroke="url(#constellation-gradient)"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.6 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        ))}
        <defs>
          <linearGradient id="constellation-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(147, 51, 234, 0.8)" />
            <stop offset="50%" stopColor="rgba(96, 165, 250, 0.8)" />
            <stop offset="100%" stopColor="rgba(255, 215, 0, 0.8)" />
          </linearGradient>
        </defs>
      </svg>

      {/* Étoiles */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className={`absolute cursor-pointer rounded-full ${isActive ? 'hover:scale-150' : ''}`}
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size * (star.activated ? 2 : 1)}px`,
            height: `${star.size * (star.activated ? 2 : 1)}px`,
            backgroundColor: getStarColor(star),
            boxShadow: star.activated ? getStarGlow(star) : 'none',
            opacity: star.activated ? 1 : star.brightness * (tension > 0.6 ? 0.5 : 0.8),
          }}
          onClick={() => handleStarClick(star)}
          animate={star.activated ? {
            scale: [1, 1.5, 1],
            opacity: [0, 1, 1],
          } : {
            opacity: [star.brightness * 0.5, star.brightness, star.brightness * 0.5],
          }}
          transition={star.activated ? {
            duration: 0.6,
            ease: "easeOut"
          } : {
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Halo pour étoiles rares */}
          {star.activated && star.type !== 'normal' && (
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: `radial-gradient(circle, ${getStarColor(star)}40, transparent)`,
              }}
              animate={{
                scale: [1, 3, 1],
                opacity: [0.8, 0, 0.8]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut"
              }}
            />
          )}
          
          {/* Particules pour legendary */}
          {star.activated && star.type === 'legendary' && (
            <>
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={`particle-${i}`}
                  className="absolute w-1 h-1 rounded-full bg-yellow-300"
                  style={{
                    left: '50%',
                    top: '50%',
                  }}
                  animate={{
                    x: Math.cos((i / 8) * Math.PI * 2) * 40,
                    y: Math.sin((i / 8) * Math.PI * 2) * 40,
                    opacity: [1, 0],
                    scale: [0, 1]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.1
                  }}
                />
              ))}
            </>
          )}
        </motion.div>
      ))}

      {/* Instructions flottantes */}
      {isActive && (
        <motion.div
          className="absolute bottom-20 left-1/2 -translate-x-1/2 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-white/90 text-lg font-light mb-2">
            ✨ Touche les étoiles pour créer ta constellation
          </p>
          <p className="text-white/60 text-sm">
            {connections.length > 0 ? `${connections.length} étoiles connectées` : 'Commence ton voyage cosmique'}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default GalaxyScene;
