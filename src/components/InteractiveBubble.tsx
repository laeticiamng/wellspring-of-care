import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface InteractiveBubbleProps {
  id: number;
  x: number;
  y: number;
  size: number;
  hue: number;
  onPop: (id: number) => void;
  onFloat: (id: number) => void;
}

const InteractiveBubble = ({ id, x, y, size, hue, onPop, onFloat }: InteractiveBubbleProps) => {
  const [isPopping, setIsPopping] = useState(false);
  const [particles, setParticles] = useState<{ x: number; y: number; angle: number }[]>([]);

  useEffect(() => {
    // Notify float every second
    const floatInterval = setInterval(() => {
      onFloat(id);
    }, 1000);

    return () => clearInterval(floatInterval);
  }, [id, onFloat]);

  const handlePop = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Generate particles
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      x: 0,
      y: 0,
      angle: (i * 45) * (Math.PI / 180)
    }));
    
    setParticles(newParticles);
    setIsPopping(true);
    
    // Play pop sound
    const audio = new Audio();
    audio.volume = 0.3;
    const frequency = 200 + (size / 2);
    // Simple beep using data URI
    audio.src = `data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTcIGWi77eefTRAMUKfj8LZjHAY4ktfzzHksBSR3x/DdkEAKFF606+uoVRQKRp/g8r5sIQUrgc7y2Yk3CBlou+3nn00QDFCn4/C2YxwGOJLX88x5LAUkd8fw3ZBAAhRdtOvrqFUUCkaf4PK+bCEFK4HO8tmJNwgZaLvt559NEAxQp+PwtmMcBjiS1/PMeSwFJHfH8N2QQAoUXrTr66hVFApGn+DyvmwhBSuBzvLZiTcIGWi77eefTRAMUKfj8LZjHAY4ktfzzHksBSR3x/DdkEAKFF606+uoVRQKRp/g8r5sIQUrgc7y2Yk3CBlou+3nn00QDFCn4/C2YxwGOJLX88x5LAUkd8fw3ZBACg==`;
    audio.play().catch(() => {});
    
    setTimeout(() => {
      onPop(id);
    }, 100);
  }, [id, onPop, size]);

  if (isPopping) {
    return (
      <AnimatePresence>
        <div
          className="absolute pointer-events-none"
          style={{
            left: `${x}%`,
            top: `${y}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          {particles.map((particle, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: `hsl(${hue}, 70%, 60%)`
              }}
              initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
              animate={{
                opacity: 0,
                x: Math.cos(particle.angle) * 40,
                y: Math.sin(particle.angle) * 40,
                scale: 0
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          ))}
        </div>
      </AnimatePresence>
    );
  }

  return (
    <motion.div
      className="absolute cursor-pointer group"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        transform: 'translate(-50%, -50%)'
      }}
      onClick={handlePop}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Main bubble */}
      <div 
        className="w-full h-full rounded-full relative overflow-hidden transition-all duration-300 group-hover:shadow-glow"
        style={{
          background: `radial-gradient(circle at 30% 30%, 
            hsla(${hue}, 70%, 80%, 0.8), 
            hsla(${hue}, 70%, 60%, 0.6),
            hsla(${hue}, 70%, 40%, 0.3))`,
          border: `2px solid hsla(${hue}, 70%, 90%, 0.4)`,
          boxShadow: `0 4px 20px hsla(${hue}, 70%, 50%, 0.3),
                      inset 0 0 20px hsla(${hue}, 70%, 90%, 0.2)`
        }}
      >
        {/* Shine effect */}
        <div 
          className="absolute top-2 left-2 w-1/3 h-1/3 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.8), transparent)',
          }}
        />
        
        {/* Bubble emoji */}
        <div className="absolute inset-0 flex items-center justify-center opacity-60 text-lg">
          🫧
        </div>
      </div>

      {/* Hover glow */}
      <div 
        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(circle, hsla(${hue}, 70%, 70%, 0.4), transparent)`,
          filter: 'blur(10px)',
        }}
      />
    </motion.div>
  );
};

export default InteractiveBubble;
