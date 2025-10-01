import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface ForestSceneProps {
  visualTheme: 'calming' | 'energizing' | 'expansive';
  audioLevel: number;
  onTreeTouch?: (treeId: number) => void;
  onMove?: () => void;
}

export function ForestScene({ visualTheme, audioLevel, onTreeTouch, onMove }: ForestSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [particles, setParticles] = useState<Array<{ x: number; y: number; vx: number; vy: number; size: number; opacity: number }>>([]);
  const animationRef = useRef<number>();

  // Couleurs selon le thème
  const themeColors = {
    calming: { primary: 'hsl(180, 70%, 50%)', secondary: 'hsl(210, 60%, 40%)', glow: 'hsl(180, 80%, 70%)' },
    energizing: { primary: 'hsl(45, 90%, 60%)', secondary: 'hsl(30, 80%, 50%)', glow: 'hsl(50, 100%, 70%)' },
    expansive: { primary: 'hsl(270, 60%, 50%)', secondary: 'hsl(290, 50%, 40%)', glow: 'hsl(280, 70%, 70%)' },
  };

  const colors = themeColors[visualTheme];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Initialiser particules
    const newParticles = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.5 + 0.3,
    }));
    setParticles(newParticles);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Fond gradient
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 2
      );
      gradient.addColorStop(0, 'hsl(220, 40%, 10%)');
      gradient.addColorStop(1, 'hsl(220, 30%, 5%)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Dessiner particules
      setParticles((prev) => {
        return prev.map((p) => {
          // Mouvement
          p.x += p.vx;
          p.y += p.vy;

          // Rebond
          if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
          if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

          // Effet audio sur taille
          const sizeMod = 1 + audioLevel * 0.3;

          // Dessin
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * sizeMod, 0, Math.PI * 2);
          ctx.fillStyle = colors.glow.replace(')', `, ${p.opacity})`).replace('hsl', 'hsla');
          ctx.fill();

          // Glow
          ctx.shadowBlur = 10 + audioLevel * 20;
          ctx.shadowColor = colors.glow;

          return p;
        });
      });

      // Dessiner "arbres" (colonnes lumineuses)
      const treeCount = 5;
      for (let i = 0; i < treeCount; i++) {
        const x = (canvas.width / (treeCount + 1)) * (i + 1);
        const baseY = canvas.height - 100;
        const height = 200 + Math.sin(Date.now() / 1000 + i) * 50 + audioLevel * 80;

        // Tronc lumineux
        const treeGradient = ctx.createLinearGradient(x, baseY, x, baseY - height);
        treeGradient.addColorStop(0, colors.primary);
        treeGradient.addColorStop(1, colors.secondary + '00');
        ctx.fillStyle = treeGradient;
        ctx.fillRect(x - 15, baseY - height, 30, height);

        // Pulsation sur la basse
        ctx.shadowBlur = 30 + audioLevel * 50;
        ctx.shadowColor = colors.primary;
        ctx.fillRect(x - 15, baseY - height, 30, height);
        ctx.shadowBlur = 0;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [visualTheme, audioLevel, colors]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;

    // Détecter quel arbre a été touché
    const treeCount = 5;
    for (let i = 0; i < treeCount; i++) {
      const treeX = (canvas.width / (treeCount + 1)) * (i + 1);
      if (Math.abs(x - treeX) < 30) {
        onTreeTouch?.(i);
        // Haptic
        if ('vibrate' in navigator) {
          navigator.vibrate(30);
        }
        break;
      }
    }

    onMove?.();
  };

  return (
    <motion.div
      className="fixed inset-0 z-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-pointer"
        onClick={handleCanvasClick}
      />
    </motion.div>
  );
}
