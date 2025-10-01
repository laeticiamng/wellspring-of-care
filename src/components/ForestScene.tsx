import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Tree {
  id: number;
  x: number;
  size: number;
  type: 'pine' | 'oak' | 'willow';
  glowing: boolean;
}

interface ForestSceneProps {
  breathLevel: number;
  isActive: boolean;
}

const ForestScene = ({ breathLevel, isActive }: ForestSceneProps) => {
  const [trees, setTrees] = useState<Tree[]>([]);
  const [fireflies, setFireflies] = useState<Array<{ id: number; x: number; y: number }>>([]);

  useEffect(() => {
    // Generate forest
    const newTrees: Tree[] = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: (i / 15) * 100 + Math.random() * 5,
      size: 60 + Math.random() * 80,
      type: ['pine', 'oak', 'willow'][Math.floor(Math.random() * 3)] as Tree['type'],
      glowing: false
    }));
    setTrees(newTrees);
  }, []);

  useEffect(() => {
    if (!isActive) return;
    
    const interval = setInterval(() => {
      const newFirefly = {
        id: Date.now() + Math.random(),
        x: Math.random() * 100,
        y: 20 + Math.random() * 60
      };
      setFireflies(prev => [...prev.slice(-30), newFirefly]);
    }, 500);
    
    return () => clearInterval(interval);
  }, [isActive]);

  // Glow trees based on breath
  useEffect(() => {
    if (breathLevel > 0.7) {
      const randomTree = Math.floor(Math.random() * trees.length);
      setTrees(prev => prev.map((tree, i) => 
        i === randomTree ? { ...tree, glowing: true } : tree
      ));
      
      setTimeout(() => {
        setTrees(prev => prev.map(tree => ({ ...tree, glowing: false })));
      }, 2000);
    }
  }, [breathLevel, trees.length]);

  return (
    <div className="relative w-full h-96 bg-gradient-to-b from-indigo-950 via-green-950 to-emerald-900 overflow-hidden rounded-lg">
      {/* Moon */}
      <motion.div
        className="absolute top-10 right-20 w-20 h-20 rounded-full bg-yellow-100/80 shadow-glow-legendary"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.7, 0.9, 0.7]
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      {/* Mist layers */}
      {Array.from({ length: 3 }).map((_, i) => (
        <motion.div
          key={`mist-${i}`}
          className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-white/10 to-transparent"
          animate={{
            x: [-100, 100],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 15 + i * 5,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}

      {/* Trees */}
      <div className="absolute bottom-0 w-full h-full">
        {trees.map((tree) => (
          <motion.div
            key={tree.id}
            className="absolute bottom-0"
            style={{
              left: `${tree.x}%`,
              height: `${tree.size}px`,
            }}
          >
            {/* Tree trunk */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-12 bg-gradient-to-b from-amber-900 to-amber-950" />
            
            {/* Tree canopy */}
            <motion.div
              className={`absolute bottom-8 left-1/2 -translate-x-1/2 ${
                tree.type === 'pine' ? 'w-12 h-16' : 'w-16 h-12'
              } rounded-full transition-all duration-500`}
              style={{
                background: tree.glowing 
                  ? 'radial-gradient(circle, #34D399, #059669)'
                  : 'radial-gradient(circle, #065F46, #064E3B)',
                boxShadow: tree.glowing ? '0 0 30px rgba(52, 211, 153, 0.6)' : 'none'
              }}
              animate={{
                scale: tree.glowing ? [1, 1.2, 1] : 1,
              }}
            >
              {/* Leaves animation */}
              {tree.glowing && Array.from({ length: 5 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full bg-emerald-300"
                  style={{
                    left: '50%',
                    top: '50%'
                  }}
                  animate={{
                    x: Math.cos((i / 5) * Math.PI * 2) * 20,
                    y: Math.sin((i / 5) * Math.PI * 2) * 20,
                    opacity: [1, 0],
                    scale: [0, 1.5]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Fireflies */}
      {fireflies.map((firefly) => (
        <motion.div
          key={firefly.id}
          className="absolute w-2 h-2 rounded-full bg-yellow-200"
          style={{
            left: `${firefly.x}%`,
            top: `${firefly.y}%`,
            boxShadow: '0 0 10px rgba(253, 224, 71, 0.8)'
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0, 1.5, 1, 0],
            x: [(Math.random() - 0.5) * 100],
            y: [(Math.random() - 0.5) * 50]
          }}
          transition={{ duration: 3, ease: "easeInOut" }}
        />
      ))}

      {/* Breath indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <p className="text-emerald-300 text-lg font-light drop-shadow-lg">
          🌲 Respirez avec la forêt 🌲
        </p>
      </motion.div>
    </div>
  );
};

export default ForestScene;
