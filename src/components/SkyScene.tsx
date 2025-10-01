import { motion, AnimatePresence } from 'framer-motion';
import { AuraOrb } from './AuraOrb';
import { UserAura } from '@/hooks/useAuras';
import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

interface SkySceneProps {
  userAura: UserAura | null;
  communityAuras?: Array<{
    id: string;
    color_hue: number;
    luminosity: number;
    size_scale: number;
    animation_speed: number;
    is_rare: boolean;
    rare_type: string | null;
  }>;
  mode?: 'personal' | 'community';
  onAuraClick?: () => void;
}

export function SkyScene({ 
  userAura, 
  communityAuras = [],
  mode = 'personal',
  onAuraClick 
}: SkySceneProps) {
  const [stars, setStars] = useState<Array<{ x: number; y: number; size: number }>>([]);
  
  useEffect(() => {
    // Générer des étoiles en arrière-plan
    const newStars = Array.from({ length: 100 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
    }));
    setStars(newStars);
  }, []);

  // Positionner les auras dans le ciel
  const getAuraPosition = (index: number, total: number) => {
    if (mode === 'personal' && userAura) {
      // Centrer l'aura personnelle
      return {
        x: window.innerWidth / 2 - 40,
        y: window.innerHeight / 2 - 100,
      };
    }

    // Distribution circulaire pour la communauté
    const angle = (index / total) * Math.PI * 2;
    const radius = Math.min(window.innerWidth, window.innerHeight) * 0.3;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    return {
      x: centerX + Math.cos(angle) * radius - 40,
      y: centerY + Math.sin(angle) * radius - 40,
    };
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-gradient-to-b from-[#0a0a1a] via-[#1a1a2e] to-[#16213e]">
      {/* Stars background */}
      <div className="absolute inset-0">
        {stars.map((star, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
            }}
            animate={{
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Nebula effect */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-purple-500 blur-[100px]" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-500 blur-[100px]" />
      </div>

      {/* Title overlay */}
      <motion.div
        className="absolute top-8 left-1/2 -translate-x-1/2 text-center z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <div className="flex items-center gap-2 justify-center mb-2">
          <Sparkles className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {mode === 'personal' ? 'Ton aura éclaire le ciel commun' : 'Le Ciel des Auras'}
          </h2>
          <Sparkles className="w-6 h-6 text-primary" />
        </div>
        {mode === 'personal' && userAura && userAura.who5_internal_level != null && (
          <motion.p
            className="text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {userAura.who5_internal_level >= 4 && 'Vitalité rayonnante 🌞'}
            {userAura.who5_internal_level === 3 && 'Énergie douce 🌙'}
            {userAura.who5_internal_level === 2 && 'Semaine posée ✨'}
            {userAura.who5_internal_level === 1 && 'Présence calme 🕊️'}
            {userAura.who5_internal_level === 0 && 'Respire doucement 🌿'}
          </motion.p>
        )}
      </motion.div>

      {/* Auras */}
      <AnimatePresence>
        {mode === 'personal' && userAura && (
          <motion.div
            key="personal-aura"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <AuraOrb
              colorHue={userAura.color_hue}
              luminosity={userAura.luminosity}
              sizeScale={userAura.size_scale * 2} // Plus grande en mode personnel
              animationSpeed={userAura.animation_speed}
              isRare={userAura.is_rare}
              rareType={userAura.rare_type}
              position={getAuraPosition(0, 1)}
              onClick={onAuraClick}
              showPulse={true}
            />
          </motion.div>
        )}

        {mode === 'community' && communityAuras.map((aura, index) => (
          <motion.div
            key={aura.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ 
              duration: 0.5,
              delay: index * 0.05, // Apparition en cascade
            }}
          >
            <AuraOrb
              colorHue={aura.color_hue}
              luminosity={aura.luminosity}
              sizeScale={aura.size_scale}
              animationSpeed={aura.animation_speed}
              isRare={aura.is_rare}
              rareType={aura.rare_type}
              position={getAuraPosition(index, communityAuras.length)}
              showPulse={true}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Info badges en bas */}
      {mode === 'personal' && userAura && (
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <div className="px-4 py-2 rounded-full bg-background/80 backdrop-blur border border-primary/20">
            <span className="text-sm text-muted-foreground">
              Semaines consécutives: <span className="font-bold text-primary">{userAura.streak_weeks}</span>
            </span>
          </div>
          <div className="px-4 py-2 rounded-full bg-background/80 backdrop-blur border border-accent/20">
            <span className="text-sm text-muted-foreground">
              Interactions: <span className="font-bold text-accent">{userAura.interactions_count}</span>
            </span>
          </div>
          {userAura.is_rare && (
            <div className="px-4 py-2 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground">
              <span className="text-sm font-bold">
                Aura Rare Débloquée ✨
              </span>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
