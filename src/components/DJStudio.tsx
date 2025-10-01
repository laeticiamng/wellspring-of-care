import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface DJStudioProps {
  valence: number;
  arousal: number;
}

export const DJStudio = ({ valence, arousal }: DJStudioProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      hue: number;
    }> = [];

    // Create particles based on mood
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * (arousal / 25),
        vy: (Math.random() - 0.5) * (arousal / 25),
        size: Math.random() * 4 + 1,
        alpha: Math.random() * 0.5 + 0.3,
        hue: valence * 1.2 + Math.random() * 30
      });
    }

    let animationId: number;
    
    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        // Update velocity based on arousal
        particle.vx = (Math.random() - 0.5) * (arousal / 25);
        particle.vy = (Math.random() - 0.5) * (arousal / 25);
        
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Update hue based on valence
        particle.hue = valence * 1.2 + Math.sin(Date.now() / 1000) * 15;

        // Draw particle with glow
        ctx.save();
        ctx.globalAlpha = particle.alpha;
        
        // Glow effect
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 4
        );
        gradient.addColorStop(0, `hsla(${particle.hue}, 80%, 60%, 0.8)`);
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Core particle
        ctx.fillStyle = `hsl(${particle.hue}, 90%, 70%)`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      });

      // Draw energy beams based on arousal
      if (arousal > 60) {
        ctx.save();
        ctx.globalAlpha = (arousal - 60) / 80;
        
        for (let i = 0; i < 3; i++) {
          const gradient = ctx.createLinearGradient(
            canvas.width / 2,
            canvas.height / 2,
            canvas.width / 2 + Math.cos(Date.now() / 500 + i * Math.PI / 1.5) * canvas.width,
            canvas.height / 2 + Math.sin(Date.now() / 500 + i * Math.PI / 1.5) * canvas.height
          );
          gradient.addColorStop(0, `hsla(${valence * 1.2}, 80%, 60%, 0.5)`);
          gradient.addColorStop(1, 'transparent');
          
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(canvas.width / 2, canvas.height / 2);
          ctx.lineTo(
            canvas.width / 2 + Math.cos(Date.now() / 500 + i * Math.PI / 1.5) * canvas.width,
            canvas.height / 2 + Math.sin(Date.now() / 500 + i * Math.PI / 1.5) * canvas.height
          );
          ctx.stroke();
        }
        
        ctx.restore();
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [valence, arousal]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 0 }}
      />
      
      {/* DJ Turntables decoration */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ zIndex: 1 }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 0.3, y: 0 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute bottom-8 left-1/4 w-24 h-24 rounded-full border-4 border-primary/30 animate-spin-slow" />
        <div className="absolute bottom-8 right-1/4 w-24 h-24 rounded-full border-4 border-accent/30 animate-spin-slow" 
             style={{ animationDirection: 'reverse' }} />
      </motion.div>
    </>
  );
};
