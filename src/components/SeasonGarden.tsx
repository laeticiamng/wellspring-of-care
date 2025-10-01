import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface SeasonGardenProps {
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  plantState?: {
    growth: number;
    type: 'sprout' | 'bush' | 'tree';
    flowers: number;
  };
  skyState?: {
    time: 'dawn' | 'day' | 'dusk' | 'night';
    weather: 'clear' | 'calm' | 'stars';
    particles: boolean;
  };
  lowStim?: boolean;
}

export function SeasonGarden({ 
  season, 
  plantState = { growth: 50, type: 'bush', flowers: 3 },
  skyState = { time: 'day', weather: 'clear', particles: true },
  lowStim = false 
}: SeasonGardenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Season colors
  const seasonPalettes = {
    spring: { sky: '#87CEEB', ground: '#90EE90', accent: '#FFB6C1' },
    summer: { sky: '#87CEFA', ground: '#98FB98', accent: '#FFD700' },
    autumn: { sky: '#CD853F', ground: '#DEB887', accent: '#FF8C00' },
    winter: { sky: '#4682B4', ground: '#E0FFFF', accent: '#B0E0E6' }
  };

  // Time colors
  const timeModifiers = {
    dawn: { multiply: 0.8, hue: 20 },
    day: { multiply: 1.0, hue: 0 },
    dusk: { multiply: 0.7, hue: -10 },
    night: { multiply: 0.4, hue: -30 }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const palette = seasonPalettes[season];
    const timeMod = timeModifiers[skyState.time];

    // Draw sky
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, palette.sky);
    gradient.addColorStop(1, adjustColor(palette.sky, timeMod.multiply));
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw ground
    ctx.fillStyle = adjustColor(palette.ground, timeMod.multiply);
    ctx.fillRect(0, canvas.height * 0.7, canvas.width, canvas.height * 0.3);

    // Draw plant
    drawPlant(ctx, canvas.width / 2, canvas.height * 0.7, plantState, palette.accent, timeMod.multiply);

    // Draw particles (if not low-stim)
    if (skyState.particles && !lowStim) {
      drawParticles(ctx, canvas, skyState.weather);
    }

    // Animation loop
    let animationId: number;
    const animate = () => {
      if (!lowStim && skyState.particles) {
        // Subtle animation
        drawParticles(ctx, canvas, skyState.weather);
      }
      animationId = requestAnimationFrame(animate);
    };

    if (!lowStim) {
      animationId = requestAnimationFrame(animate);
    }

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [season, plantState, skyState, lowStim]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="w-full h-full min-h-[400px] rounded-lg overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: 'block' }}
      />
    </motion.div>
  );
}

function adjustColor(color: string, multiplier: number): string {
  const hex = color.replace('#', '');
  const r = Math.min(255, Math.floor(parseInt(hex.substr(0, 2), 16) * multiplier));
  const g = Math.min(255, Math.floor(parseInt(hex.substr(2, 2), 16) * multiplier));
  const b = Math.min(255, Math.floor(parseInt(hex.substr(4, 2), 16) * multiplier));
  return `rgb(${r}, ${g}, ${b})`;
}

function drawPlant(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  state: { growth: number; type: string; flowers: number },
  color: string,
  timeMod: number
) {
  const height = (state.growth / 100) * 150;
  
  // Stem
  ctx.strokeStyle = adjustColor('#228B22', timeMod);
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y - height);
  ctx.stroke();

  // Branches based on type
  if (state.type === 'bush' || state.type === 'tree') {
    ctx.lineWidth = 2;
    for (let i = 0; i < 3; i++) {
      const branchY = y - (height * (0.3 + i * 0.2));
      ctx.beginPath();
      ctx.moveTo(x, branchY);
      ctx.lineTo(x - 20, branchY - 15);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, branchY);
      ctx.lineTo(x + 20, branchY - 15);
      ctx.stroke();
    }
  }

  // Flowers
  ctx.fillStyle = adjustColor(color, timeMod);
  for (let i = 0; i < Math.min(state.flowers, 5); i++) {
    const flowerX = x + (Math.random() - 0.5) * 40;
    const flowerY = y - height * 0.8 + (Math.random() - 0.5) * 30;
    ctx.beginPath();
    ctx.arc(flowerX, flowerY, 4, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawParticles(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  weather: string
) {
  const particleCount = weather === 'stars' ? 20 : 10;
  
  ctx.fillStyle = weather === 'stars' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.3)';
  
  for (let i = 0; i < particleCount; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const size = Math.random() * 2 + 1;
    
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
}
