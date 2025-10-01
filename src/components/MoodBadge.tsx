import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

interface MoodBadgeProps {
  badge: string;
  emoji: string;
  maskName: string;
  onContinue: () => void;
}

export function MoodBadge({ badge, emoji, maskName, onContinue }: MoodBadgeProps) {
  const navigate = useNavigate();

  const getSuggestedActions = () => {
    const lowerBadge = badge.toLowerCase();
    
    if (lowerBadge.includes('énergie') || lowerBadge.includes('tension')) {
      return [
        { label: 'Respirer avec Nyvée', route: '/nyvee', icon: '🫁' },
        { label: 'Ancrage 5-4-3-2-1', route: '/activity', icon: '🧭' },
      ];
    }
    
    if (lowerBadge.includes('posé') || lowerBadge.includes('calme')) {
      return [
        { label: 'Méditation guidée', route: '/meditation', icon: '🧘' },
        { label: 'Journal émotionnel', route: '/journal', icon: '📝' },
      ];
    }
    
    if (lowerBadge.includes('fatigue') || lowerBadge.includes('douce')) {
      return [
        { label: 'Musique thérapie', route: '/music-therapy', icon: '🎵' },
        { label: 'Repos guidé', route: '/breathwork', icon: '💤' },
      ];
    }

    return [
      { label: 'Explorer le Dashboard', route: '/dashboard', icon: '🏠' },
      { label: 'Voir ma galerie', route: '/scan', icon: '🎭' },
    ];
  };

  const actions = getSuggestedActions();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-gradient-to-b from-background via-background/98 to-background/95 flex items-center justify-center p-8"
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
          }}
        />
      </div>

      <div className="relative z-10 max-w-2xl w-full space-y-8 text-center">
        {/* Badge reveal */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: 'spring',
            stiffness: 200,
            damping: 20,
            delay: 0.2 
          }}
          className="space-y-4"
        >
          <motion.div
            className="text-9xl"
            animate={{
              rotate: [0, -5, 5, -5, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1,
            }}
          >
            {emoji}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent"
          >
            {badge}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-xl text-muted-foreground"
          >
            Masque "{maskName}" intégré à ton avatar
          </motion.p>
        </motion.div>

        {/* Suggested actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="space-y-4"
        >
          <p className="text-sm text-muted-foreground">Que veux-tu faire maintenant ?</p>
          
          <div className="grid grid-cols-2 gap-4">
            {actions.map((action, index) => (
              <motion.div
                key={action.route}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
              >
                <Button
                  onClick={() => navigate(action.route)}
                  variant="outline"
                  size="lg"
                  className="w-full h-auto py-6 text-lg group hover:scale-105 transition-transform"
                >
                  <span className="text-3xl mr-3 group-hover:scale-125 transition-transform">
                    {action.icon}
                  </span>
                  <span>{action.label}</span>
                </Button>
              </motion.div>
            ))}
          </div>

          <Button
            onClick={onContinue}
            size="lg"
            className="mt-4"
          >
            Voir ma galerie de masques 🎭
          </Button>
        </motion.div>

        {/* Sparkles */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                y: [0, -50],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            >
              ✨
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
